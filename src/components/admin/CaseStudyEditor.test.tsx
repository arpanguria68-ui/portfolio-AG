import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CaseStudyEditor from './CaseStudyEditor';
import { useMutation } from 'convex/react';

// Mock LivePreview to isolate Editor testing
vi.mock('./LivePreview', () => ({
    default: () => <div data-testid="live-preview">Live Preview</div>
}));

describe('CaseStudyEditor', () => {
    const mockCreateProject = vi.fn();
    const mockUpdateProject = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default mock implementation for useMutation
        (useMutation as any).mockImplementation((mutation: string) => {
            if (mutation === "projects:create") return mockCreateProject;
            if (mutation === "projects:update") return mockUpdateProject;
            return vi.fn();
        });
        global.alert = vi.fn();
    });

    it('renders correctly with default sections', () => {
        render(<CaseStudyEditor onBack={() => {}} />);
        expect(screen.getByText('Hero Section')).toBeInTheDocument();
        expect(screen.getByText('The Problem')).toBeInTheDocument();
    });

    it('can toggle section visibility', () => {
        render(<CaseStudyEditor onBack={() => {}} />);
        expect(screen.queryByDisplayValue('Main headline and intro text...')).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Hero Section'));
        expect(screen.getByDisplayValue('Main headline and intro text...')).toBeInTheDocument();
    });

    it('can add a new section', () => {
        render(<CaseStudyEditor onBack={() => {}} />);
        fireEvent.click(screen.getByText('Add Section'));
        fireEvent.click(screen.getByText('Text Block'));
        expect(screen.getByText('New Section')).toBeInTheDocument();
    });

    it('calls createProject mutation on save', async () => {
        const onBack = vi.fn();
        render(<CaseStudyEditor onBack={onBack} />);

        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(mockCreateProject).toHaveBeenCalled();
        });

        expect(onBack).toHaveBeenCalled();
    });
});
