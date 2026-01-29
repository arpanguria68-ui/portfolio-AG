import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Show error in development if URL is missing
if (!convexUrl) {
    console.error("Missing VITE_CONVEX_URL environment variable!");
}

// Only create client if URL exists
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    if (!convex) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0A0A0A',
                color: '#fff',
                fontFamily: 'system-ui, sans-serif',
                padding: '20px',
                textAlign: 'center'
            }}>
                <div>
                    <h1 style={{ color: '#D4FF3F', marginBottom: '16px' }}>Configuration Error</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Missing VITE_CONVEX_URL environment variable.
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px' }}>
                        Please set this in your Vercel project settings.
                    </p>
                </div>
            </div>
        );
    }

    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
