import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the pages
vi.mock('./pages/Home', () => ({ default: () => <div data-testid="home-page">Home Page</div> }));
vi.mock('./pages/Gallery', () => ({ default: () => <div data-testid="gallery-page">Gallery Page</div> }));
vi.mock('./pages/Admin', () => ({ default: () => <div data-testid="admin-page">Admin Page</div> }));
vi.mock('./pages/Login', () => ({ default: () => <div data-testid="login-page">Login Page</div> }));

describe('App Component', () => {
    it('renders Home page by default', () => {
        render(<App />);
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('navigates to different routes', () => {
        window.history.pushState({}, 'Gallery', '/gallery');
        render(<App />);
        expect(screen.getByTestId('gallery-page')).toBeInTheDocument();

        window.history.pushState({}, 'Login', '/login');
        render(<App />);
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
});
