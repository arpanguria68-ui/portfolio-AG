import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    year: v.string(),
    tags: v.array(v.string()), // Convex handles arrays natively
    image: v.string(), // Storage ID or URL
    link: v.optional(v.string()),
    sections: v.string(), // Keeping as JSON string for complex structure, or could be v.array(v.any())
    // Note: v.any() allows flexibility but strict typing is better.
    // Given the editor structure, JSON string is safest for migration.
    createdAt: v.number(), // Unix timestamp
  }),
  messages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    date: v.number(),
    read: v.boolean(),
  }),
});
