import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FlipFadeText } from './flip-fade-text';

// Mock framer-motion to avoid animation delays in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('FlipFadeText', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    it('renders the first word initially', () => {
        const words = ['One', 'Two', 'Three'];
        render(<FlipFadeText words={words} />);

        expect(screen.getAllByText((_content, element) => {
            return element?.textContent === 'One';
        }).length).toBeGreaterThan(0);
    });

    it('cycles through words after interval', () => {
        const words = ['One', 'Two', 'Three'];
        render(<FlipFadeText words={words} interval={1000} />);

        expect(screen.getAllByText((_content, element) => element?.textContent === 'One').length).toBeGreaterThan(0);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getAllByText((_content, element) => element?.textContent === 'Two').length).toBeGreaterThan(0);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getAllByText((_content, element) => element?.textContent === 'Three').length).toBeGreaterThan(0);
    });
});
