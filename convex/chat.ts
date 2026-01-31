import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

// Get chat history for a session
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

// Store a user message
export const storeMessage = mutation({
    args: {
        sessionId: v.string(),
        role: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const timestamp = Date.now();

        // Ensure session exists
        const existingSession = await ctx.db
            .query("chatSessions")
            .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
            .first();

        if (!existingSession) {
            await ctx.db.insert("chatSessions", {
                sessionId: args.sessionId,
                createdAt: timestamp,
                lastMessageAt: timestamp,
            });
        } else {
            await ctx.db.patch(existingSession._id, {
                lastMessageAt: timestamp,
            });
        }

        // Store the message
        const messageId = await ctx.db.insert("chatMessages", {
            sessionId: args.sessionId,
            role: args.role,
            content: args.content,
            timestamp,
        });

        return messageId;
    },
});

// Type for Gemini API response
interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

// Action to call Gemini API
export const sendToGemini = action({
    args: {
        sessionId: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args): Promise<string> => {
        // Fetch API key from settings table
        // We use internal query to keep it safe from client-side usage
        const GEMINI_API_KEY = await ctx.runQuery(internal.settings.getSecret, { key: "gemini_api_key" });
        const GEMINI_MODEL = await ctx.runQuery(internal.settings.getSecret, { key: "gemini_model" });

        // Fallback to Env var if not in DB (for backward compat)
        const apiKey = GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        // Default model if not set
        const model = GEMINI_MODEL || "gemini-1.5-flash";

        if (!apiKey) {
            // If no API key, return a helpful message
            const fallbackResponse = "Hi! I'm the AI assistant for this portfolio. The Gemini API key hasn't been configured yet in the new Admin Settings panel. Please log in and set it up to chat with me!";

            await ctx.runMutation(api.chat.storeMessage, {
                sessionId: args.sessionId,
                role: "assistant",
                content: fallbackResponse,
            });

            return fallbackResponse;
        }

        // Get conversation history for context
        const history = await ctx.runQuery(api.chat.getHistory, {
            sessionId: args.sessionId,
        });

        // Build conversation context (map role correctly for Gemini)
        const conversationHistory = history.slice(-10).map((msg: any) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        // Add the new user message
        conversationHistory.push({
            role: "user",
            parts: [{ text: args.message }],
        });

        // System instruction for the AI
        const systemInstruction = `You are a helpful AI assistant for a portfolio website. 
You help visitors learn about the portfolio owner's work, skills, and projects.
Be friendly, concise, and helpful. If asked about specific projects or skills, 
provide relevant information based on what you know about the portfolio.
Keep responses brief (2-3 sentences) unless more detail is requested.`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
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

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Gemini API Key Error: ${response.status} - ${errorText}`);

                // Check if it's an invalid key error
                if (response.status === 400) {
                    throw new Error("Invalid API Key");
                }
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data: GeminiResponse = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I apologize, I couldn't process that request. Please try again.";

            // Store AI response
            await ctx.runMutation(api.chat.storeMessage, {
                sessionId: args.sessionId,
                role: "assistant",
                content: aiResponse,
            });

            return aiResponse;
        } catch (error) {
            console.error("Gemini API error:", error);

            let errorResponse = "I'm having trouble connecting right now. Please try again in a moment.";
            if (error instanceof Error && error.message === "Invalid API Key") {
                errorResponse = "The configured Gemini API Key seems to be invalid. Please check the Admin Settings.";
            }

            await ctx.runMutation(api.chat.storeMessage, {
                sessionId: args.sessionId,
                role: "assistant",
                content: errorResponse,
            });

            return errorResponse;
        }
    },
});
