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
    }),

    profile: defineTable({
        bio: v.optional(v.string()),
        headline: v.optional(v.string()),
        subHeadline: v.optional(v.string()),
        email: v.optional(v.string()),
        resumeUrl: v.optional(v.string()),
    }),
});
