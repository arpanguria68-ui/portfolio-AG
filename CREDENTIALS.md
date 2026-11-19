# Credentials

Rules for managing secrets in this project. **Do not rotate credentials as part of routine security PRs** unless there is evidence of compromise.

## Do NOT rotate unless compromised

The following credentials are tied to live production services. Rotating them breaks deployments and requires coordinated updates across dashboards:

| Service | Where configured | Notes |
|---------|------------------|-------|
| **Clerk** | Vercel env (`VITE_CLERK_PUBLISHABLE_KEY`, Clerk dashboard) | Auth for admin panel |
| **Convex** | Vercel env (`VITE_CONVEX_URL`), Convex dashboard | Backend + deploy keys |
| **Vercel** | Vercel project settings | Hosting & env vars |
| **Gemini API** | Convex `settings` table (`gemini_api_key`) | Set via admin UI, not in git |

Security hardening (auth checks, rate limits, internal actions) does **not** require rotating these keys.

## Where secrets live

- **Frontend (Vercel)**: `VITE_CONVEX_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_ADMIN_EMAIL`, Cloudinary upload preset (if used)
- **Convex (server env)**: `ADMIN_EMAIL` — must match the Clerk admin account email
- **Convex (database)**: `gemini_api_key`, `gemini_model` — stored in `settings` table via admin panel
- **Local only**: `.env.local` (gitignored) — copy from `.env.local.example`

## Setting up a new environment

1. Copy `.env.local.example` to `.env.local` and fill in values.
2. Run `npx convex dev` to link the Convex project.
3. Set `ADMIN_EMAIL` in the Convex dashboard (Settings → Environment Variables).
4. Set matching `VITE_ADMIN_EMAIL` in Vercel for the frontend admin gate.

## Never commit

- `.env`, `.env.local`, `.env.production`
- `server/prisma/dev.db` or other local SQLite files
- API keys, Clerk secret keys, or Convex deploy keys in source code

## If credentials are exposed

1. Revoke/rotate only the exposed credential in its service dashboard.
2. Update all environments (Convex, Vercel, Clerk) in the same maintenance window.
3. Do not commit the new values to git.
