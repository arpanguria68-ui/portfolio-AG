import { test, expect } from '@playwright/test';

test.describe('Portfolio Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('Hero Section loads correctly', async ({ page }) => {
        await expect(page).toHaveTitle(/Alexander Portz | Product Manager Portfolio/);
        await expect(page.getByText('Product', { exact: true })).toBeVisible();
        await expect(page.getByText('Portfolio')).toBeVisible();
        // Check for animated text container
        const animatedText = page.locator('.text-primary.text-7xl'); // FlipFadeText wrapper class
        await expect(animatedText).toBeVisible();
    });

    test('Projects Gallery displays seeded projects', async ({ page }) => {
        // Scroll to projects
        const gallery = page.locator('#selected-masterpieces'); // Section ID if exists
        // Ideally user scrolls, but locators auto-scroll

        // Check for the seeded project title
        await expect(page.locator('text=NeoBank Finance')).toBeVisible();
        await expect(page.locator('text=DataViz Pro')).toBeVisible();

        // Check filtering
        await page.click('button:has-text("Fintech")');
        await expect(page.locator('text=NeoBank Finance')).toBeVisible();
        await expect(page.locator('text=Vitality Health')).not.toBeVisible(); // Health tag, should hide
    });

    test('Contact Form submission', async ({ page }) => {
        await page.fill('input[name="name"]', 'Playwright Tester');
        await page.fill('input[name="email"]', 'bot@test.com');
        await page.fill('textarea[name="message"]', 'Automated submission');

        await page.click('button[type="submit"]'); // Or "Send Message" text

        // Verify success state (assuming we show "Message Sent" or similar)
        await expect(page.locator('text=Message sent')).toBeVisible({ timeout: 5000 });
    });
});
