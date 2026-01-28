import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
        await page.goto('/login');

        // Wait for inputs to be visible
        await expect(page.locator('input[type="email"]')).toBeVisible();

        await page.fill('input[type="email"]', 'admin@stitch.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');

        // Should navigate to admin
        await expect(page).toHaveURL(/.*\/admin/);
    });

    test('should show error with invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'wrong@example.com');
        await page.fill('input[type="password"]', 'wrong');

        // Setup dialog handler before action
        page.once('dialog', dialog => {
            expect(dialog.message()).toBe('Invalid credentials');
            dialog.dismiss();
        });

        await page.click('button[type="submit"]');

        // Should stay on login
        await expect(page).toHaveURL(/.*\/login/);
    });
});
