import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const tools = await ctx.db
            .query("tools")
            .collect();
        return tools.sort((a, b) => a.order - b.order);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        icon: v.string(),
        bgColor: v.string(),
    },
    handler: async (ctx, args) => {
        const tools = await ctx.db.query("tools").collect();
        const maxOrder = tools.length > 0
            ? Math.max(...tools.map(t => t.order))
            : 0;

        const id = await ctx.db.insert("tools", {
            name: args.name,
            icon: args.icon,
            bgColor: args.bgColor,
            order: maxOrder + 1,
        });
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("tools"),
        name: v.optional(v.string()),
        icon: v.optional(v.string()),
        bgColor: v.optional(v.string()),
        order: v.optional(v.number()),
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
    args: { id: v.id("tools") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
