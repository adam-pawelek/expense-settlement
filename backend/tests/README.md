# Backend Tests

This directory contains tests for the Expense Settlement backend API.

## Running Tests

### Install test dependencies

```bash
cd backend
uv sync --extra test
```

### Run all tests

```bash
uv run pytest
```

### Run specific test file

```bash
uv run pytest tests/test_auth.py
```

### Run with coverage

```bash
uv run pytest --cov=app --cov-report=html
```

### Run with verbose output

```bash
uv run pytest -v
```

## Test Structure

- `conftest.py` - Pytest configuration and fixtures
- `test_auth.py` - Authentication endpoint tests
- `test_users.py` - User management endpoint tests
- `test_groups.py` - Group management endpoint tests
- `test_expenses.py` - Expense management endpoint tests

## Test Database

Tests use an in-memory SQLite database that is created and destroyed for each test, ensuring test isolation.

