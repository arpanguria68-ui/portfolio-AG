import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    handler: async (ctx) => {
        return await ctx.db.query("resumes").collect();
    },
});

export const create = mutation({
    args: {
        label: v.string(),
        url: v.string(),
        visible: v.boolean(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.query("resumes").collect();
        const order = existing.length;
        await ctx.db.insert("resumes", {
            label: args.label,
            url: args.url,
            visible: args.visible,
            order,
        });
    },
});

export const remove = mutation({
    args: { id: v.id("resumes") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const update = mutation({
    args: {
        id: v.id("resumes"),
        label: v.optional(v.string()),
        url: v.optional(v.string()),
        visible: v.optional(v.boolean()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});
