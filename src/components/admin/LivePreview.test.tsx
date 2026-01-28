import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LivePreview from './LivePreview';

describe('LivePreview', () => {
    const mockData = {
        title: 'Preview Title',
        slug: 'preview-slug',
        sections: [
            { id: 1, title: 'Section 1', content: 'Content 1', type: 'hero' },
            { id: 2, title: 'Section 2', content: 'Content 2', type: 'problem' }
        ]
    };

    it('renders with the provided data', () => {
        render(<LivePreview data={mockData} template="glass" />);

        expect(screen.getByText('Preview Title')).toBeInTheDocument();
        expect(screen.getByText('Section 1')).toBeInTheDocument();
        expect(screen.getByText('Content 1')).toBeInTheDocument();
        expect(screen.getByText('Section 2')).toBeInTheDocument();
        expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('renders different templates', () => {
        const { rerender } = render(<LivePreview data={mockData} template="glass" />);
        expect(screen.getByText('Preview Title')).toBeInTheDocument();

        rerender(<LivePreview data={mockData} template="ghibli" />);
        expect(screen.getByText('Preview Title')).toBeInTheDocument();

        rerender(<LivePreview data={mockData} template="default" />);
        expect(screen.getByText('Preview Title')).toBeInTheDocument();
    });
});
