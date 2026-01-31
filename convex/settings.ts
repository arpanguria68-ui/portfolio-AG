import { internal } from "./_generated/api";
import { mutation, query, internalQuery, action } from "./_generated/server";
import { v } from "convex/values";

// Set a setting (Protected mutation - in real app add auth check)
export const set = mutation({
    args: {
        key: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("settings", {
                key: args.key,
                value: args.value,
            });
        }
    },
});

// Check if a setting exists (Mainly for UI status)
export const isSet = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        const setting = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();
        return !!setting && !!setting.value;
    },
});

// Internal query to get the actual value (Secure backend use only)
export const getSecret = internalQuery({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        const setting = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();
        return setting?.value;
    },
});

// Public query to get non-sensitive settings
export const get = query({
    args: { key: v.string() },
    handler: async (ctx, args) => {
        // Allow list for public settings
        const ALLOWED_KEYS = ["gemini_model"];

        if (!ALLOWED_KEYS.includes(args.key)) {
            return null;
        }

        const setting = await ctx.db
            .query("settings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .first();
        return setting?.value;
    },
});

// Test connection to Gemini API
export const testGeminiConnection = action({
    args: {},
    handler: async (ctx): Promise<{ success: boolean; message: string }> => {
        // Securely fetch API key using internal query
        const apiKey: string | null = await ctx.runQuery(internal.settings.getSecret, { key: "gemini_api_key" });
        const model: string = await ctx.runQuery(internal.settings.getSecret, { key: "gemini_model" }) || "gemini-1.5-flash";

        if (!apiKey) {
            return { success: false, message: "API Key not found in settings." };
        }

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "Hello, this is a connection test." }] }],
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `API Error ${response.status}`;

                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.error) {
                        if (errorJson.error.status === "RESOURCE_EXHAUSTED") {
                            errorMessage = "Quota Limit Exceeded. This model may not be available on your plan. Try 'Gemini 1.5 Flash'.";
                        } else {
                            errorMessage = errorJson.error.message || errorJson.error.status;
                        }
                    }
                } catch (e) {
                    errorMessage += `: ${errorText}`;
                }

                return { success: false, message: errorMessage };
            }

            await response.json();
            return { success: true, message: "Connected to Gemini successfully! Model: " + model };
        } catch (error: any) {
            return { success: false, message: "Network/Server Error: " + error.message };
        }
    },
});
