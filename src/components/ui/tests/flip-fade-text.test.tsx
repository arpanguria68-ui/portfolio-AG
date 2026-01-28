import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlipFadeText } from '../flip-fade-text';

// Mock framer-motion to skip animations
vi.mock('framer-motion', async () => {
    return {
        AnimatePresence: ({ children }: any) => <>{children}</>,
        motion: {
            div: ({ children, className }: any) => <div className={className}>{children}</div>,
            span: ({ children, className }: any) => <span className={className}>{children}</span>,
        }
    };
});

describe('FlipFadeText', () => {
    it('renders with default words', () => {
        const { container } = render(<FlipFadeText />);
        expect(container.textContent).toContain('LOADING');
    });

    it('cycles through words', () => {
        vi.useFakeTimers();
        const words = ['ONE', 'TWO'];
        const { container } = render(<FlipFadeText words={words} interval={1000} />);

        expect(container.textContent).toContain('ONE');

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(container.textContent).toContain('TWO');
        vi.useRealTimers();
    });
});
