import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- Mutations ---

export const logVisit = mutation({
    args: {},
    handler: async (ctx) => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
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

// --- Queries ---

export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        // 1. Total Visits
        const allVisits = await ctx.db.query("visits").collect();
        const totalVisits = allVisits.reduce((sum, v) => sum + v.count, 0);

        // 2. Active Projects
        const projects = await ctx.db.query("projects").collect();
        // Assuming all projects in DB are 'active' or feature-ready. 
        // You could filter by a 'visible' field if it existed, but projects schema has 'sections' enabled etc.
        // Let's just count total projects for now.
        const activeProjects = projects.length;

        // 3. New Messages
        const messages = await ctx.db.query("messages").collect();
        const newMessages = messages.filter((m) => !m.read).length;

        // 4. AI Stats
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
        const sessions = await ctx.db.query("chatSessions").order("desc").take(50);
        return sessions;
    },
});

export const getChatMessages = query({
    args: { sessionId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chatMessages")
            .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
            .collect();
    },
});
