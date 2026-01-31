import { query, mutation, internalQuery } from "./_generated/server";
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
