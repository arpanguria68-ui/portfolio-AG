import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const media = await ctx.db
            .query("media")
            .order("desc")
            .collect();
        return media;
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        url: v.string(),
        size: v.string(),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("media", {
            name: args.name,
            url: args.url,
            size: args.size,
            status: args.status,
        });
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("media"),
        name: v.optional(v.string()),
        url: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined)
        );
        await ctx.db.patch(id, filteredUpdates);
    },
});

export const remove = mutation({
    args: { id: v.id("media") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
