import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CaseStudyEditor from '../CaseStudyEditor';

// Mock LivePreview to simplify testing
vi.mock('../LivePreview', () => ({
    default: () => <div>Live Preview Mock</div>
}));

describe('CaseStudyEditor', () => {
    it('renders editor fields', () => {
        render(<CaseStudyEditor onBack={() => {}} />);
        expect(screen.getByDisplayValue('Reimagining User Onboarding')).toBeInTheDocument();
        expect(screen.getByText('Edit Case Study')).toBeInTheDocument();
    });

    it('updates title', () => {
        render(<CaseStudyEditor onBack={() => {}} />);
        const input = screen.getByDisplayValue('Reimagining User Onboarding');
        fireEvent.change(input, { target: { value: 'New Title' } });
        expect(input).toHaveValue('New Title');
    });
});
