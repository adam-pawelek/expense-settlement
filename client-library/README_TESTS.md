# Client Library Tests

Tests for the Expense Settlement TypeScript client library.

## Running Tests

### Install dependencies

```bash
cd client-library
npm install
```

### Run tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm test -- --watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

## Test Structure

- `src/__tests__/client.test.ts` - Tests for the ExpenseSettlementClient class
  - Authentication tests (login, signup, getCurrentUser)
  - User management tests
  - Group management tests
  - Expense management tests
  - Error handling tests
  - Token management tests

## Testing Framework

Tests use Vitest with happy-dom for browser environment simulation.

