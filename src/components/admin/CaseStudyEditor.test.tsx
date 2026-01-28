import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CaseStudyEditor from './CaseStudyEditor';
import { api } from '../../lib/api';

// Mock the API
vi.mock('../../lib/api', () => ({
    api: {
        createProject: vi.fn(),
    },
}));

describe('CaseStudyEditor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('updates form fields on change', () => {
        render(<CaseStudyEditor onBack={() => {}} />);

        const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
        fireEvent.change(titleInput, { target: { value: 'New Project' } });
        expect(titleInput.value).toBe('New Project');
    });

    it('submits form data to the API', async () => {
        (api.createProject as any).mockResolvedValue({ success: true });
        // Mock window.alert
        window.alert = vi.fn();

        render(<CaseStudyEditor onBack={() => {}} />);

        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'API Project' } });
        fireEvent.change(screen.getByLabelText(/Slug/i), { target: { value: 'api-project' } });

        const saveButton = screen.getByRole('button', { name: /^Save$/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(api.createProject).toHaveBeenCalled();
        });
    });
});
