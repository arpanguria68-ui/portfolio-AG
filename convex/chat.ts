import {
    query,
    action,
    internalMutation,
    internalAction,
} from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import {
    CHAT_SECURITY,
    buildSlidingWindowHistory,
    buildSystemInstruction,
    detectPromptInjection,
    getInjectionRefusalMessage,
    getRagQuery,
    validateSessionId,
    validateUserMessage,
} from "./lib/chatHarness";
import { checkChatRateLimit, getRemainingQuota } from "./lib/chatRateLimit";

type RagSearchDocument = {
    title: string;
    text: string;
    type: string;
};

export const getLimits = query({
    args: {},
    handler: async () => ({
        maxMessageLength: CHAT_SECURITY.MAX_MESSAGE_LENGTH,
        maxMessagesPerHour: CHAT_SECURITY.MAX_MESSAGES_PER_HOUR,
        maxMessagesPerDay: CHAT_SECURITY.MAX_MESSAGES_PER_DAY,
        minMessageIntervalMs: CHAT_SECURITY.MIN_MESSAGE_INTERVAL_MS,
    }),
});

export const getSessionStatus = query({
    args: { sessionId: v.string() },
    handler: async (ctx, args) => {
        const sessionValidation = validateSessionId(args.sessionId);
        if (!sessionValidation.ok) {
            return null;
        }

        const now = Date.now();
        const messages = await ctx.db
            .query("chatMessages")
            .withIndex("by_session", (q) =>
                q.eq("sessionId", sessionValidation.content)
            )
            .collect();

        const userMessages = messages
            .filter((message) => message.role === "user")
            .map((message) => ({ timestamp: message.timestamp }));

        const session = await ctx.db
            .query("chatSessions")
            .withIndex("by_session", (q) =>
                q.eq("sessionId", sessionValidation.content)
            )
            .first();

        const rateLimit = checkChatRateLimit({
            now,
            lastUserMessageAt: session?.lastUserMessageAt,
            blockedUntil: session?.blockedUntil,
            userMessages,
        });

        return {
            ...getRemainingQuota(userMessages, now),
            allowed: rateLimit.allowed,
            retryAfterMs: rateLimit.allowed ? 0 : rateLimit.retryAfterMs ?? 0,
        };
    },
});

export const getHistory = query({
    args: { sessionId: v.string() },
    handler: async (ctx, args) => {
        const sessionValidation = validateSessionId(args.sessionId);
        if (!sessionValidation.ok) {
            return [];
        }

        const messages = await ctx.db
            .query("chatMessages")
            .withIndex("by_session", (q) =>
                q.eq("sessionId", sessionValidation.content)
            )
            .order("asc")
            .collect();

        return messages.slice(-CHAT_SECURITY.MAX_HISTORY_FOR_CLIENT);
    },
});

async function upsertSession(
    ctx: MutationCtx,
    sessionId: string,
    timestamp: number,
    patch?: {
        lastUserMessageAt?: number;
        blockedUntil?: number;
    }
) {
    const existingSession = await ctx.db
        .query("chatSessions")
        .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
        .first();

    if (!existingSession) {
        await ctx.db.insert("chatSessions", {
            sessionId,
            createdAt: timestamp,
            lastMessageAt: timestamp,
            lastUserMessageAt: patch?.lastUserMessageAt,
            blockedUntil: patch?.blockedUntil,
        });
        return;
    }

    await ctx.db.patch(existingSession._id, {
        lastMessageAt: timestamp,
        ...(patch?.lastUserMessageAt !== undefined
            ? { lastUserMessageAt: patch.lastUserMessageAt }
            : {}),
        ...(patch?.blockedUntil !== undefined
            ? { blockedUntil: patch.blockedUntil }
            : {}),
    });
}

