import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const messages = await ctx.db
            .query("messages")
            .order("desc")
            .collect();
        return messages;
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("messages", {
            name: args.name,
            email: args.email,
            message: args.message,
            read: false,
        });
        return messageId;
    },
});

export const markRead = mutation({
    args: { id: v.id("messages") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { read: true });
    },
});

export const remove = mutation({
    args: { id: v.id("messages") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
