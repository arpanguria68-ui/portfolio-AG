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

- **Single entry point**: Clients call `chat.sendMessage` only. User/assistant writes and Gemini calls are handled server-side.
- **Role enforcement**: Clients cannot write assistant messages directly. Replies are stored via internal mutations.
- **Harness** (`convex/lib/chatHarness.ts`): Sanitizes input, validates session IDs, detects prompt-injection patterns, builds the system prompt, and applies a sliding context window (message count + character budget).
- **Sliding window**: Only the most recent messages within limits are sent to Gemini to control token cost and context size.
- **Rate limiting** (`convex/lib/chatRateLimit.ts`):
  - 10 messages per session per hour (sliding window)
  - 40 messages per session per day
  - 3 second cooldown between messages
  - 15 minute block after hourly abuse
- **Input limits**: Max 500 characters per message; RAG queries capped at 300 characters.
- **Honeypot field** (`website`): Silent success for bots without calling Gemini.
- **Prompt-injection guard**: Suspicious instructions are refused without a Gemini API call.
- **API keys**: Gemini keys are stored in Convex settings and accessed only via `internal.settings.getSecret`.
- **RAG protection**: Embedding search only runs for validated, non-injection messages.

## RAG (retrieval-augmented generation)

- Core RAG actions (`generateEmbedding`, `search`, `ingestContext`, `syncAllProjects`) are **internal** — not callable from the client.
- Admin-triggered indexing uses `ingestContextAdmin` and `syncAllProjectsAdmin`, which require admin auth.

## Build & deployment

- `npm run build` runs **Vite only** (frontend). Convex is deployed separately via `npx convex deploy`.
- Do not commit secrets, `.env.local`, or local database files.

## Reporting issues

If you discover a security issue, contact the repository owner privately rather than opening a public issue with exploit details.
