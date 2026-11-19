import { action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAdmin } from "./authHelpers";

// Signs Cloudinary upload parameters for the Upload Widget.
//
// The widget's `uploadSignature` callback hands us the parameters it is
// about to send (including its timestamp). We sign them with the Cloudinary
// API secret and return the hex SHA-1 signature. Only a signed-in admin can
// obtain a signature, and only the widget's exact parameter set validates —
// so knowing the cloud name and preset is no longer enough to upload to
// this account.
//
// The signed string follows Cloudinary's rules exactly:
//   - `file`, `cloud_name`, `resource_type`, `api_key`, `type` and
//     `signature` are NEVER part of the string to sign, even if the widget
//     hands them to us (they are still sent in the upload call itself).
//   - `upload_preset` MUST be in the signed string (Cloudinary validates
//     the signature against the full POST body, preset included), so we add
//     it if the widget did not include it.
//   - Remaining pairs are sorted alphabetically by key and joined with `&`,
//     then the API secret is appended with no delimiter before hashing.
// Signing the raw widget parameters without these two steps produces an
// "Invalid Signature" response from Cloudinary and the upload stalls.
//
// Setup required (one-off, in dashboards):
//   1. Convex production env vars: CLOUDINARY_API_SECRET = the API secret
//      from the Cloudinary dashboard (Settings > Security / API keys).
//   2. Cloudinary dashboard: the `portfolio_uploads` upload preset must be
//      switched from Unsigned to Signed.
const EXCLUDED_FROM_SIGNATURE = new Set([
    "file",
    "cloud_name",
    "resource_type",
    "api_key",
    "type",
    "signature",
]);

export const getUploadSignature = action({
    args: { params: v.string(), uploadPreset: v.string() },
    handler: async (ctx, args): Promise<string> => {
        await requireAdmin(ctx);

        const secret = process.env.CLOUDINARY_API_SECRET;
        if (!secret) {
            throw new ConvexError(
                "CLOUDINARY_API_SECRET is not configured in Convex environment variables."
            );
        }

        const entries = new Map<string, string>();
        for (const pair of args.params.split("&")) {
            if (!pair) continue;
            const eq = pair.indexOf("=");
            const key = eq >= 0 ? pair.slice(0, eq) : pair;
            const value = eq >= 0 ? pair.slice(eq + 1) : "";
            if (!EXCLUDED_FROM_SIGNATURE.has(key) && value !== "") {
                entries.set(key, value);
            }
        }
        // The preset is part of the POST body Cloudinary validates against,
        // so it must be covered by the signature.
        entries.set("upload_preset", args.uploadPreset);

        const canonical = [...entries.entries()]
            .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
            .map(([k, value]) => `${k}=${value}`)
            .join("&");

        const data = new TextEncoder().encode(canonical + secret);
        const hash = await crypto.subtle.digest("SHA-1", data);
        return Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    },
});
