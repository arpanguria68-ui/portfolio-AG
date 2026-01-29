import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all projects
export const get = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

// Create project
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    year: v.string(),
    tags: v.array(v.string()),
    image: v.string(),
    link: v.optional(v.string()),
    sections: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdAt: Date.now(),
    });
    return projectId;
  },
});

// Update project
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.string(),
    description: v.string(),
    year: v.string(),
    tags: v.array(v.string()),
    image: v.string(),
    link: v.optional(v.string()),
    sections: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Delete project
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});

// Generate upload URL for images
export const generateUploadUrl = mutation(async (ctx: any) => {
  return await ctx.storage.generateUploadUrl();
});
