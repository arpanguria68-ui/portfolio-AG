import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CaseStudyEditor from './CaseStudyEditor';
import { api } from '../../lib/api';

// Mock the API module
vi.mock('../../lib/api', () => ({
    api: {
        createProject: vi.fn(),
        uploadFile: vi.fn()
    }
}));

// Mock LivePreview to isolate Editor testing
vi.mock('./LivePreview', () => ({
    default: () => <div data-testid="live-preview">Live Preview</div>
}));

describe('CaseStudyEditor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock alert
        global.alert = vi.fn();
    });

    it('renders correctly with default sections', () => {
        render(<CaseStudyEditor onBack={() => {}} />);
        // Use getAllByText in case, but with LivePreview mocked, it should be unique unless multiple sections have same name.
        expect(screen.getByText('Hero Section')).toBeInTheDocument();
        expect(screen.getByText('The Problem')).toBeInTheDocument();
    });

    it('can toggle section visibility', () => {
        render(<CaseStudyEditor onBack={() => {}} />);

        // "Hero Section" is initially collapsed (based on component default state)
        // Content "Main headline and intro text..." should NOT be visible initially.
        expect(screen.queryByDisplayValue('Main headline and intro text...')).not.toBeInTheDocument();

        // Click header to expand
        fireEvent.click(screen.getByText('Hero Section'));

        // Now the content should be visible.
        expect(screen.getByDisplayValue('Main headline and intro text...')).toBeInTheDocument();
    });

    it('can add a new section', () => {
        render(<CaseStudyEditor onBack={() => {}} />);

        // Click "Add Section" button
        fireEvent.click(screen.getByText('Add Section'));

        // Click "Text Block" from menu
        // "Text Block" creates a section with title "New Section"
        fireEvent.click(screen.getByText('Text Block'));

        // "New Section" should appear in the list.
        // It might appear multiple times if the menu button itself says "New Section" (it says "Text Block").
        // But let's check.
        expect(screen.getByText('New Section')).toBeInTheDocument();
    });

    it('calls api.createProject on save', async () => {
        (api.createProject as any).mockResolvedValue({});
        const onBack = vi.fn();

        render(<CaseStudyEditor onBack={onBack} />);

        // Click Save button
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(api.createProject).toHaveBeenCalled();
        });

        expect(onBack).toHaveBeenCalled();
    });
});
