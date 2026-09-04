import { CHAT_SECURITY } from "./chatHarness";

export type RateLimitResult =
    | { allowed: true }
    | { allowed: false; reason: string; retryAfterMs?: number; shouldBlock?: boolean };

const HOUR_MS = 60 * 60 * 1_000;
const DAY_MS = 24 * HOUR_MS;

export function checkChatRateLimit(params: {
    now: number;
    lastUserMessageAt?: number;
    blockedUntil?: number;
    userMessages: Array<{ timestamp: number }>;
}): RateLimitResult {
    const { now, lastUserMessageAt, blockedUntil, userMessages } = params;

    if (blockedUntil && blockedUntil > now) {
        return {
            allowed: false,
            reason: "Too many requests. Please wait before sending another message.",
            retryAfterMs: blockedUntil - now,
        };
    }

    if (
        lastUserMessageAt &&
        now - lastUserMessageAt < CHAT_SECURITY.MIN_MESSAGE_INTERVAL_MS
    ) {
        return {
            allowed: false,
            reason: "Please wait a few seconds between messages.",
            retryAfterMs:
                CHAT_SECURITY.MIN_MESSAGE_INTERVAL_MS - (now - lastUserMessageAt),
        };
    }

    const hourAgo = now - HOUR_MS;
    const dayAgo = now - DAY_MS;
    const hourlyCount = userMessages.filter(
        (message) => message.timestamp >= hourAgo
    ).length;
    const dailyCount = userMessages.filter(
        (message) => message.timestamp >= dayAgo
    ).length;

    if (hourlyCount >= CHAT_SECURITY.MAX_MESSAGES_PER_HOUR) {
        return {
            allowed: false,
            reason: "Hourly message limit reached. Please try again later.",
            retryAfterMs: CHAT_SECURITY.BLOCK_DURATION_MS,
            shouldBlock: true,
        };
    }

    if (dailyCount >= CHAT_SECURITY.MAX_MESSAGES_PER_DAY) {
        return {
            allowed: false,
            reason: "Daily message limit reached. Please try again tomorrow.",
            retryAfterMs: DAY_MS,
            shouldBlock: true,
        };
    }

    return { allowed: true };
}

export function getRemainingQuota(userMessages: Array<{ timestamp: number }>, now: number) {
    const hourAgo = now - HOUR_MS;
    const dayAgo = now - DAY_MS;
    const hourlyUsed = userMessages.filter((message) => message.timestamp >= hourAgo).length;
    const dailyUsed = userMessages.filter((message) => message.timestamp >= dayAgo).length;

    return {
        hourlyRemaining: Math.max(0, CHAT_SECURITY.MAX_MESSAGES_PER_HOUR - hourlyUsed),
        dailyRemaining: Math.max(0, CHAT_SECURITY.MAX_MESSAGES_PER_DAY - dailyUsed),
        minIntervalMs: CHAT_SECURITY.MIN_MESSAGE_INTERVAL_MS,
        maxMessageLength: CHAT_SECURITY.MAX_MESSAGE_LENGTH,
    };
}
