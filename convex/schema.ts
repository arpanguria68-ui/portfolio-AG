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
    }).index("by_email", ["email"]),

    projects: defineTable({
        title: v.string(),
        description: v.string(),
        year: v.string(),
        tags: v.array(v.string()),
        image: v.string(),
        link: v.optional(v.string()),
        category: v.optional(v.string()),
        creationDate: v.optional(v.number()),
        sections: v.optional(
            v.array(
                v.object({
                    id: v.number(),
                    type: v.string(),
                    title: v.string(),
                    content: v.string(),
                    image: v.optional(v.string()),
                    collapsed: v.boolean(),
                    icon: v.string(),
                    isEnabled: v.boolean(),
                })
            )
        ),
    }),

    experiences: defineTable({
        title: v.string(),
        company: v.string(),
        location: v.string(),
        period: v.string(),
        description: v.string(),
        isEnabled: v.boolean(),
        sortOrder: v.number(),
    }),

    skills: defineTable({
        name: v.string(),
        category: v.string(),
        proficiency: v.number(),
        isEnabled: v.boolean(),
        sortOrder: v.number(),
    }),

    profile: defineTable({
        name: v.string(),
        title: v.string(),
        subtitle: v.string(),
        bio: v.string(),
        email: v.string(),
        location: v.string(),
        profileImage: v.string(),
        yearsExperience: v.number(),
        socialLinks: v.optional(
            v.object({
                linkedin: v.optional(v.string()),
                twitter: v.optional(v.string()),
                github: v.optional(v.string()),
                website: v.optional(v.string()),
            })
        ),
    }),

    socials: defineTable({
        platform: v.string(),
        label: v.string(),
        url: v.string(),
        isEnabled: v.boolean(),
        sortOrder: v.number(),
    }),

    settings: defineTable({
        key: v.string(),
        value: v.string(),
    }).index("by_key", ["key"]),

    resumes: defineTable({
        fileId: v.id("_storage"),
        fileName: v.string(),
        fileSize: v.number(),
        mimeType: v.string(),
        isActive: v.boolean(),
        uploadedAt: v.number(),
    }).index("by_active", ["isActive"]),

    documents: defineTable({
        title: v.string(),
        text: v.string(),
        type: v.string(),
        sourceId: v.optional(v.string()),
        embedding: v.array(v.number()),
    })
        .vectorIndex("by_embedding", {
            vectorField: "embedding",
            dimensions: 768, // gemini-embedding-001 with output_dimensionality 768
            filterFields: ["type"],
        })
        .index("by_source", ["sourceId"]),

    chatSessions: defineTable({
        userId: v.optional(v.string()),
        sessionId: v.string(),
        title: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_session", ["sessionId"]),

    chatMessages: defineTable({
        sessionId: v.string(),
        role: v.string(),
        content: v.string(),
        createdAt: v.number(),
    }).index("by_session", ["sessionId"]),
});
