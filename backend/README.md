# Expense Settlement Backend API

A FastAPI-based REST API for managing split expenses between members of a group.

## Features

- User authentication (signup, login, JWT tokens)
- User profile management
- Group management (create groups, add members)
- Expense management (add expenses, view history, balance summaries)

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **JWT**: JSON Web Tokens for authentication
- **UV**: Fast Python package manager
- **PostgreSQL**: Database (via Docker Compose)
- **SQLite**: Database (for local development without Docker)

## Prerequisites

### For Local Development
- Python 3.12+
- UV package manager

### For Docker
- Docker
- Docker Compose

## Installation

1. Install UV (if not already installed):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Install dependencies:
```bash
uv sync
```

3. (Optional) Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

## Running the Application

### Option 1: Docker Compose (Recommended)

This will start both PostgreSQL and the FastAPI backend:

```bash
# Build and start services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

The API will be available at:
- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
- PostgreSQL: localhost:5432

**For detailed Docker instructions, see [DOCKER.md](DOCKER.md)**

### Option 2: Local Development Mode

```bash
# Install dependencies
uv sync

# Run with SQLite (default)
uv run uvicorn src.app.main:app --reload --host 0.0.0.0 --port 8000

# Or use the run script
./run.sh
```

The API will be available at:
- API: http://localhost:8000
- Interactive API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - User sign up
- `POST /api/v1/auth/login` - User login (returns JWT token)
- `GET /api/v1/auth/me` - Get current user info

### Users

- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update current user profile
- `GET /api/v1/users/{user_id}` - Get user by ID

### Groups

- `POST /api/v1/groups` - Create a new group
- `GET /api/v1/groups` - Get all groups user is a member of
- `GET /api/v1/groups/{group_id}` - Get group details
- `POST /api/v1/groups/{group_id}/members?user_id={user_id}` - Add member to group

### Expenses

- `POST /api/v1/expenses` - Add expense for a group
- `GET /api/v1/expenses/group/{group_id}` - View expense history for a group
- `GET /api/v1/expenses/group/{group_id}/balance` - Get balance summary for a group

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Database

### Docker Compose (PostgreSQL)

When using Docker Compose, PostgreSQL is automatically configured and connected. The database credentials are:
- **Host**: `db` (within Docker network) or `localhost` (from host)
- **Port**: `5432`
- **Database**: `expense_settlement`
- **User**: `expense_user`
- **Password**: `expense_password`

The connection string is automatically set in the Docker Compose environment.

### Local Development (SQLite)

The application uses SQLite by default (stored in `expense_settlement.db`). To use PostgreSQL locally, update the `DATABASE_URL` in your `.env` file:

```
DATABASE_URL=postgresql://expense_user:expense_password@localhost:5432/expense_settlement
```

**Note**: Make sure PostgreSQL is running and the database exists when using PostgreSQL locally.

## Project Structure

```
backend/
├── src/
│   └── app/
│       ├── __init__.py
│       ├── main.py          # FastAPI application
│       ├── config.py         # Configuration settings
│       ├── database.py       # Database setup
│       ├── models.py         # SQLAlchemy models
│       ├── schemas.py        # Pydantic schemas
│       ├── auth.py           # Authentication utilities
│       └── routers/
│           ├── __init__.py
│           ├── auth.py       # Authentication routes
│           ├── users.py      # User management routes
│           ├── groups.py     # Group management routes
│           └── expenses.py   # Expense management routes
├── pyproject.toml            # Project dependencies
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Docker Compose configuration
├── .dockerignore           # Docker ignore file
├── .env.example            # Environment variables template
├── run.sh                  # Quick start script
└── README.md               # This file
```

## Development

### Type Safety

The application uses:
- **Pydantic** for request/response validation
- **SQLAlchemy** with type hints for database models
- **Python type annotations** throughout

### Testing

To test the API, you can use the interactive docs at `/docs` or use tools like `curl` or `httpie`.

Example:
```bash
# Sign up
curl -X POST "http://localhost:8000/api/v1/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123", "full_name": "Test User"}'

# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- SQL injection protection via SQLAlchemy ORM
- Input validation via Pydantic schemas
- **Important**: Change the `SECRET_KEY` in production!
- **Important**: Update CORS settings for production!

## License

This project is part of a take-home assessment.

