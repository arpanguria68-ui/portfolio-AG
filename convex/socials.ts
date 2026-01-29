import { query } from "./_generated/server";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const socials = await ctx.db.query("socialLinks").collect();
        return socials;
    },
});
