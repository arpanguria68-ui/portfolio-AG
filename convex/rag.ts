import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Use the latest stable embedding model
const EMBEDDING_MODEL = "models/text-embedding-004";

export const generateEmbedding = action({
    args: { text: v.string() },
    handler: async (ctx, args) => {
        // 1. Get API Key from settings (created in previous turn)
        const apiKey = await ctx.runQuery(internal.settings.getSecret, { key: "gemini_api_key" });
        if (!apiKey) {
            throw new Error("Gemini API Key not set in Admin Settings");
        }

        // 2. Call Gemini Embedding API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: {
                        parts: [{ text: args.text }],
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Gemini Embedding Failed: ${response.status} - ${error}`);
        }

        const json = await response.json();
        const embedding = json.embedding?.values;

        if (!embedding) {
            throw new Error("No embedding returned from Gemini");
        }

        return embedding as number[];
    },
});

export const addDocument = internalMutation({
    args: {
        title: v.string(),
        text: v.string(),
        type: v.string(),
        sourceId: v.optional(v.string()),
        embedding: v.array(v.number()),
    },
    handler: async (ctx, args) => {
        // Check if document with this sourceId already exists to avoid duplicates (optional, for syncing)
        if (args.sourceId) {
            const existing = await ctx.db
                .query("documents")
                .filter(q => q.eq(q.field("sourceId"), args.sourceId))
                .first();
            if (existing) {
                await ctx.db.delete(existing._id);
            }
        }

        await ctx.db.insert("documents", args);
    }
});

// Main Action to Ingest Text
export const ingestContext = action({
    args: {
        title: v.string(),
        text: v.string(),
        type: v.string(), // 'project', 'cv'
        sourceId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const embedding = await ctx.runAction(internal.rag.generateEmbedding, { text: args.text });

        await ctx.runMutation(internal.rag.addDocument, {
            title: args.title,
            text: args.text,
            type: args.type,
            sourceId: args.sourceId,
            embedding,
        });
    }
});

// Bulk Index Projects
export const syncAllProjects = action({
    args: {},
    handler: async (ctx) => {
        // 1. Get all projects (internal query)
        const projects = await ctx.runQuery(internal.projects.list);

        let count = 0;
        for (const project of projects) {
            const sectionsText = project.sections
                ?.filter((s: any) => s.isEnabled)
                .map((s: any) => `${s.title}: ${s.content}`)
                .join("\n") || "";

            // Combine fields for rich context
            const textToEmbed = `
Project Title: ${project.title}
Year: ${project.year}
Tags: ${project.tags?.join(", ")}
Description: ${project.description}
Details:
${sectionsText}
            `.trim();

            await ctx.runAction(internal.rag.ingestContext, {
                title: `Project: ${project.title}`,
                text: textToEmbed,
                type: 'project',
                sourceId: project._id,
            });
            count++;
        }
        return `Successfully indexed ${count} projects.`;
    }
});

// Search Action
export const search = action({
    args: { query: v.string(), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        // 1. Embed query
        const embedding = await ctx.runAction(internal.rag.generateEmbedding, { text: args.query });

        // 2. Vector Search
        // Note: vectorSearch is a method on the query builder in Convex
        // We usually run this via a query, but vector search in Convex 
        // 1.8+ (which the user seems to be using based on package.json ^1.31)
        // is done via vectorSearch() on the table.

        // Wait, vector search queries must be `query()`? No, vector search returns `_score`.
        // Ideally we wrap the vector search in a `vectorSearchQuery` below.
        const results = await ctx.vectorSearch("documents", "by_embedding", {
            vector: embedding,
            limit: args.limit || 3,
        });

        // 3. Fetch full documents
        const docs = await ctx.runQuery(internal.rag.getDocuments, { ids: results.map(r => r._id) });
        return docs;
    }
});

export const getDocuments = internalQuery({
    args: { ids: v.array(v.id("documents")) },
    handler: async (ctx, args) => {
        const docs = [];
        for (const id of args.ids) {
            const doc = await ctx.db.get(id);
            if (doc) docs.push(doc);
        }
        return docs;
    }
});
