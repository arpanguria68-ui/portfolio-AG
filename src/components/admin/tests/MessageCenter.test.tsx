import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MessageCenter from '../MessageCenter';
import { api } from '../../../lib/api';

// Mock API
vi.mock('../../../lib/api', () => ({
    api: {
        getMessages: vi.fn(),
        deleteMessage: vi.fn(),
        markMessageRead: vi.fn()
    }
}));

describe('MessageCenter', () => {
    it('renders messages fetched from API', async () => {
        const mockMessages = [
            { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Hello', date: new Date().toISOString(), read: false }
        ];
        (api.getMessages as any).mockResolvedValue(mockMessages);

        render(<MessageCenter />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Hello')).toBeInTheDocument();
        });
    });

    it('shows empty state when no messages', async () => {
        (api.getMessages as any).mockResolvedValue([]);
        render(<MessageCenter />);
        await waitFor(() => {
            expect(screen.getByText('No messages yet')).toBeInTheDocument();
        });
    });
});
