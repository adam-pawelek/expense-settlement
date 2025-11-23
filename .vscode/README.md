# VS Code Debug Configuration

This directory contains VS Code debug configurations for the Expense Settlement application.

## Prerequisites

### Required Extensions

Install the recommended extensions:
- Python (ms-python.python)
- Python Debugger (ms-python.debugpy)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)

VS Code will prompt you to install these when you open the workspace.

### Platform-Specific Setup

#### Linux/Mac
- Python: Uses `${workspaceFolder}/backend/.venv/bin/python`
- Node.js: Uses system `npm` command
- Docker: Uses `docker-compose` command

#### Windows
- Python: Uses `${workspaceFolder}/backend/.venv/Scripts/python.exe`
- Node.js: Uses `npm.cmd` command
- Docker: Uses `docker-compose.exe` command

## Debug Configurations

### Backend (Python/FastAPI)

#### 1. Backend: FastAPI (Python)
- **Platform**: Linux/Mac
- **Type**: Python debugger
- **Description**: Launches FastAPI server with hot reload
- **Port**: 8000
- **Database**: PostgreSQL (from Docker)

#### 2. Backend: FastAPI (Python - Windows)
- **Platform**: Windows
- **Type**: Python debugger
- **Description**: Same as above, but for Windows paths

#### 3. Backend: FastAPI (Python - UV)
- **Platform**: All (uses VS Code Python interpreter)
- **Type**: Python debugger
- **Description**: Uses VS Code's selected Python interpreter

#### 4. Backend: Python Tests
- **Platform**: Linux/Mac
- **Type**: Python debugger
- **Description**: Runs pytest with debugger attached

#### 5. Backend: Python Tests (Windows)
- **Platform**: Windows
- **Type**: Python debugger
- **Description**: Same as above, but for Windows

### Frontend (Next.js)

#### 1. Frontend: Next.js
- **Platform**: Linux/Mac
- **Type**: Node.js debugger
- **Description**: Launches Next.js dev server with debugging
- **Port**: 3000

#### 2. Frontend: Next.js (Windows)
- **Platform**: Windows
- **Type**: Node.js debugger
- **Description**: Same as above, but for Windows

#### 3. Frontend: Next.js Debug
- **Platform**: All
- **Type**: Node.js attach debugger
- **Description**: Attaches to running Next.js process on port 9229
- **Note**: Requires Next.js to be started with `NODE_OPTIONS='--inspect'`

#### 4. Frontend: Jest Tests
- **Platform**: Linux/Mac
- **Type**: Node.js debugger
- **Description**: Runs Jest tests with debugger

#### 5. Frontend: Jest Tests (Windows)
- **Platform**: Windows
- **Type**: Node.js debugger
- **Description**: Same as above, but for Windows

### Client Library (TypeScript)

#### 1. Client Library: Vitest Tests
- **Platform**: Linux/Mac
- **Type**: Node.js debugger
- **Description**: Runs Vitest tests with debugger

#### 2. Client Library: Vitest Tests (Windows)
- **Platform**: Windows
- **Type**: Node.js debugger
- **Description**: Same as above, but for Windows

## Compound Configurations

### Full Stack: Backend + Frontend
- **Platform**: Linux/Mac
- **Description**: Starts both backend and frontend simultaneously
- **Pre-launch**: Starts PostgreSQL Docker container
- **Services**: Backend (8000) + Frontend (3000)

### Full Stack: Backend + Frontend (Windows)
- **Platform**: Windows
- **Description**: Same as above, but for Windows

### All Tests
- **Platform**: Linux/Mac
- **Description**: Runs all test suites simultaneously
- **Services**: Backend tests + Frontend tests + Client Library tests

## How to Use

### Starting a Debug Session

1. **Open VS Code** in the project root
2. **Go to Run and Debug** (Ctrl+Shift+D / Cmd+Shift+D)
3. **Select a configuration** from the dropdown
4. **Press F5** or click the green play button

### Setting Breakpoints

1. Click in the gutter (left of line numbers) to set breakpoints
2. Red dots indicate active breakpoints
3. Debugger will pause execution at breakpoints

### Debug Controls

- **Continue (F5)**: Resume execution
- **Step Over (F10)**: Execute current line
- **Step Into (F11)**: Step into function calls
- **Step Out (Shift+F11)**: Step out of current function
- **Restart (Ctrl+Shift+F5)**: Restart debug session
- **Stop (Shift+F5)**: Stop debugging

### Debug Console

- View variable values
- Evaluate expressions
- Execute code in current context

## Tasks

VS Code tasks are available for common operations:

- **Start PostgreSQL (Docker)**: Starts PostgreSQL container
- **Stop PostgreSQL (Docker)**: Stops PostgreSQL container
- **Backend: Install Dependencies**: Installs Python dependencies
- **Frontend: Install Dependencies**: Installs Node.js dependencies
- **Client Library: Install Dependencies**: Installs TypeScript dependencies
- **Backend: Run Tests**: Runs pytest
- **Frontend: Run Tests**: Runs Jest
- **Client Library: Run Tests**: Runs Vitest

Access tasks via: **Terminal → Run Task** (Ctrl+Shift+P / Cmd+Shift+P)

## Troubleshooting

### Python Debugger Not Working

1. **Check Python interpreter**:
   - Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
   - Type "Python: Select Interpreter"
   - Choose the virtual environment: `backend/.venv/bin/python`

2. **Install debugpy**:
   ```bash
   cd backend
   uv add --dev debugpy
   ```

3. **Check Python extension**: Ensure Python extension is installed and enabled

### Node.js Debugger Not Working

1. **Check Node.js version**: Should be 18+ for Next.js
2. **Install dependencies**: Run `npm install` in frontend/client-library
3. **Check port conflicts**: Ensure ports 3000, 8000, 9229 are available

### Docker Not Starting

1. **Check Docker is running**: `docker ps`
2. **Check docker-compose**: `docker-compose --version`
3. **Windows**: Use `docker-compose.exe` instead of `docker-compose`

### Database Connection Issues

1. **Start PostgreSQL first**: Use task "Start PostgreSQL (Docker)"
2. **Check connection string**: Verify `.env` file has correct `DATABASE_URL`
3. **Check port**: Ensure port 5432 is not in use

## Platform-Specific Notes

### Linux
- Python: `/backend/.venv/bin/python`
- Commands: Use standard Unix commands
- Docker: `docker-compose`

### Mac
- Python: `/backend/.venv/bin/python`
- Commands: Use standard Unix commands
- Docker: `docker-compose` or `docker compose` (v2)

### Windows
- Python: `/backend/.venv/Scripts/python.exe`
- Commands: Use `.cmd` or `.exe` extensions
- Docker: `docker-compose.exe` or `docker compose` (v2)
- Paths: Use backslashes or forward slashes (both work)

## Environment Variables

Debug configurations use environment variables from:
- Backend: `backend/.env` or `backend/.env.dev`
- Frontend: `frontend/.env.local`

Make sure these files exist and are configured correctly.







