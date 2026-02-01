import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    visits: defineTable({
        date: v.string(), // YYYY-MM-DD
        count: v.number(),
    }).index("by_date", ["date"]),

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
        sections: v.optional(v.array(v.object({
            id: v.number(),
            type: v.string(),
            title: v.string(),
            content: v.string(),
            image: v.optional(v.string()),
            collapsed: v.boolean(),
            icon: v.string(),
            isEnabled: v.boolean(),
        }))),
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

    experiences: defineTable({
        title: v.string(),
        company: v.string(),
        startDate: v.string(),
        endDate: v.optional(v.string()), // Optional if currently working
        present: v.boolean(),
        description: v.string(),
        visible: v.boolean(),
        order: v.number(),
    }),

    resumes: defineTable({
        label: v.string(), // e.g. "Indian Version", "Global Format"
        url: v.string(), // GDrive Link
        order: v.number(),
        visible: v.boolean(),
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

    tools: defineTable({
        name: v.string(),
        icon: v.string(), // Material Symbols icon name
        bgColor: v.string(), // Tailwind bg class
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
        title: v.optional(v.string()), // Display title for highlights
        subtitle: v.optional(v.string()), // Location/date info
        category: v.optional(v.string()), // 'Workshop' | 'Certification' | 'Keynote' etc
    }),

    // AI Chat tables
    chatSessions: defineTable({
        sessionId: v.string(), // Browser fingerprint or UUID
        createdAt: v.number(),
        lastMessageAt: v.number(),
    }).index("by_session", ["sessionId"]),

    chatMessages: defineTable({
        sessionId: v.string(),
        role: v.string(), // 'user' | 'assistant'
        content: v.string(),
        timestamp: v.number(),
    }).index("by_session", ["sessionId"]),

    documents: defineTable({
        title: v.string(),
        text: v.string(),
        type: v.string(), // 'project' | 'cv' | 'experience'
        sourceId: v.optional(v.string()),
        embedding: v.array(v.number()),
    }).vectorIndex("by_embedding", {
        vectorField: "embedding",
        dimensions: 768, // text-embedding-004 standard
    }),

    settings: defineTable({
        key: v.string(), // e.g., "gemini_api_key"
        value: v.string(),
    }).index("by_key", ["key"]),
});
