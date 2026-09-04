import { ConvexError } from "convex/values";
import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";

type AuthCtx = QueryCtx | MutationCtx | ActionCtx;

export async function requireAdmin(ctx: AuthCtx): Promise<void> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError("Not authenticated");
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
        throw new ConvexError("Admin email not configured on Convex");
    }

    const userEmail = identity.email?.toLowerCase();
    if (!userEmail || userEmail !== adminEmail.toLowerCase()) {
        throw new ConvexError("Not authorized");
    }
}
