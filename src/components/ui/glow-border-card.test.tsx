import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlowBorderCard } from './glow-border-card';

describe('GlowBorderCard', () => {
    it('renders its children', () => {
        render(
            <GlowBorderCard>
                <div data-testid="child">Test Child</div>
            </GlowBorderCard>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const { container } = render(
            <GlowBorderCard className="custom-class">
                <div>Content</div>
            </GlowBorderCard>
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('sets aspect ratio style', () => {
        const { container } = render(
            <GlowBorderCard aspectRatio="16/9">
                <div>Content</div>
            </GlowBorderCard>
        );
        const element = container.querySelector('[style*="aspect-ratio: 16/9"]');
        expect(element).toBeInTheDocument();
    });
});
