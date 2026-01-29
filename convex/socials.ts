import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const socials = await ctx.db.query("socialLinks").collect();
        return socials.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
});

export const create = mutation({
    args: {
        platform: v.string(),
        handle: v.string(),
        url: v.string(),
        icon: v.string(),
        visible: v.boolean(),
        color: v.optional(v.string()),
        bgColor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const socials = await ctx.db.query("socialLinks").collect();
        const maxOrder = socials.length > 0
            ? Math.max(...socials.map(s => s.order ?? 0))
            : 0;

        const id = await ctx.db.insert("socialLinks", {
            ...args,
            order: maxOrder + 1,
        });
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("socialLinks"),
        platform: v.optional(v.string()),
        handle: v.optional(v.string()),
        url: v.optional(v.string()),
        icon: v.optional(v.string()),
        visible: v.optional(v.boolean()),
        color: v.optional(v.string()),
        bgColor: v.optional(v.string()),
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
    args: { id: v.id("socialLinks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
