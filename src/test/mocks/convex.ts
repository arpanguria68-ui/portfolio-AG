import { vi } from 'vitest';

export const mockConvex = {
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    reset: () => {
        // Reset logic if needed
    }
};

// This needs to be a default export to be a valid module mock in some setups,
// but named exports are fine if we mock the whole module structure.
export default mockConvex;
