# Frontend Tests

Tests for the Expense Settlement Next.js frontend application.

## Running Tests

### Install dependencies

```bash
cd frontend
npm install
```

### Run tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

## Test Structure

- `__tests__/components/` - Component tests
- `__tests__/contexts/` - Context tests
- `__tests__/lib/` - Utility and API client tests

## Testing Framework

Tests use Jest with React Testing Library for component testing and jsdom for DOM simulation.

## Mocking

- Next.js navigation is mocked in `jest.setup.js`
- API client is mocked in context tests
- Authentication context is mocked in component tests

