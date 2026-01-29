import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Admin from '../pages/Admin';
import { BrowserRouter } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';

// We rely on the global mock in setup.ts, but we implement specific behavior here.

describe('CMS Logic (Convex Integration)', () => {
    let projectsStore: any[] = [];
    let mockCreateProject = vi.fn();

    beforeEach(() => {
        projectsStore = [];
        vi.clearAllMocks();
        mockCreateProject = vi.fn(async (args) => {
             projectsStore.push({ ...args, id: "123" });
        });

        // Implement a reactive mock
        (useQuery as any).mockImplementation((query: string) => {
            if (query === "projects:get") return projectsStore;
            return [];
        });

        (useMutation as any).mockImplementation((mutation: string) => {
            if (mutation === "projects:create") return mockCreateProject;
            if (mutation === "projects:generateUploadUrl") {
                return async () => "http://mock-upload-url";
            }
            return async () => {};
        });

        // Mock fetch for image upload
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ storageId: "mock-storage-id" })
        });

        // Mock URL.createObjectURL
        global.URL.createObjectURL = vi.fn(() => "blob:mock-url");

        // Mock alert
        global.alert = vi.fn();
    });

    it('Admin creation calls mutation', async () => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );

        // 1. Navigate to Projects Tab
        // The sidebar button text is "projects" (lowercase in button, capitalized in span)
        // Or we can find by icon text?
        // Let's try finding the button that contains "projects" text.
        // In Admin.tsx: <span className="capitalize">{tab === 'highlights' ? 'Media Library' : tab}</span>
        // So text is "projects"
        const projectsTab = screen.getAllByText("projects")[0];
        fireEvent.click(projectsTab);

        // 2. Open Editor
        // Now "Add Project" should be visible
        const addButtons = screen.getAllByText("Add Project");
        fireEvent.click(addButtons[0]);

        // 3. Fill Form
        // The editor defaults to some values. Let's just click Save.
        fireEvent.click(screen.getByText("Save"));

        // 4. Verify Mutation was called
        await waitFor(() => {
            expect(mockCreateProject).toHaveBeenCalled();
        });

        // 5. Verify Store Updated (Logic Check)
        expect(projectsStore).toHaveLength(1);
    });
});
