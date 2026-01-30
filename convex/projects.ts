import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.db
            .query("projects")
            .order("desc")
            .collect();
        return projects;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        year: v.string(),
        tags: v.array(v.string()),
        image: v.string(),
        link: v.optional(v.string()),
        sections: v.optional(v.array(v.object({
            id: v.number(),
            type: v.string(),
            title: v.string(),
            content: v.string(),
            collapsed: v.boolean(),
            icon: v.string(),
            isEnabled: v.boolean(),
        }))),
    },
    handler: async (ctx, args) => {
        const projectId = await ctx.db.insert("projects", {
            title: args.title,
            description: args.description,
            year: args.year,
            tags: args.tags,
            image: args.image,
            link: args.link,
            sections: args.sections,
        });
        return projectId;
    },
});

export const update = mutation({
    args: {
        id: v.id("projects"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        year: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        image: v.optional(v.string()),
        link: v.optional(v.string()),
        sections: v.optional(v.array(v.object({
            id: v.number(),
            type: v.string(),
            title: v.string(),
            content: v.string(),
            collapsed: v.boolean(),
            icon: v.string(),
            isEnabled: v.boolean(),
        }))),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        // Filter out undefined values
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, value]) => value !== undefined)
        );
        await ctx.db.patch(id, filteredUpdates);
    },
});

export const remove = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
