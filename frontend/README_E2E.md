# End-to-End Testing with Playwright

This directory contains end-to-end (E2E) tests for the Expense Settlement frontend application using Playwright.

## Prerequisites

1. **Install Playwright browsers:**
   ```bash
   npx playwright install --with-deps chromium
   ```

   Note: This may require sudo permissions on Linux. If you encounter permission issues, you can install browsers manually or run with appropriate permissions.

2. **Ensure backend is running:**
   - The tests require the backend API to be running at `http://localhost:8008` (or the URL specified in `NEXT_PUBLIC_API_URL`)
   - You can start the backend using the VS Code debugger or manually:
     ```bash
     cd backend
     uv run uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8008
     ```

3. **Ensure frontend is running:**
   - The Playwright config can automatically start the frontend dev server, or you can run it manually:
     ```bash
     cd frontend
     npm run dev
     ```

## Running Tests

### Run all E2E tests:
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive):
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

### Run tests in debug mode:
```bash
npm run test:e2e:debug
```

### View test report:
```bash
npm run test:e2e:report
```

### Run specific test file:
```bash
npx playwright test e2e/auth.spec.ts
```

### Run tests matching a pattern:
```bash
npx playwright test --grep "should login"
```

## Test Structure

Tests are organized by feature:

- **`e2e/auth.spec.ts`** - Authentication tests (signup, login, validation)
- **`e2e/groups.spec.ts`** - Group management tests (create, view, add members)
- **`e2e/expenses.spec.ts`** - Expense management tests (add, view, balances)
- **`e2e/profile.spec.ts`** - Profile management tests (update profile)

## Configuration

The Playwright configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3003` (configurable via `PLAYWRIGHT_BASE_URL`)
- **API URL**: `http://localhost:8008` (configurable via `NEXT_PUBLIC_API_URL`)
- **Browsers**: Chromium (default)
- **Auto-start server**: The config can automatically start the Next.js dev server

## Test Helpers

Tests use helper functions to:
- Create test users via API
- Login users and set authentication tokens
- Create groups and expenses for testing

## Writing New Tests

1. **Create a new test file** in the `e2e/` directory:
   ```typescript
   import { test, expect } from '@playwright/test';

   test.describe('Feature Name', () => {
     test('should do something', async ({ page }) => {
       await page.goto('/');
       // Your test code
     });
   });
   ```

2. **Use page objects** for complex interactions (optional):
   - Create reusable page object classes for common UI components
   - Store selectors and actions in one place

3. **Follow best practices**:
   - Use descriptive test names
   - Test user flows, not implementation details
   - Use data-testid attributes when possible (if added to components)
   - Clean up test data when needed

## Debugging Tests

### Using Playwright Inspector:
```bash
npm run test:e2e:debug
```

### Using VS Code:
1. Set breakpoints in your test files
2. Use the "Debug: JavaScript Debug Terminal" in VS Code
3. Run `npm run test:e2e:debug` in that terminal

### Viewing traces:
After a failed test, you can view the trace:
```bash
npx playwright show-trace trace.zip
```

## CI/CD Integration

For CI/CD pipelines:

1. Install browsers in CI:
   ```bash
   npx playwright install --with-deps chromium
   ```

2. Run tests:
   ```bash
   npm run test:e2e
   ```

3. The config automatically:
   - Sets retries to 2 on CI
   - Uses 1 worker on CI
   - Fails on `test.only`

## Environment Variables

- `PLAYWRIGHT_BASE_URL` - Frontend URL (default: `http://localhost:3003`)
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:8008`)
- `CI` - Set to `true` in CI environments

## Troubleshooting

### Tests fail with "Connection refused"
- Ensure the backend is running on the expected port
- Check that `NEXT_PUBLIC_API_URL` matches your backend URL

### Tests fail with "Navigation timeout"
- Ensure the frontend is running or the webServer config is correct
- Check that the port (3003) is not already in use

### Browser installation fails
- On Linux, you may need to install system dependencies:
  ```bash
  npx playwright install-deps
  ```
- Or install browsers manually with appropriate permissions

### Tests are flaky
- Increase timeouts for slow operations
- Use `waitForSelector` or `waitForLoadState` when needed
- Check for race conditions in test setup

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Clean up test data (users, groups, expenses) when possible
3. **Selectors**: Prefer stable selectors (data-testid, role, text) over CSS classes
4. **Waits**: Use Playwright's auto-waiting features instead of manual `sleep()`
5. **Assertions**: Use Playwright's built-in assertions for better error messages

## Example Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should work correctly', async ({ page }) => {
    // Navigate
    await page.goto('/');
    
    // Interact
    await page.click('button:has-text("Click me")');
    
    // Assert
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```







