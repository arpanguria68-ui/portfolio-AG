import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const skills = await ctx.db
            .query("skills")
            .collect();
        // Sort by order field
        return skills.sort((a, b) => a.order - b.order);
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        value: v.number(),
        visible: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Get max order
        const skills = await ctx.db.query("skills").collect();
        const maxOrder = skills.length > 0
            ? Math.max(...skills.map(s => s.order))
            : 0;

        const id = await ctx.db.insert("skills", {
            name: args.name,
            value: args.value,
            visible: args.visible,
            order: maxOrder + 1,
        });
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("skills"),
        name: v.optional(v.string()),
        value: v.optional(v.number()),
        visible: v.optional(v.boolean()),
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
    args: { id: v.id("skills") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const reorder = mutation({
    args: {
        items: v.array(v.object({ id: v.id("skills"), order: v.number() })),
    },
    handler: async (ctx, args) => {
        for (const item of args.items) {
            await ctx.db.patch(item.id, { order: item.order });
        }
    },
});
