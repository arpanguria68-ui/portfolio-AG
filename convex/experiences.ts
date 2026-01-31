
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const experiences = await ctx.db.query("experiences").collect();
        return experiences.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); // Sort by order
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        company: v.string(),
        startDate: v.string(),
        endDate: v.optional(v.string()),
        present: v.boolean(),
        description: v.string(),
        visible: v.boolean(),
    },
    handler: async (ctx, args) => {
        const experiences = await ctx.db.query("experiences").collect();
        const maxOrder = experiences.length > 0
            ? Math.max(...experiences.map(e => e.order ?? 0))
            : 0;

        const id = await ctx.db.insert("experiences", {
            ...args,
            order: maxOrder + 1,
        });
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("experiences"),
        title: v.optional(v.string()),
        company: v.optional(v.string()),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        present: v.optional(v.boolean()),
        description: v.optional(v.string()),
        visible: v.optional(v.boolean()),
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
    args: { id: v.id("experiences") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const reorder = mutation({
    args: {
        items: v.array(v.object({ id: v.id("experiences"), order: v.number() })),
    },
    handler: async (ctx, args) => {
        for (const item of args.items) {
            await ctx.db.patch(item.id, { order: item.order });
        }
    },
});
