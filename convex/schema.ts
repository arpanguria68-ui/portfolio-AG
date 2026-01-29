import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    messages: defineTable({
        name: v.string(),
        email: v.string(),
        message: v.string(),
        read: v.boolean(),
    }),

    projects: defineTable({
        title: v.string(),
        description: v.string(),
        year: v.string(),
        tags: v.array(v.string()),
        image: v.string(),
        link: v.optional(v.string()),
    }),

    socialLinks: defineTable({
        platform: v.string(),
        handle: v.string(),
        url: v.string(),
        icon: v.string(),
        visible: v.boolean(),
        color: v.optional(v.string()),
        bgColor: v.optional(v.string()),
        order: v.optional(v.number()),
    }),

    profile: defineTable({
        key: v.string(), // singleton key = "main"
        headline: v.optional(v.string()),
        bio: v.optional(v.string()),
        profileImage: v.optional(v.string()),
    }),

    skills: defineTable({
        name: v.string(),
        value: v.number(),
        visible: v.boolean(),
        order: v.number(),
    }),

    media: defineTable({
        name: v.string(),
        url: v.string(),
        publicId: v.string(), // Cloudinary public_id for delete operations
        size: v.string(),
        format: v.string(),
        width: v.number(),
        height: v.number(),
        status: v.string(), // 'used' | 'unused'
    }),
});
