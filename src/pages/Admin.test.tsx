import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Admin from './Admin';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../lib/api';

// Mock the API
vi.mock('../lib/api', () => ({
    api: {
        getProjects: vi.fn(),
    },
}));

// Mock sub-components
vi.mock('../components/admin/CaseStudyEditor', () => ({
    default: ({ onBack }: any) => (
        <div data-testid="case-study-editor">
            Edit Case Study
            <button onClick={onBack}>arrow_back_ios_new</button>
        </div>
    )
}));

vi.mock('../components/admin/MessageCenter', () => ({
    default: () => <div data-testid="message-center">Message Center</div>
}));

const mockProjects = [
    { id: 1, title: 'Project A', category: 'SaaS', year: '2024', role: 'Designer', image: 'a.jpg' },
    { id: 2, title: 'Project B', category: 'Mobile', year: '2023', role: 'Manager', image: 'b.jpg' },
];

describe('Admin Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (api.getProjects as any).mockResolvedValue(mockProjects);
    });

    it('renders dashboard by default', () => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );
        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    });

    it('switches between tabs', async () => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );

        // Click on Projects tab in sidebar
        const projectsTab = screen.getAllByRole('button').find(btn =>
            btn.textContent?.toLowerCase().includes('projects')
        );
        fireEvent.click(projectsTab!);

        // Wait for Projects view to show
        await waitFor(() => {
            expect(screen.getByText((_content, element) => {
                return element?.tagName.toLowerCase() === 'h2' && element.textContent === 'My Projects';
            })).toBeInTheDocument();
        });

        // Click on Toolbox tab
        const toolboxTab = screen.getAllByRole('button').find(btn =>
            btn.textContent?.toLowerCase().includes('toolbox')
        );
        fireEvent.click(toolboxTab!);

        expect(screen.getByText(/Professional Skills/i)).toBeInTheDocument();
    });

    it('manages skills in Toolbox', () => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );

        const toolboxTab = screen.getAllByRole('button').find(btn =>
            btn.textContent?.toLowerCase().includes('toolbox')
        );
        fireEvent.click(toolboxTab!);

        expect(screen.getByText('Product Strategy')).toBeInTheDocument();

        const visibilityButtons = screen.getAllByRole('button').filter(btn => {
            const span = btn.querySelector('.material-symbols-outlined');
            return span && (span.textContent === 'visibility' || span.textContent === 'visibility_off');
        });

        const initialText = visibilityButtons[0].querySelector('.material-symbols-outlined')?.textContent;
        fireEvent.click(visibilityButtons[0]);
        const updatedText = visibilityButtons[0].querySelector('.material-symbols-outlined')?.textContent;

        expect(updatedText).not.toBe(initialText);
    });

    it('fetches and displays projects in Projects tab', async () => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );

        const projectsTab = screen.getAllByRole('button').find(btn =>
            btn.textContent?.toLowerCase().includes('projects')
        );
        fireEvent.click(projectsTab!);

        await waitFor(() => {
            expect(screen.getByText('Project A')).toBeInTheDocument();
        });
    });

    it('filters projects by category', async () => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );

        const projectsTab = screen.getAllByRole('button').find(btn =>
            btn.textContent?.toLowerCase().includes('projects')
        );
        fireEvent.click(projectsTab!);

        await waitFor(() => {
            expect(screen.getByText('Project A')).toBeInTheDocument();
        });

        const saasFilter = screen.getByRole('button', { name: 'SaaS' });
        fireEvent.click(saasFilter);

        expect(screen.getByText('Project A')).toBeInTheDocument();
        expect(screen.queryByText('Project B')).not.toBeInTheDocument();
    });

    it('opens project editor', async () => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );

        const projectsTab = screen.getAllByRole('button').find(btn =>
            btn.textContent?.toLowerCase().includes('projects')
        );
        fireEvent.click(projectsTab!);

        await waitFor(() => {
            expect(screen.getByText('Add Project')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Add Project'));
        expect(screen.getByTestId('case-study-editor')).toBeInTheDocument();

        fireEvent.click(screen.getByText('arrow_back_ios_new'));
        expect(screen.queryByTestId('case-study-editor')).not.toBeInTheDocument();
    });

    it('navigates to Media Library', () => {
        render(
            <BrowserRouter>
                <Admin />
            </BrowserRouter>
        );

        const mediaTab = screen.getAllByRole('button').find(btn =>
            btn.textContent?.toLowerCase().includes('media library')
        );
        fireEvent.click(mediaTab!);

        expect(screen.getByText(/Upload New Image/i)).toBeInTheDocument();
        expect(screen.getByText('hero-banner_v2.jpg')).toBeInTheDocument();
    });
});
