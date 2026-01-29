import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Global Mock for Convex
// This ensures ALL tests use the mock, preventing "Could not find Convex client" errors
vi.mock('convex/react', () => ({
    useQuery: vi.fn(),
    useMutation: vi.fn(() => vi.fn()),
    ConvexProvider: ({ children }: any) => children,
    ConvexReactClient: vi.fn(),
}));

// Mock the generated API
vi.mock('../../convex/_generated/api', () => ({
    api: {
        projects: {
            get: "projects:get",
            create: "projects:create",
            update: "projects:update",
            generateUploadUrl: "projects:generateUploadUrl"
        },
        messages: {
            create: "messages:create"
        }
    }
}));

// Mock the generated API (path variation for deeply nested files)
vi.mock('../../../convex/_generated/api', () => ({
    api: {
        projects: {
            get: "projects:get",
            create: "projects:create",
            update: "projects:update",
            generateUploadUrl: "projects:generateUploadUrl"
        },
        messages: {
            create: "messages:create"
        }
    }
}));
