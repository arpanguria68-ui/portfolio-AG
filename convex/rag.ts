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

const EMBEDDING_MODEL = "models/gemini-embedding-001";
// NOTE: models/text-embedding-004 was shut down by Google on the Gemini API
// on 2026-01-14 (v1beta embedContent returns 404 for it). gemini-embedding-001
// is the current text-only embedding model (Google docs: "For text-only use
// cases, gemini-embedding-001 remains available"). It defaults to 3072 dims,
// so we request output_dimensionality 768 to match the Convex vector index.

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
    handler: async (ctx, args) => {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: EMBEDDING_MODEL,
                    content: {
                        parts: [{ text: args.text }],
                    },
                    // REST field is snake_case (official docs REST example).
                    // Keeps vectors at 768 dims to match the Convex vector index.
                    output_dimensionality: 768,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Gemini embedding API error: ${response.status} ${response.statusText}`
            );
        }

        const json = await response.json();
        const embedding = json.embedding?.values;
        if (!embedding) {
            throw new Error("No embedding returned from Gemini");
        }

        if (embedding.length !== 768) {
            throw new Error(
                `Unexpected embedding dimension: ${embedding.length}, expected 768`
            );
        }
        // gemini-embedding-001 only pre-normalizes the full 3072-dim output.
        // Truncated (768-dim) vectors must be L2-normalized manually, per the
        // official docs, so cosine-similarity search ranks by direction.
        // (text-embedding-004 returned normalized 768-dim vectors, so this
        // preserves the previous retrieval behaviour.)
        const norm = Math.sqrt(
            embedding.reduce((sum: number, v: number) => sum + v * v, 0)
        );
        if (norm === 0) {
            throw new Error("Embedding has zero magnitude");
        }
        return embedding.map((v: number) => v / norm) as number[];
    },
});

export const search = internalQuery({
    args: {
        queryEmbedding: v.array(v.number()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const results = await ctx.db
            .query("documents")
            .withSearchIndex("by_embedding", (q) =>
                q.search("embedding", args.queryEmbedding)
            )
            .take(args.limit ?? 5);

        return results.map((doc) => ({
            id: doc._id,
            title: doc.title,
            text: doc.text,
            type: doc.type,
        }));
    },
});

export const generateQueryEmbedding = internalAction({
    args: { query: v.string() },
    handler: async (ctx, args): Promise<number[]> => {
        const embedding: number[] = await ctx.runAction(
            internal.rag.generateEmbedding,
            { text: args.query }
        );
        return embedding;
    },
});

export const indexDocument = internalMutation({
    args: {
        title: v.string(),
        text: v.string(),
        type: v.string(),
        sourceId: v.optional(v.string()),
        embedding: v.array(v.number()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("documents")
            .withIndex("by_source", (q) => q.eq("sourceId", args.sourceId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                title: args.title,
                text: args.text,
                type: args.type,
                embedding: args.embedding,
            });
            return { id: existing._id, updated: true };
        }

        const id = await ctx.db.insert("documents", {
            title: args.title,
            text: args.text,
            type: args.type,
            sourceId: args.sourceId,
            embedding: args.embedding,
        });
        return { id, updated: false };
    },
});

export const syncAllProjects = internalAction({
    args: {},
    handler: async (ctx) => {
        const projects = await ctx.runQuery(api.projects.getAllProjects);

        let syncedCount = 0;
        let errors: string[] = [];

        for (const project of projects) {
            const sections: ProjectSection[] = project.sections || [];
            const allText = [
                project.title,
                project.description,
                project.longDescription || "",
                ...sections.flatMap((s) => [s.title, s.content]),
            ]
                .filter(Boolean)
                .join("\n\n");

            try {
                const embedding: number[] = await ctx.runAction(
                    internal.rag.generateEmbedding,
                    { text: allText }
                );

                await ctx.runMutation(internal.rag.indexDocument, {
                    title: project.title,
                    text: allText,
                    type: "project",
                    sourceId: project._id,
                    embedding,
                });
                syncedCount++;
            } catch (err) {
                errors.push(
                    `${project.title}: ${err instanceof Error ? err.message : String(err)}`
                );
            }
        }

        return {
            syncedCount,
            errors,
            total: projects.length,
        };
    },
});

export const syncAllProjectsAdmin = action({
    args: {},
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) {
            throw new Error("Not authenticated");
        }
        return await ctx.runAction(internal.rag.syncAllProjects, {});
    },
});

export const requireAdminForRag = action({
    args: {},
    handler: async (ctx) => {
        if (!requireAdmin(ctx)) {
            throw new Error("Not authorized");
        }
        return { ok: true };
    },
});
