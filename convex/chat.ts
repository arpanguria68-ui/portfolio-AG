import {
    query,
    mutation,
    action,
    internalMutation,
    MutationCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

export const getHistory = query({
    args: { sessionId: v.string() },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("chatMessages")
            .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
            .order("asc")
            .collect();
        return messages;
    },
});

async function upsertSession(
    ctx: MutationCtx,
    sessionId: string,
    timestamp: number
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
        });
    } else {
        await ctx.db.patch(existingSession._id, {
            lastMessageAt: timestamp,
        });
    }
}

export const storeMessage = mutation({
    args: {
        sessionId: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const timestamp = Date.now();
        const content = args.content.trim();
        if (!content) {
            throw new Error("Message cannot be empty");
        }

        await upsertSession(ctx, args.sessionId, timestamp);

        const messageId = await ctx.db.insert("chatMessages", {
            sessionId: args.sessionId,
            role: "user",
            content,
            timestamp,
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
        const timestamp = Date.now();

        await upsertSession(ctx, args.sessionId, timestamp);

        const messageId = await ctx.db.insert("chatMessages", {
            sessionId: args.sessionId,
            role: "assistant",
            content: args.content,
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

export const sendToGemini = action({
    args: {
        sessionId: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args): Promise<string> => {
        const GEMINI_API_KEY = await ctx.runQuery(internal.settings.getSecret, {
            key: "gemini_api_key",
        });
        const GEMINI_MODEL = await ctx.runQuery(internal.settings.getSecret, {
            key: "gemini_model",
        });

        const apiKey = GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        const model = GEMINI_MODEL || "gemini-1.5-flash";

        if (!apiKey) {
            const fallbackResponse =
                "Hi! I'm the AI assistant for this portfolio. The Gemini API key hasn't been configured yet in the new Admin Settings panel. Please log in and set it up to chat with me!";

            await ctx.runMutation(internal.chat.storeAssistantMessage, {
                sessionId: args.sessionId,
                content: fallbackResponse,
            });

            return fallbackResponse;
        }

        const history = await ctx.runQuery(api.chat.getHistory, {
            sessionId: args.sessionId,
        });

        const conversationHistory = history.slice(-10).map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        conversationHistory.push({
            role: "user",
            parts: [{ text: args.message }],
        });

        let contextText = "";
        try {
            const searchResults = await ctx.runAction(internal.rag.search, {
                query: args.message,
                limit: 3,
            });
            if (searchResults && searchResults.length > 0) {
                contextText = searchResults
                    .map(
                        (doc) =>
                            `--- ${doc.type.toUpperCase()}: ${doc.title} ---\n${doc.text}`
                    )
                    .join("\n\n");
            }
        } catch (e) {
            console.error("RAG Search failed:", e);
        }

        const systemInstruction = `You are a helpful AI assistant for Arpan Guria's portfolio website. 
You help visitors learn about his work, skills, and projects.
Be friendly, professional, and concise.

Use the following CONTEXT from his CV and Projects to answer the user's question. 
If the answer is not in the context, just rely on your general knowledge but mention you aren't sure about specific portfolio details.

CONTEXT:
${contextText || "No specific portfolio context found for this query."}

Keep responses brief (2-3 sentences) unless more detail is requested.`;

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
                            maxOutputTokens: 500,
                        },
                    }),
                }
            );
        };

        try {
            let response = await callGemini(model);

            if (
                !response.ok &&
                (response.status === 429 || response.status === 404)
            ) {
                console.warn(
                    `Primary model ${model} failed (${response.status}). Retrying with gemini-2.5-flash-lite...`
                );
                if (model !== "gemini-2.5-flash-lite") {
                    response = await callGemini("gemini-2.5-flash-lite");
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 400) throw new Error("Invalid API Key");
                throw new Error(
                    `Gemini API error: ${response.status} - ${errorText}`
                );
            }

            const data: GeminiResponse = await response.json();
            const aiResponse =
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I apologize, I couldn't process that request. Please try again.";

            await ctx.runMutation(internal.chat.storeAssistantMessage, {
                sessionId: args.sessionId,
                content: aiResponse,
            });

            return aiResponse;
        } catch (error) {
            console.error("Gemini API error:", error);

            let errorResponse =
                "I'm having trouble connecting right now. Please try again in a moment.";
            if (error instanceof Error && error.message === "Invalid API Key") {
                errorResponse =
                    "The configured Gemini API Key seems to be invalid. Please check the Admin Settings.";
            }

            await ctx.runMutation(internal.chat.storeAssistantMessage, {
                sessionId: args.sessionId,
                content: errorResponse,
            });

            return errorResponse;
        }
    },
});
