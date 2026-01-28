import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Gallery from './Gallery';
import { BrowserRouter } from 'react-router-dom';

describe('Gallery Page', () => {
    it('renders project list and header', () => {
        render(
            <BrowserRouter>
                <Gallery />
            </BrowserRouter>
        );

        expect(screen.getByText(/Magical/i)).toBeInTheDocument();
        expect(screen.getByText(/Projects/i)).toBeInTheDocument();
        expect(screen.getByText('NeoWealth 2.0')).toBeInTheDocument();
        expect(screen.getByText('Sentient Analytics')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <BrowserRouter>
                <Gallery />
            </BrowserRouter>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Work')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });
});
