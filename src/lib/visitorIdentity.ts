// Visitor identity for the AI chat.
//
// Each visitor gets one stable, unguessable token so the chat can recognise
// them on return visits and keep their history separate from every other
// visitor. The token is stored in a first-party cookie (pf_visitor) with a
// localStorage fallback for browsers that block cookies.
//
// Token formats:
//   - New:      vst_<43 base64url chars>  (256-bit random, issued by the browser)
//   - Legacy:   session_<timestamp>_<random>  (the old localStorage format;
//               still accepted by the server so existing visitors keep their
//               history, and migrated into the cookie on first sight)
//
// The token is a bearer credential for one visitor's own chat history only:
// it must never be shared, logged, or put in a URL. Convex validates the
// format server-side (see convex/lib/chatHarness.ts SESSION_ID_PATTERN).

const COOKIE_NAME = "pf_visitor";
const LEGACY_STORAGE_KEY = "chat_session_id";
const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60; // 1 year

const NEW_TOKEN_PATTERN = /^vst_[A-Za-z0-9_-]{43}$/;
const LEGACY_TOKEN_PATTERN = /^session_[A-Za-z0-9_-]+$/;

function readCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${name}=`));
    if (!match) return null;
    try {
        return decodeURIComponent(match.slice(name.length + 1));
    } catch {
        return null;
    }
}

function writeCookie(name: string, value: string): boolean {
    if (typeof document === "undefined") return false;
    try {
        const secure =
            window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie =
            `${name}=${encodeURIComponent(value)}` +
            `; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
        return readCookie(name) === value;
    } catch {
        return false;
    }
}

function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function generateVisitorToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    // base64url without padding: 32 bytes -> 43 chars.
    let binary = "";
    bytes.forEach((b) => {
        binary += String.fromCharCode(b);
    });
    return (
        "vst_" +
        btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
    );
}

export function isValidVisitorToken(value: string | null): value is string {
    if (!value) return false;
    return NEW_TOKEN_PATTERN.test(value) || LEGACY_TOKEN_PATTERN.test(value);
}

/** Return this visitor's stable token, creating and storing one if needed. */
export function getVisitorId(): string {
    // 1. Cookie is the source of truth.
    const fromCookie = readCookie(COOKIE_NAME);
    if (isValidVisitorToken(fromCookie)) {
        return fromCookie as string;
    }

    // 2. Migrate a legacy localStorage session id into the cookie so the
    //    visitor keeps their existing chat history.
    try {
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (isValidVisitorToken(legacy)) {
            writeCookie(COOKIE_NAME, legacy as string);
            return legacy as string;
        }
    } catch {
        // localStorage unavailable — fall through to a fresh token.
    }

    // 3. Fresh visitor: issue a new unguessable token.
    const token = generateVisitorToken();
    if (!writeCookie(COOKIE_NAME, token)) {
        // Cookies blocked: keep the token in localStorage as a fallback.
        try {
            localStorage.setItem(LEGACY_STORAGE_KEY, token);
        } catch {
            // No persistent storage at all: the token lives for this page
            // load only (getVisitorId is called once per mount).
        }
    }
    return token;
}

/** Forget this visitor: remove the token and any stored session id. */
export function clearVisitorIdentity() {
    deleteCookie(COOKIE_NAME);
    try {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
        // Ignore.
    }
}

/** Issue a brand-new visitor token (used by "Reset my visitor ID"). */
export function resetVisitorIdentity(): string {
    clearVisitorIdentity();
    return getVisitorId();
}
