import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

// Helper function to generate unique email
function generateEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
}

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    await page.goto('/');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should sign up a new user', async ({ page }) => {
    const email = generateEmail();
    const username = `user_${Date.now()}`;
    const password = 'TestPassword123!';
    const fullName = 'Test User';

    // Navigate to signup
    await page.goto('/signup');

    // Fill signup form
    await page.fill('input[type="email"]', email);
    await page.fill('input[id="username"]', username);
    await page.fill('input[id="fullName"]', fullName);
    await page.fill('input[type="password"]', password);

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to home page after successful signup
    await expect(page).toHaveURL('/');
    
    // Wait for loading to complete and groups page to be visible
    await expect(page.locator('h1:has-text("Groups")')).toBeVisible({ timeout: 10000 });
  });

  test('should login with existing user', async ({ page, request }) => {
    // First, create a user via API
    const email = generateEmail();
    const username = `user_${Date.now()}`;
    const password = 'TestPassword123!';

    const signupResponse = await request.post(`${API_URL}/api/v1/auth/signup`, {
      data: {
        email,
        username,
        password,
      },
    });
    expect(signupResponse.ok()).toBeTruthy();

    // Now login via UI
    await page.goto('/login');

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Wait for loading to complete and groups page to be visible
    await expect(page.locator('h1:has-text("Groups")')).toBeVisible({ timeout: 10000 });
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Incorrect email or password')).toBeVisible();
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');
    
    // Click sign up link
    await page.click('text=Sign up');
    await expect(page).toHaveURL('/signup');

    // Click login link
    await page.click('text=Login');
    await expect(page).toHaveURL('/login');
  });

  test('should validate signup form fields', async ({ page }) => {
    await page.goto('/signup');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    // Check if validation attributes are present
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
  });
});

