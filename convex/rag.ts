import {
    action,
    internalAction,
    internalMutation,
    internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { internal, api } from "./_generated/api";
import { requireAdmin } from "./authHelpers";
import type { Id } from "./_generated/dataModel";

const EMBEDDING_MODEL = "models/text-embedding-004";

type ProjectSection = {
    id: number;
    type: string;
    title: string;
    content: string;
    collapsed: boolean;
    icon: string;
    isEnabled: boolean;
    image?: string;
};

type StoredDocument = {
    _id: Id<"documents">;
    _creationTime: number;
    title: string;
    text: string;
    type: string;
    sourceId?: string;
    embedding: number[];
};

export const generateEmbedding = internalAction({
    args: { text: v.string() },
    handler: async (ctx, args): Promise<number[]> => {
        const apiKey = await ctx.runQuery(internal.settings.getSecret, {
            key: "gemini_api_key",
        });
        if (!apiKey) {
            throw new Error("Gemini API Key not set in Admin Settings");
        }

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
        if (args.sourceId) {
            const existing = await ctx.db
                .query("documents")
                .filter((q) => q.eq(q.field("sourceId"), args.sourceId))
                .first();
            if (existing) {
                await ctx.db.delete(existing._id);
            }
        }

        await ctx.db.insert("documents", args);
    },
});

export const ingestContext = internalAction({
    args: {
        title: v.string(),
        text: v.string(),
        type: v.string(),
        sourceId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const embedding = await ctx.runAction(internal.rag.generateEmbedding, {
            text: args.text,
        });

        await ctx.runMutation(internal.rag.addDocument, {
            title: args.title,
            text: args.text,
            type: args.type,
            sourceId: args.sourceId,
            embedding,
        });
    },
});

export const syncAllProjects = internalAction({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.runQuery(api.projects.list);

        let count = 0;
        for (const project of projects) {
            const sectionsText =
                project.sections
                    ?.filter((s: ProjectSection) => s.isEnabled)
                    .map((s: ProjectSection) => `${s.title}: ${s.content}`)
                    .join("\n") || "";

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
                type: "project",
                sourceId: project._id,
            });
            count++;
        }
        return `Successfully indexed ${count} projects.`;
    },
});

export const search = internalAction({
    args: { query: v.string(), limit: v.optional(v.number()) },
    handler: async (ctx, args): Promise<StoredDocument[]> => {
        const embedding: number[] = await ctx.runAction(
            internal.rag.generateEmbedding,
            { text: args.query }
        );

        const results = await ctx.vectorSearch("documents", "by_embedding", {
            vector: embedding,
            limit: args.limit || 3,
        });

        const docs: StoredDocument[] = await ctx.runQuery(internal.rag.getDocuments, {
            ids: results.map((r) => r._id),
        });
        return docs;
    },
});

export const getDocuments = internalQuery({
    args: { ids: v.array(v.id("documents")) },
    handler: async (ctx, args): Promise<StoredDocument[]> => {
        const docs: StoredDocument[] = [];
        for (const id of args.ids) {
            const doc = await ctx.db.get(id);
            if (doc) docs.push(doc);
        }
        return docs;
    },
});

export const ingestContextAdmin = action({
    args: {
        title: v.string(),
        text: v.string(),
        type: v.string(),
        sourceId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.runAction(internal.rag.ingestContext, args);
    },
});

export const syncAllProjectsAdmin = action({
    args: {},
    handler: async (ctx): Promise<string> => {
        await requireAdmin(ctx);
        return await ctx.runAction(internal.rag.syncAllProjects, {});
    },
});
