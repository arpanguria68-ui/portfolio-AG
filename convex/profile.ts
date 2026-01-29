import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const profile = await ctx.db
            .query("profile")
            .filter((q) => q.eq(q.field("key"), "main"))
            .first();
        return profile;
    },
});

export const upsert = mutation({
    args: {
        headline: v.optional(v.string()),
        bio: v.optional(v.string()),
        profileImage: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("profile")
            .filter((q) => q.eq(q.field("key"), "main"))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                headline: args.headline,
                bio: args.bio,
                profileImage: args.profileImage,
            });
            return existing._id;
        } else {
            const id = await ctx.db.insert("profile", {
                key: "main",
                headline: args.headline,
                bio: args.bio,
                profileImage: args.profileImage,
            });
            return id;
        }
    },
});
