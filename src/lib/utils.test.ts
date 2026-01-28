import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
    it('merges tailwind classes correctly', () => {
        expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('handles conditional classes', () => {
        expect(cn('bg-red-500', true && 'text-white', false && 'hidden')).toBe('bg-red-500 text-white');
    });

    it('overrides conflicting tailwind classes', () => {
        expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    });
});
