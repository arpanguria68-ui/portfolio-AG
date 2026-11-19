import { action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAdmin } from "./authHelpers";

// Signs Cloudinary upload parameters for the Upload Widget.
//
// The widget's `uploadSignature` callback hands us the exact parameters it
// is about to send (including its timestamp); we sign the canonical
// `key=value&key=value` string (keys sorted, values as given) with the
// Cloudinary API secret and return the hex SHA-1 signature. Only a signed-in
// admin can obtain a signature, and only the widget's exact parameter set
// validates — so knowing the cloud name and preset is no longer enough to
// upload to this account.
//
// Setup required (one-off, in dashboards):
//   1. Convex production env vars: CLOUDINARY_API_SECRET = the API secret
//      from the Cloudinary dashboard (Settings > Security / API keys).
//   2. Cloudinary dashboard: the `portfolio_uploads` upload preset must be
//      switched from Unsigned to Signed.
export const getUploadSignature = action({
    args: { params: v.string() },
    handler: async (ctx, args): Promise<string> => {
        await requireAdmin(ctx);

        const secret = process.env.CLOUDINARY_API_SECRET;
        if (!secret) {
            throw new ConvexError(
                "CLOUDINARY_API_SECRET is not configured in Convex environment variables."
            );
        }

        const data = new TextEncoder().encode(args.params + secret);
        const hash = await crypto.subtle.digest("SHA-1", data);
        return Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    },
});
