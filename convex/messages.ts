import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAdmin } from "./authHelpers";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_MESSAGES_PER_WINDOW = 3;

export const list = query({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const messages = await ctx.db
            .query("messages")
            .order("desc")
            .collect();
        return messages;
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        message: v.string(),
        website: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.website && args.website.trim() !== "") {
            return null;
        }

        const email = args.email.trim().toLowerCase();
        const name = args.name.trim();
        const message = args.message.trim();

        if (!name || !email || !message) {
            throw new ConvexError("Name, email, and message are required.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new ConvexError("Please enter a valid email address.");
        }

        const windowStart = Date.now() - RATE_LIMIT_WINDOW_MS;
        const recentMessages = await ctx.db
            .query("messages")
            .withIndex("by_email", (q) => q.eq("email", email))
            .collect();
        const recentCount = recentMessages.filter(
            (entry) => entry._creationTime >= windowStart
        ).length;

        if (recentCount >= MAX_MESSAGES_PER_WINDOW) {
            throw new ConvexError(
                "Too many messages sent recently. Please try again later."
            );
        }

        const messageId = await ctx.db.insert("messages", {
            name,
            email,
            message,
            read: false,
        });
        return messageId;
    },
});

export const markRead = mutation({
    args: { id: v.id("messages") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.patch(args.id, { read: true });
    },
});

export const remove = mutation({
    args: { id: v.id("messages") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.delete(args.id);
    },
});
