"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("convex/server");
var values_1 = require("convex/values");
exports.default = (0, server_1.defineSchema)({
    projects: (0, server_1.defineTable)({
        title: values_1.v.string(),
        description: values_1.v.string(),
        year: values_1.v.string(),
        tags: values_1.v.array(values_1.v.string()), // Convex handles arrays natively
        image: values_1.v.string(), // Storage ID or URL
        link: values_1.v.optional(values_1.v.string()),
        sections: values_1.v.string(), // Keeping as JSON string for complex structure, or could be v.array(v.any())
        // Note: v.any() allows flexibility but strict typing is better.
        // Given the editor structure, JSON string is safest for migration.
        createdAt: values_1.v.number(), // Unix timestamp
    }),
    messages: (0, server_1.defineTable)({
        name: values_1.v.string(),
        email: values_1.v.string(),
        message: values_1.v.string(),
        date: values_1.v.number(),
        read: values_1.v.boolean(),
    }),
});
