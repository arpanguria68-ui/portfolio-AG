import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.db
            .query("projects")
            .collect();
        return projects.sort((a, b) => {
            const aHasOrder = a.order !== undefined;
            const bHasOrder = b.order !== undefined;

            if (aHasOrder && bHasOrder) {
                return (a.order ?? 0) - (b.order ?? 0);
            }

            if (aHasOrder !== bHasOrder) {
                return aHasOrder ? -1 : 1;
            }

            return (b.creationDate ?? b._creationTime) - (a.creationDate ?? a._creationTime);
        });
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
        category: v.optional(v.string()),
        creationDate: v.optional(v.number()),
        order: v.optional(v.number()),
        sections: v.optional(v.array(v.object({
            id: v.number(),
            type: v.string(),
            title: v.string(),
            content: v.string(),
            collapsed: v.boolean(),
            icon: v.string(),
            isEnabled: v.boolean(),
            image: v.optional(v.string()),
        }))),
    },
    handler: async (ctx, args) => {
        const projects = await ctx.db.query("projects").collect();
        const maxOrder = projects.reduce(
            (highest, project) => Math.max(highest, project.order ?? -1),
            projects.length - 1
        );

        const projectId = await ctx.db.insert("projects", {
            title: args.title,
            description: args.description,
            year: args.year,
            tags: args.tags,
            image: args.image,
            link: args.link,
            category: args.category,
            creationDate: args.creationDate,
            order: args.order ?? maxOrder + 1,
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
        category: v.optional(v.string()),
        creationDate: v.optional(v.number()),
        order: v.optional(v.number()),
        sections: v.optional(v.array(v.object({
            id: v.number(),
            type: v.string(),
            title: v.string(),
            content: v.string(),
            collapsed: v.boolean(),
            icon: v.string(),
            isEnabled: v.boolean(),
            image: v.optional(v.string()),
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

export const reorder = mutation({
    args: {
        items: v.array(v.object({ id: v.id("projects"), order: v.number() })),
    },
    handler: async (ctx, args) => {
        for (const item of args.items) {
            await ctx.db.patch(item.id, { order: item.order });
        }
    },
});
