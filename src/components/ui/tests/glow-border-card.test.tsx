import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlowBorderCard } from '../glow-border-card';

describe('GlowBorderCard', () => {
    it('renders children', () => {
        render(<GlowBorderCard>Test Content</GlowBorderCard>);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
});
