import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    clearVisitorIdentity,
    getVisitorId,
    resetVisitorIdentity,
} from "../lib/visitorIdentity";

const CONSENT_STORAGE_KEY = "pf_cookie_consent";

type Consent = {
    necessary: true;
    analytics: boolean;
    decidedAt: number;
};

function loadConsent(): Consent | null {
    try {
        const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Consent;
        if (typeof parsed.analytics !== "boolean") return null;
        return parsed;
    } catch {
        return null;
    }
}

function saveConsent(analytics: boolean) {
    const consent: Consent = {
        necessary: true,
        analytics,
        decidedAt: Date.now(),
    };
    try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    } catch {
        // Storage unavailable — the banner will show again next visit.
    }
}

/**
 * Cookie consent banner + settings.
 *
 * This site uses only strictly necessary cookies today:
 *  - pf_visitor: the AI chat's per-visitor ID (1 year). It lets the chat
 *    recognise a returning visitor and keep their history separate from
 *    every other visitor. No name, email or account is attached to it.
 *  - Clerk sign-in cookies (__session etc.): only set when Arpan signs in
 *    to /admin; visitors never receive them.
 * No analytics, advertising or third-party tracking cookies are installed,
 * so the Analytics category is shown as "not in use" rather than offered
 * as a choice that does nothing.
 */
const CookieConsent = () => {
    const [bannerVisible, setBannerVisible] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const clearMyHistory = useMutation(api.chat.clearMyHistory);

    useEffect(() => {
        const existing = loadConsent();
        if (existing) {
            setAnalyticsEnabled(existing.analytics);
        } else {
            setBannerVisible(true);
        }
    }, []);

    const choose = (analytics: boolean) => {
        saveConsent(analytics);
        setAnalyticsEnabled(analytics);
        setBannerVisible(false);
        setSettingsOpen(false);
    };

    const handleDeleteHistory = async () => {
        setBusy(true);
        setNotice(null);
        try {
            const visitorId = getVisitorId();
            const result = await clearMyHistory({ sessionId: visitorId });
            clearVisitorIdentity();
            resetVisitorIdentity();
            setNotice(
                result.deletedMessages > 0
                    ? `Deleted ${result.deletedMessages} chat message${result.deletedMessages === 1 ? "" : "s"} and gave you a fresh visitor ID.`
                    : "No chat history was stored for this device. You now have a fresh visitor ID."
            );
        } catch {
            setNotice("Could not delete your chat history. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    const handleResetId = () => {
        resetVisitorIdentity();
        setNotice("Your visitor ID has been reset. The chat will treat you as a new visitor.");
    };

    return (
        <>
            {/* Cookie settings button — always available, bottom-left. */}
            <button
                onClick={() => {
                    setNotice(null);
                    setSettingsOpen(true);
                }}
                aria-label="Cookie settings"
                title="Cookie settings"
                className="fixed bottom-5 left-5 z-50 w-10 h-10 rounded-full bg-white/5 border border-white/15 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
            >
                <span className="material-symbols-outlined text-xl">cookie</span>
            </button>

            {bannerVisible && (
                <div
                    role="dialog"
                    aria-label="Cookie consent"
                    className="fixed z-[60] inset-x-4 bottom-4 sm:left-5 sm:right-auto sm:bottom-20 sm:max-w-md bg-[#111111] border border-white/15 rounded-2xl shadow-2xl p-5"
                >
                    <h2 className="font-bold text-white text-base mb-2">
                        Cookies on this site
                    </h2>
                    <p className="text-sm text-white/60 leading-relaxed">
                        This site uses one strictly necessary cookie so the AI
                        chat can recognise you on return visits and keep your
                        conversation private to you. No analytics or tracking
                        cookies are used.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => choose(false)}
                            className="px-4 py-2.5 rounded-xl bg-primary text-black text-sm font-semibold hover:scale-[1.02] transition-transform"
                        >
                            Accept necessary only
                        </button>
                        <button
                            onClick={() => {
                                setBannerVisible(false);
                                setSettingsOpen(true);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white hover:border-white/40 transition-colors"
                        >
                            Customise
                        </button>
                    </div>
                </div>
            )}

            {settingsOpen && (
                <div
                    role="dialog"
                    aria-label="Cookie settings"
                    className="fixed z-[60] inset-0 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setSettingsOpen(false)}
                >
                    <div
                        className="w-full max-w-lg bg-[#111111] border border-white/15 rounded-3xl shadow-2xl p-6 max-h-[85dvh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h2 className="font-bold text-white text-lg">
                                Cookie settings
                            </h2>
                            <button
                                onClick={() => setSettingsOpen(false)}
                                aria-label="Close cookie settings"
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/60 hover:text-white"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <p className="text-sm text-white/60 leading-relaxed mb-5">
                            Your choices apply to this browser only. Strictly
                            necessary cookies cannot be switched off — the
                            site would not work without them.
                        </p>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-semibold text-white text-sm">
                                        Strictly necessary
                                    </h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-semibold">
                                        Always on
                                    </span>
                                </div>
                                <ul className="mt-3 space-y-2 text-sm text-white/60">
                                    <li>
                                        <span className="text-white/90 font-mono text-xs">pf_visitor</span>
                                        {" — "}your AI chat visitor ID (1 year).
                                        Lets the chat recognise you on return
                                        visits and keeps your history separate
                                        from other visitors.
                                    </li>
                                    <li>
                                        <span className="text-white/90 font-mono text-xs">__session</span>
                                        {" — "}sign-in session for /admin, set
                                        only when Arpan signs in. Visitors
                                        never receive it.
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-semibold text-white text-sm">
                                        Analytics
                                    </h3>
                                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/50 font-semibold">
                                        Not in use
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-white/60">
                                    No analytics or tracking cookies are
                                    currently installed on this site, so there
                                    is nothing to opt in to. If any are added
                                    later, they will appear here first.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <h3 className="font-semibold text-white text-sm mb-2">
                                    Your chat data
                                </h3>
                                <p className="text-sm text-white/60 mb-3">
                                    Your conversations are tied to your visitor
                                    ID on this device only. You can erase them
                                    or start fresh at any time.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={handleDeleteHistory}
                                        disabled={busy}
                                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white hover:border-red-400/60 hover:text-red-300 transition-colors disabled:opacity-50"
                                    >
                                        {busy ? "Deleting…" : "Delete my chat history"}
                                    </button>
                                    <button
                                        onClick={handleResetId}
                                        className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white hover:border-white/40 transition-colors"
                                    >
                                        Reset my visitor ID
                                    </button>
                                </div>
                                {notice && (
                                    <p className="mt-3 text-sm text-primary" role="status">
                                        {notice}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => choose(analyticsEnabled)}
                                className="px-4 py-2.5 rounded-xl bg-primary text-black text-sm font-semibold hover:scale-[1.02] transition-transform"
                            >
                                Save choices
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
