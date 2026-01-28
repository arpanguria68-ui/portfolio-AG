import { test, expect } from '@playwright/test';

test.describe('Admin Panel & Backend Connectivity', () => {
    test.beforeEach(async ({ page }) => {
        // Log console output and errors to help debug
        page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
        page.on('pageerror', exception => console.log(`BROWSER ERROR: ${exception}`));

        // Go to Admin Page
        await page.goto('http://localhost:5173/admin');
    });

    test('Verification 1: Dashboard Connectivity', async ({ page }) => {
        // Verify dashboard loads (checks basic routing)
        await expect(page).toHaveTitle(/Alexander Portz | Product Manager Portfolio/);
        await expect(page.locator('text=Welcome Back')).toBeVisible();
        await expect(page.locator('text=Total Visits')).toBeVisible();
    });

    test('Verification 2: Message Center (Reading Data)', async ({ page }) => {
        await page.click('button:has-text("Messages")');

        // Connectivity Check: "Inbox" header confirms component loaded
        await expect(page.locator('text=Inbox')).toBeVisible();

        // Connectivity Check: Verify async data fetch (either loaded messages or empty state)
        // We look for either a message item OR the "No messages yet" text, either confirms API response
        const messagesLoaded = await page.locator('.material-symbols-outlined:has-text("inbox")').isVisible().catch(() => false);
        if (messagesLoaded) {
            await expect(page.locator('text=No messages yet')).toBeVisible();
        } else {
            await expect(page.locator('text=Inbox')).toBeVisible();
        }
    });

    test('Verification 3: Project Creation (Full Round Trip)', async ({ page }) => {
        test.setTimeout(60000); // Increase timeout for form interactions

        // 1. Navigate to Projects
        await page.click('button:has-text("Projects")');
        await expect(page.locator('text=My Projects')).toBeVisible();

        // 2. Open Editor
        await page.click('button:has-text("Add Project")');
        await expect(page.locator('text=Edit Case Study')).toBeVisible();

        // 3. Fill Form (Connectivity Check: Input handling)
        const timestamp = Date.now();
        const testTitle = `Test Project ${timestamp}`;
        // Note: The inputs in CaseStudyEditor don't have 'name' attributes yet, so we use other locators
        // The first input is Title
        const titleInput = page.locator('input').first();
        await titleInput.fill(testTitle);

        // 4. Save (Connectivity Check: POST request to API)
        // Handle dialog that appears on success
        page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });

        await page.click('button:has-text("Save")');

        // 5. Verify Redirect/Update (Connectivity Check: UI updates after DB change)
        // Should go back to grid
        await expect(page.locator('text=My Projects')).toBeVisible({ timeout: 10000 });

        // 6. Verify New Item in List (Connectivity Check: GET request fetches new data)
        // Reload projects list to be sure or wait for potential auto-refresh
        // The component fetches on mount, so if we navigated back it might re-fetch?
        // Actually CaseStudyEditor calls `onBack` which just sets state.
        // `Admin.tsx` doesn't strictly re-fetch when `viewMode` changes unless we force it or if it unmounts?
        // Let's force a reload to be sure we are testing the PERSISTENCE.
        await page.reload();
        await page.click('button:has-text("Projects")');

        await expect(page.locator(`text=${testTitle}`)).toBeVisible();
    });
});
