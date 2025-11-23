# Testing Guide

This document provides an overview of the test suites for the Expense Settlement application.

## Overview

The application has comprehensive test coverage across three components:

1. **Backend** - Python/FastAPI tests using pytest
2. **Client Library** - TypeScript tests using Vitest
3. **Frontend** - React/Next.js tests using Jest and React Testing Library

## Backend Tests

### Location
`backend/tests/`

### Test Files
- `test_auth.py` - Authentication endpoints (signup, login, get current user)
- `test_users.py` - User management endpoints (profile, update)
- `test_groups.py` - Group management endpoints (create, list, add members)
- `test_expenses.py` - Expense management endpoints (create, list, balance summary)

### Running Backend Tests

```bash
cd backend

# Install test dependencies
uv sync --extra test

# Run all tests
uv run pytest

# Run specific test file
uv run pytest tests/test_auth.py

# Run with coverage
uv run pytest --cov=app --cov-report=html

# Run with verbose output
uv run pytest -v
```

### Test Coverage
- ✅ Authentication (signup, login, token validation)
- ✅ User management (profile, updates)
- ✅ Group management (create, list, add members by email)
- ✅ Expense management (create, list, balance calculations)
- ✅ Error handling (404, 400, 401, 403)
- ✅ Authorization checks

## Client Library Tests

### Location
`client-library/src/__tests__/`

### Test Files
- `client.test.ts` - Comprehensive tests for ExpenseSettlementClient

### Running Client Library Tests

```bash
cd client-library

# Install dependencies
npm install

# Run tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm run test:coverage
```

### Test Coverage
- ✅ Authentication methods (login, signup, getCurrentUser)
- ✅ User management methods
- ✅ Group management methods (including email-based member addition)
- ✅ Expense management methods
- ✅ Error handling (AuthenticationError, NotFoundError, ValidationError, ForbiddenError)
- ✅ Token management (set, get, clear, isAuthenticated)

## Frontend Tests

### Location
`frontend/__tests__/`

### Test Files
- `components/navbar.test.tsx` - Navbar component tests
- `contexts/auth-context.test.tsx` - Authentication context tests
- `lib/api-client.test.ts` - API client initialization tests

### Running Frontend Tests

```bash
cd frontend

# Install dependencies
npm install

# Run tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Test Coverage
- ✅ Component rendering (Navbar)
- ✅ Authentication context (login, signup, logout)
- ✅ API client initialization
- ✅ User state management

## Running All Tests

To run all tests across all components:

```bash
# Backend
cd backend && uv run pytest && cd ..

# Client Library
cd client-library && npm test && cd ..

# Frontend
cd frontend && npm test && cd ..
```

## Test Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Fixtures**: Backend tests use pytest fixtures for database setup/teardown
3. **Mocking**: Frontend tests mock API calls and Next.js navigation
4. **Coverage**: Aim for high test coverage of critical paths
5. **Naming**: Tests use descriptive names that explain what they test

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Backend Tests
  run: cd backend && uv run pytest

- name: Run Client Library Tests
  run: cd client-library && npm test

- name: Run Frontend Tests
  run: cd frontend && npm test
```

## Notes

- Backend tests use an in-memory SQLite database for isolation
- Client library tests mock the fetch API
- Frontend tests mock Next.js router and API client
- All tests should pass before merging code

