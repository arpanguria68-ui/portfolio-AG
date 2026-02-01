import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import type { ReactNode } from "react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Show error in development if URL is missing
if (!convexUrl) {
    console.error("Missing VITE_CONVEX_URL environment variable!");
}
if (!clerkPublishableKey) {
    console.error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable!");
}

// Only create client if URL exists
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    if (!convex || !clerkPublishableKey) {
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
                        Missing Environment Variables.
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px' }}>
                        Ensure VITE_CONVEX_URL and VITE_CLERK_PUBLISHABLE_KEY are set.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ClerkProvider publishableKey={clerkPublishableKey}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}