export const storeUserMessage = internalMutation({
    args: {
        sessionId: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const sessionValidation = validateSessionId(args.sessionId);
        if (!sessionValidation.ok) {
            throw new ConvexError(sessionValidation.reason);
        }

        const messageValidation = validateUserMessage(args.content);
        if (!messageValidation.ok) {
            throw new ConvexError(messageValidation.reason);
        }

        const now = Date.now();
        const sessionId = sessionValidation.content;
        const session = await ctx.db
            .query("chatSessions")
            .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
            .first();

        const sessionMessages = await ctx.db
            .query("chatMessages")
            .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
            .collect();

        const userMessages = sessionMessages
            .filter((message) => message.role === "user")
            .map((message) => ({ timestamp: message.timestamp }));

        const rateLimit = checkChatRateLimit({
            now,
            lastUserMessageAt: session?.lastUserMessageAt,
            blockedUntil: session?.blockedUntil,
            userMessages,
        });

        if (!rateLimit.allowed) {
            if (rateLimit.shouldBlock && session) {
                await ctx.db.patch(session._id, {
                    blockedUntil: now + CHAT_SECURITY.BLOCK_DURATION_MS,
                });
            } else if (rateLimit.shouldBlock) {
                await upsertSession(ctx, sessionId, now, {
                    blockedUntil: now + CHAT_SECURITY.BLOCK_DURATION_MS,
                });
            }
            throw new ConvexError(rateLimit.reason);
        }

        if (session) {
            await ctx.db.patch(session._id, {
                lastMessageAt: now,
                lastUserMessageAt: now,
                blockedUntil: undefined,
            });
        } else {
            await upsertSession(ctx, sessionId, now, {
                lastUserMessageAt: now,
            });
        }

        const messageId = await ctx.db.insert("chatMessages", {
            sessionId,
            role: "user",
            content: messageValidation.content,
            timestamp: now,
        });

        return messageId;
    },
});

export const storeAssistantMessage = internalMutation({
    args: {
        sessionId: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const sessionValidation = validateSessionId(args.sessionId);
        if (!sessionValidation.ok) {
            throw new ConvexError(sessionValidation.reason);
        }

        const timestamp = Date.now();
        const sessionId = sessionValidation.content;

        await upsertSession(ctx, sessionId, timestamp);

        const messageId = await ctx.db.insert("chatMessages", {
            sessionId,
            role: "assistant",
            content: args.content.slice(0, CHAT_SECURITY.MAX_MESSAGE_LENGTH * 2),
            timestamp,
        });

        return messageId;
    },
});

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

async function parseGeminiError(response: Response): Promise<string> {
    const errorText = await response.text();
    try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
            return errorJson.error.message;
        }
    } catch {
        // Fall through to generic message.
    }
    return `Gemini API error: ${response.status}`;
}

