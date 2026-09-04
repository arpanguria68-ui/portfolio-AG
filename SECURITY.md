# Security

This document summarizes the security controls in the portfolio application.

## Authentication & authorization

- **Admin panel**: Protected by Clerk sign-in on the frontend and `requireAdmin()` on Convex mutations, queries, and actions.
- **Admin identity**: Convex checks `ADMIN_EMAIL` (server env) against the signed-in Clerk user's email. The frontend also checks `VITE_ADMIN_EMAIL` for UI gating.
- **Public vs admin**: Portfolio read queries (`projects.list`, `profile.get`, etc.) remain public. All write operations require admin auth.

## Contact form

- **Honeypot field** (`website`): Bots that fill hidden fields are silently ignored.
- **Rate limiting**: Max 3 messages per email per hour.
- **Validation**: Email format and required fields are validated server-side.

## AI chat

- **Role enforcement**: Clients can only store `user` messages. Assistant replies are written via internal mutations from the `sendToGemini` action.
- **API keys**: Gemini keys are stored in Convex settings and accessed only via `internal.settings.getSecret`.

## RAG (retrieval-augmented generation)

- Core RAG actions (`generateEmbedding`, `search`, `ingestContext`, `syncAllProjects`) are **internal** — not callable from the client.
- Admin-triggered indexing uses `ingestContextAdmin` and `syncAllProjectsAdmin`, which require admin auth.

## Build & deployment

- `npm run build` runs **Vite only** (frontend). Convex is deployed separately via `npx convex deploy`.
- Do not commit secrets, `.env.local`, or local database files.

## Reporting issues

If you discover a security issue, contact the repository owner privately rather than opening a public issue with exploit details.
