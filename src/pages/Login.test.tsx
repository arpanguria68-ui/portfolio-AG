import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual as any,
        useNavigate: () => mockedUsedNavigate,
    };
});

describe('Login Page', () => {
    it('renders login form', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('admin@stitch.com')).toBeInTheDocument();
    });

    it('handles form submission and navigates to admin', async () => {
        vi.useFakeTimers();
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('admin@stitch.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••••••'), { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', { name: /Sign In Dashboard/i });
        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();

        // Advance timers to trigger the mock login delay
        act(() => {
            vi.advanceTimersByTime(1500);
        });

        // Use a simple expect instead of waitFor to see if it works with fake timers
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/admin');

        vi.useRealTimers();
    });
});
