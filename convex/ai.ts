import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const enhanceText = action({
    args: {
        text: v.string(),
        mode: v.union(v.literal("rewrite"), v.literal("grammar"), v.literal("expand"), v.literal("shorten")),
        tone: v.optional(v.string()), // e.g. "Professional", "Casual", "Confident"
    },
    handler: async (ctx, args) => {
        const apiKey = (await ctx.runQuery(internal.settings.getSecret, { key: "gemini_api_key" })) as string;
        const model = (await ctx.runQuery(internal.settings.getSecret, { key: "gemini_model" }) || "gemini-2.5-flash-lite") as string;

        if (!apiKey) {
            throw new Error("Gemini API Key not configured in Settings.");
        }

        let prompt = "";
        const toneInstruction = args.tone ? ` with a ${args.tone} tone` : "";

        switch (args.mode) {
            case "grammar":
                prompt = `Fix the grammar and spelling of the following text, maintaining the original meaning${toneInstruction}. Return ONLY the corrected text:\n\n"${args.text}"`;
                break;
            case "expand":
                prompt = `Expand upon the following text${toneInstruction}, adding more detail and clarity while maintaining the core message. Return ONLY the expanded text:\n\n"${args.text}"`;
                break;
            case "shorten":
                prompt = `Shorten the following text${toneInstruction} to be more concise while keeping the key points. Return ONLY the shortened text:\n\n"${args.text}"`;
                break;
            case "rewrite":
            default:
                prompt = `Rewrite the following text${toneInstruction} to improve flow and clarity. Return ONLY the rewritten text:\n\n"${args.text}"`;
                break;
        }

        // Helper to query Gemini with retry logic
        const callGemini = async (modelToUse: string) => {
            return fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
                    }),
                }
            );
        };

        try {
            let response = await callGemini(model);

            // Fallback logic for Resource Exhausted or Not Found
            if (!response.ok && (response.status === 429 || response.status === 404)) {
                console.warn(`Primary model ${model} failed (${response.status}). Retrying with gemini-2.5-flash-lite...`);
                if (model !== "gemini-2.5-flash-lite") {
                    response = await callGemini("gemini-2.5-flash-lite");
                }
            }

            // Second fallback to 2.0-flash if even 2.5-flash-lite fails (as per recent quota issues)
            if (!response.ok && (response.status === 429 || response.status === 404)) {
                console.warn(`Secondary model failed. Retrying with gemini-2.0-flash...`);
                response = await callGemini("gemini-2.0-flash");
            }

            if (!response.ok) {
                const errorText = await response.text();
                // Parse clean error if possible
                try {
                    const errJson = JSON.parse(errorText);
                    if (errJson.error && errJson.error.message) {
                        throw new Error(errJson.error.message);
                    }
                } catch (e) {
                    // ignore json parse error
                }
                throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            return { success: true, text: enhancedText.trim() };

        } catch (error: any) {
            console.error("AI Enhancement Error:", error);
            return { success: false, error: error.message };
        }
    },
});