export const generateAssistantReply = internalAction({
    args: {
        sessionId: v.string(),
        message: v.string(),
        skipRag: v.optional(v.boolean()),
    },
    handler: async (ctx, args): Promise<string> => {
        const sessionValidation = validateSessionId(args.sessionId);
        if (!sessionValidation.ok) {
            throw new ConvexError(sessionValidation.reason);
        }

        const messageValidation = validateUserMessage(args.message);
        if (!messageValidation.ok) {
            throw new ConvexError(messageValidation.reason);
        }

        const sessionId = sessionValidation.content;
        const content = messageValidation.content;

        if (detectPromptInjection(content)) {
            const refusal = getInjectionRefusalMessage();
            await ctx.runMutation(internal.chat.storeAssistantMessage, {
                sessionId,
                content: refusal,
            });
            return refusal;
        }

        const geminiApiKey = await ctx.runQuery(internal.settings.getSecret, {
            key: "gemini_api_key",
        });
        const geminiModel = await ctx.runQuery(internal.settings.getSecret, {
            key: "gemini_model",
        });

        const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;
        const model = geminiModel || "gemini-2.5-flash-lite";

        if (!apiKey) {
            const fallbackResponse =
                "Hi! I'm the AI assistant for this portfolio. The Gemini API key hasn't been configured yet in Admin Settings.";

            await ctx.runMutation(internal.chat.storeAssistantMessage, {
                sessionId,
                content: fallbackResponse,
            });

            return fallbackResponse;
        }

        const history = await ctx.runQuery(api.chat.getHistory, { sessionId });
        const conversationHistory = buildSlidingWindowHistory(history);

        let contextText = "";
        const ragQuery = args.skipRag ? null : getRagQuery(content);
        if (ragQuery) {
            try {
                const searchResults: RagSearchDocument[] = await ctx.runAction(
                    internal.rag.search,
                    {
                        query: ragQuery,
                        limit: 3,
                    }
                );
                if (searchResults.length > 0) {
                    contextText = searchResults
                        .map(
                            (doc) =>
                                `--- ${doc.type.toUpperCase()}: ${doc.title} ---\n${doc.text}`
                        )
                        .join("\n\n");
                }
            } catch (error) {
                console.error("RAG search failed:", error);
            }
        }

        const systemInstruction = buildSystemInstruction(contextText);

        const callGemini = async (modelToUse: string) => {
            return fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: conversationHistory,
                        systemInstruction: {
                            parts: [{ text: systemInstruction }],
                        },
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: CHAT_SECURITY.MAX_OUTPUT_TOKENS,
                        },
                        safetySettings: [
                            {
                                category: "HARM_CATEGORY_HARASSMENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE",
                            },
                            {
                                category: "HARM_CATEGORY_HATE_SPEECH",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE",
                            },
                            {
                                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE",
                            },
                            {
                                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                                threshold: "BLOCK_MEDIUM_AND_ABOVE",
                            },
                        ],
                    }),
                }
            );
        };

        try {
            const fallbackModels = [
                model,
                "gemini-2.5-flash-lite",
                "gemini-2.0-flash",
            ].filter((value, index, array) => array.indexOf(value) === index);

            let response: Response | null = null;
            let lastError = "Unknown Gemini API error";

            for (const modelToUse of fallbackModels) {
                response = await callGemini(modelToUse);

                if (response.ok) {
                    break;
                }

                lastError = await parseGeminiError(response);

                if (response.status !== 429 && response.status !== 404) {
                    break;
                }
            }

            if (!response || !response.ok) {
                if (response?.status === 400) {
                    throw new Error("Invalid API Key");
                }
                throw new Error(lastError);
            }

            const data: GeminiResponse = await response.json();
            const aiResponse =
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I apologize, I couldn't process that request. Please try again.";

            await ctx.runMutation(internal.chat.storeAssistantMessage, {
                sessionId,
                content: aiResponse,
            });

            return aiResponse;
        } catch (error) {
            console.error("Gemini API error:", error);

            let errorResponse =
                "I'm having trouble connecting right now. Please try again in a moment.";
            if (error instanceof Error && error.message === "Invalid API Key") {
                errorResponse =
                    "The configured Gemini API Key seems to be invalid. Please check Admin Settings.";
            }

            await ctx.runMutation(internal.chat.storeAssistantMessage, {
                sessionId,
                content: errorResponse,
            });

            return errorResponse;
        }
    },
});

export const sendMessage = action({
    args: {
        sessionId: v.string(),
        content: v.string(),
        website: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<{ content: string }> => {
        if (args.website && args.website.trim() !== "") {
            return { content: "Thanks for your message!" };
        }

        const sessionValidation = validateSessionId(args.sessionId);
        if (!sessionValidation.ok) {
            throw new ConvexError(sessionValidation.reason);
        }

        const messageValidation = validateUserMessage(args.content);
        if (!messageValidation.ok) {
            throw new ConvexError(messageValidation.reason);
        }

        const sessionId = sessionValidation.content;
        const content = messageValidation.content;

        await ctx.runMutation(internal.chat.storeUserMessage, {
            sessionId,
            content,
        });

        const reply = await ctx.runAction(internal.chat.generateAssistantReply, {
            sessionId,
            message: content,
        });

        return { content: reply };
    },
});
