import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';

global.fetch = vi.fn();

describe('API Service', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('uploadFile should return url on success', async () => {
        const mockResponse = { url: 'http://localhost:3001/uploads/test.png' };
        (fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        });

        const file = new File(['test'], 'test.png', { type: 'image/png' });
        const url = await api.uploadFile(file);

        expect(url).toBe(mockResponse.url);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/upload'), expect.objectContaining({
            method: 'POST',
            body: expect.any(FormData)
        }));
    });

    it('createProject should post project data', async () => {
        const mockProject = { title: 'Test', tags: [], image: '', sections: [] };
        (fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ ...mockProject, id: 1 })
        });

        const result = await api.createProject(mockProject as any);
        expect(result.id).toBe(1);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/projects'), expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockProject)
        }));
    });
});
