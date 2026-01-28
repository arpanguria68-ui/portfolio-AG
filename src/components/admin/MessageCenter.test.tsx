import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MessageCenter from './MessageCenter';
import { api } from '../../lib/api';

// Mock the API
vi.mock('../../lib/api', () => ({
    api: {
        getMessages: vi.fn(),
        deleteMessage: vi.fn(),
        markMessageRead: vi.fn(),
    },
}));

const mockMessages = [
    { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Hello!', date: '2024-01-01T12:00:00.000Z', read: false },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', message: 'Hi there!', date: '2024-01-02T12:00:00.000Z', read: true },
];

describe('MessageCenter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (api.getMessages as any).mockResolvedValue(mockMessages);
        window.confirm = vi.fn().mockReturnValue(true);
    });

    it('renders and fetches messages', async () => {
        render(<MessageCenter />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
    });

    it('deletes a message', async () => {
        (api.deleteMessage as any).mockResolvedValue({ success: true });
        render(<MessageCenter />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('span')?.textContent === 'delete');
        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        await waitFor(() => {
            expect(api.deleteMessage).toHaveBeenCalledWith(1);
        });
    });
});
