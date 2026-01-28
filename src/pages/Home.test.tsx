import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from './Home';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../lib/api';

// Mock the API
vi.mock('../lib/api', () => ({
    api: {
        getProjects: vi.fn(),
        createMessage: vi.fn(),
    },
}));

// Mock complex UI components to avoid timer issues
vi.mock('../components/ui/flip-fade-text', () => ({
    FlipFadeText: () => <div data-testid="flip-fade-text">FlipFadeText</div>
}));

vi.mock('../components/ui/glow-border-card', () => ({
    GlowBorderCard: ({ children }: any) => <div data-testid="glow-border-card">{children}</div>
}));

const mockProjects = [
    {
        id: 1,
        title: "Test Project A",
        description: "Description A",
        year: "2024",
        tags: ["Fintech"],
        image: "imageA.jpg",
        link: "/a"
    },
    {
        id: 2,
        title: "Test Project B",
        description: "Description B",
        year: "2023",
        tags: ["SaaS"],
        image: "imageB.jpg",
        link: "/b"
    }
];

describe('Home Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (api.getProjects as any).mockResolvedValue(mockProjects);
        (api.createMessage as any).mockResolvedValue({ success: true });

        // Mock window.scrollTo
        window.scrollTo = vi.fn();
    });

    it('renders hero section and components', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        expect(screen.getByText((_content, element) => {
            return element?.tagName.toLowerCase() === 'span' && element.textContent === 'Product' && element.parentElement?.tagName.toLowerCase() === 'h1';
        })).toBeInTheDocument();

        expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
        expect(screen.getByText(/Available for work/i)).toBeInTheDocument();
        expect(screen.getByTestId('flip-fade-text')).toBeInTheDocument();
    });

    it('fetches and displays projects', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(api.getProjects).toHaveBeenCalled();
        });

        expect(screen.getByText('Test Project A')).toBeInTheDocument();
        expect(screen.getByText('Test Project B')).toBeInTheDocument();
    });

    it('filters projects by tag', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Project A')).toBeInTheDocument();
        });

        const fintechButton = screen.getByRole('button', { name: /FINTECH/i });
        fireEvent.click(fintechButton);

        expect(screen.getByText('Test Project A')).toBeInTheDocument();
        expect(screen.queryByText('Test Project B')).not.toBeInTheDocument();

        const allButton = screen.getByRole('button', { name: /ALL/i });
        fireEvent.click(allButton);

        expect(screen.getByText('Test Project A')).toBeInTheDocument();
        expect(screen.getByText('Test Project B')).toBeInTheDocument();
    });

    it('sorts projects', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Project A')).toBeInTheDocument();
        });

        const sortSelect = screen.getByRole('combobox');

        fireEvent.change(sortSelect, { target: { value: 'Oldest' } });
        let titles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
        expect(titles[0]).toBe('Test Project B');

        fireEvent.change(sortSelect, { target: { value: 'A-Z' } });
        titles = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
        expect(titles[0]).toBe('Test Project A');
    });

    it('handles contact form submission', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/john@example.com/i), { target: { value: 'jane@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Tell me about your project/i), { target: { value: 'Hello!' } });

        const submitButton = screen.getByRole('button', { name: /Send Message/i });

        // Status: idle -> sending
        fireEvent.click(submitButton);
        expect(screen.getByText(/Sending.../i)).toBeInTheDocument();

        // Wait for status change: sending -> success
        await waitFor(() => {
            expect(screen.getByText(/Message Sent!/i)).toBeInTheDocument();
        });

        expect(api.createMessage).toHaveBeenCalled();
    });

    it('scrolls to top on mount', () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
});
