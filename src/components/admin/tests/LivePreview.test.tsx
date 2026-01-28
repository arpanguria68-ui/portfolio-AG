import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LivePreview from '../LivePreview';

describe('LivePreview', () => {
    const mockData = {
        title: 'Test Project',
        sections: [
            { id: 1, title: 'Section 1', content: 'Content 1', type: 'text' }
        ]
    };

    it('renders project title', () => {
        render(<LivePreview data={mockData} template="default" />);
        expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    it('renders section content', () => {
        render(<LivePreview data={mockData} template="default" />);
        expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
});
