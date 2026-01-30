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
        publicId: v.string(),
        size: v.string(),
        format: v.string(),
        width: v.number(),
        height: v.number(),
        status: v.string(),
        title: v.optional(v.string()),
        subtitle: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("media", {
            name: args.name,
            url: args.url,
            publicId: args.publicId,
            size: args.size,
            format: args.format,
            width: args.width,
            height: args.height,
            status: args.status,
            title: args.title,
            subtitle: args.subtitle,
            category: args.category,
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
        title: v.optional(v.string()),
        subtitle: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        // Check if document exists
        const existing = await ctx.db.get(id);
        if (!existing) {
            throw new Error("Media item not found");
        }

        // Build update object, only including fields that are explicitly provided
        const updateObj: Record<string, string | undefined> = {};
        if (updates.name !== undefined) updateObj.name = updates.name;
        if (updates.url !== undefined) updateObj.url = updates.url;
        if (updates.status !== undefined) updateObj.status = updates.status;
        if (updates.title !== undefined) updateObj.title = updates.title;
        if (updates.subtitle !== undefined) updateObj.subtitle = updates.subtitle;
        if (updates.category !== undefined) updateObj.category = updates.category;

        // Only patch if there are updates
        if (Object.keys(updateObj).length > 0) {
            await ctx.db.patch(id, updateObj);
        }

        return { success: true };
    },
});

export const remove = mutation({
    args: { id: v.id("media") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
