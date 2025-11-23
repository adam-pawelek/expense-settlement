# VS Code Debug Troubleshooting

## Frontend Jest Tests: "jest: not found"

### Problem
When running "Frontend: Jest Tests", you get:
```
sh: 1: jest: not found
```

### Solution

1. **Install dependencies first:**
   ```bash
   cd frontend
   npm install
   ```

2. **Or use the VS Code task:**
   - Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
   - Type: "Tasks: Run Task"
   - Select: "Frontend: Install Dependencies"

3. **Verify Jest is installed:**
   ```bash
   cd frontend
   ls node_modules/.bin/jest
   ```

4. **If still not working, try:**
   ```bash
   cd frontend
   npm install --save-dev jest jest-environment-jsdom
   ```

### Alternative: Use npm run test directly

The debug configuration uses `npm run test` which should automatically use the local jest from `node_modules/.bin/jest`. If this doesn't work, ensure:
- Dependencies are installed (`npm install`)
- The `test` script in `package.json` is correct
- Node modules are in the correct location

## Python Debugger Issues

### "Python interpreter not found"

1. **Select Python interpreter:**
   - Press `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`)
   - Type: "Python: Select Interpreter"
   - Choose: `./backend/.venv/bin/python` (Linux/Mac) or `./backend/.venv/Scripts/python.exe` (Windows)

2. **Install debugpy:**
   ```bash
   cd backend
   uv add --dev debugpy
   ```

3. **Verify virtual environment:**
   ```bash
   cd backend
   ls .venv/bin/python  # Linux/Mac
   ls .venv/Scripts/python.exe  # Windows
   ```

## Database Connection Issues

### "Cannot connect to database"

1. **Start PostgreSQL:**
   - Press `Ctrl+Shift+P`
   - Type: "Tasks: Run Task"
   - Select: "Start PostgreSQL (Docker)"

2. **Wait for database to be ready:**
   ```bash
   docker-compose -f docker-compose.dev.yml ps
   ```

3. **Check connection string in `.env`:**
   ```
   DATABASE_URL=postgresql://expense_user:expense_password@localhost:5432/expense_settlement
   ```

## Port Already in Use

### "Port 8000/3000/5432 already in use"

1. **Find process using port:**
   ```bash
   # Linux/Mac
   lsof -i :8000
   
   # Windows
   netstat -ano | findstr :8000
   ```

2. **Kill the process or change port in launch.json**

## Node.js Version Issues

### "Unsupported Node.js version"

- Ensure Node.js 18+ is installed
- Check version: `node --version`
- Use nvm to switch versions if needed

## General Tips

1. **Always install dependencies before debugging:**
   - Backend: `cd backend && uv sync`
   - Frontend: `cd frontend && npm install`
   - Client Library: `cd client-library && npm install`

2. **Check VS Code output:**
   - View → Output → Select "Debug Console" or "Tasks"

3. **Restart VS Code** if configurations don't work

4. **Check file paths** - ensure you're in the project root







