import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all messages
export const get = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("messages").order("desc").collect();
  },
});

// Create message
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.insert("messages", {
      ...args,
      date: Date.now(),
      read: false,
    });
  },
});

// Mark as read
export const markRead = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

// Delete message
export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});
