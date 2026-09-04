import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./authHelpers";

export const logVisit = mutation({
    args: {},
    handler: async (ctx) => {
        const today = new Date().toISOString().split("T")[0];
        const existing = await ctx.db
            .query("visits")
            .withIndex("by_date", (q) => q.eq("date", today))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { count: existing.count + 1 });
        } else {
            await ctx.db.insert("visits", { date: today, count: 1 });
        }
    },
});

export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const allVisits = await ctx.db.query("visits").collect();
        const totalVisits = allVisits.reduce((sum, v) => sum + v.count, 0);

        const projects = await ctx.db.query("projects").collect();
        const activeProjects = projects.length;

        const messages = await ctx.db.query("messages").collect();
        const newMessages = messages.filter((m) => !m.read).length;

        const sessions = await ctx.db.query("chatSessions").collect();
        const totalSessions = sessions.length;

        return {
            totalVisits,
            activeProjects,
            newMessages,
            totalSessions,
        };
    },
});

export const getChatSessions = query({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const sessions = await ctx.db.query("chatSessions").order("desc").take(50);
        return sessions;
    },
});

export const getChatMessages = query({
    args: { sessionId: v.string() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        return await ctx.db
            .query("chatMessages")
            .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
            .collect();
    },
});
