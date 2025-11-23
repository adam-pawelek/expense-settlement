# Quick Start: VS Code Debugging

## First Time Setup

1. **Install Recommended Extensions**
   - VS Code will prompt you, or install manually:
     - Python (ms-python.python)
     - Python Debugger (ms-python.debugpy)
     - ESLint
     - Prettier

2. **Select Python Interpreter**
   - Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
   - Type: "Python: Select Interpreter"
   - Choose: `./backend/.venv/bin/python` (Linux/Mac) or `./backend/.venv/Scripts/python.exe` (Windows)

3. **Start PostgreSQL**
   - Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
   - Type: "Tasks: Run Task"
   - Select: "Start PostgreSQL (Docker)"

## Debugging

### Option 1: Debug Single Service

1. Press `F5` or go to **Run and Debug** (Ctrl+Shift+D)
2. Select configuration:
   - **Backend: FastAPI (Python)** - Linux/Mac
   - **Backend: FastAPI (Python - Windows)** - Windows
   - **Frontend: Next.js** - Linux/Mac
   - **Frontend: Next.js (Windows)** - Windows
3. Press `F5` to start

### Option 2: Debug Full Stack

1. Press `F5` or go to **Run and Debug**
2. Select:
   - **Full Stack: Backend + Frontend** (Linux/Mac)
   - **Full Stack: Backend + Frontend (Windows)** (Windows)
3. This starts both services + PostgreSQL automatically

### Option 3: Debug Tests

1. Press `F5` or go to **Run and Debug**
2. Select:
   - **Backend: Python Tests**
   - **Frontend: Jest Tests**
   - **Client Library: Vitest Tests**
   - **All Tests** (runs all test suites)

## Platform Selection Guide

### Linux
- Use configurations **without** "(Windows)" suffix
- Python: `.venv/bin/python`
- Commands: `npm`, `docker-compose`

### Mac
- Use configurations **without** "(Windows)" suffix
- Python: `.venv/bin/python`
- Commands: `npm`, `docker-compose`

### Windows
- Use configurations **with** "(Windows)" suffix
- Python: `.venv/Scripts/python.exe`
- Commands: `npm.cmd`, `docker-compose.exe`

## Common Issues

### "Python interpreter not found"
- Select interpreter: `Ctrl+Shift+P` → "Python: Select Interpreter"
- Choose the virtual environment in `backend/.venv`

### "Cannot connect to database"
- Start PostgreSQL: Run task "Start PostgreSQL (Docker)"
- Wait a few seconds for it to be ready

### "Port already in use"
- Stop other instances of the service
- Or change the port in the configuration

### "Module not found" (Python)
- Install dependencies: Run task "Backend: Install Dependencies"
- Or manually: `cd backend && uv sync`

### "Module not found" (Node.js)
- Install dependencies: Run task "Frontend: Install Dependencies"
- Or manually: `cd frontend && npm install`

## Tips

- **Breakpoints**: Click left of line numbers to set breakpoints
- **Debug Console**: View variables and evaluate expressions
- **Step Over (F10)**: Execute current line
- **Step Into (F11)**: Step into function calls
- **Continue (F5)**: Resume execution







