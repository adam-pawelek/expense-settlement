# Expense Settlement App

A comprehensive full-stack application for managing group expenses and settlements. This project consists of a FastAPI backend, a Next.js frontend, and a shared TypeScript client library.

## Project Structure

- **backend/**: FastAPI application (Python) handling API requests, database interactions, and authentication.
- **frontend/**: Next.js application (TypeScript/React) providing the user interface.
- **client-library/**: TypeScript client SDK generated/maintained for API interaction, shared between frontend and other clients.

## Prerequisites

- **Docker & Docker Compose**: For running the database and containerized application.
- **Node.js (v20+)**: For frontend and client library development.
- **Python (3.12+)**: For backend development.
- **uv**: Python package manager (recommended).
- **VS Code / Cursor**: Recommended IDE.

## 📦 Environment Setup

To run the project locally (especially for VS Code / Cursor debugging), you need to set up your environment.

### 1. Install Node.js (v20+)

**Linux / macOS (using nvm - recommended):**
```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Close and reopen terminal, then install Node.js v20
nvm install 20
nvm use 20
```

**Windows:**
- Download and install from [nodejs.org](https://nodejs.org/).
- Alternatively, use `nvm-windows`.

### 2. Install uv (Python Package Manager)

`uv` is used to manage Python dependencies and virtual environments.

**Linux / macOS:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows:**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 3. Install Dependencies

After installing Node.js and uv, install the project dependencies:

```bash
# Backend
cd backend
uv sync

# Client Library
cd ../client-library
npm install

# Frontend
cd ../frontend
npm install
```

---

## 🚀 Quick Start: VS Code / Cursor Debugging

The project is configured with VS Code launch configurations for a seamless debugging experience.

### 1. "Full Stack: Backend + Frontend"
This is the recommended mode for development. It runs the backend and frontend locally on your machine while running the database in Docker.

1. Open the **Run and Debug** view (`Ctrl+Shift+D` or `Cmd+Shift+D`).
2. Select **"Full Stack: Backend + Frontend"** (or the Windows variant if on Windows).
3. Press **F5** (Start Debugging).

**What happens:**
- A **PostgreSQL** database is automatically started in a Docker container (using `docker-compose.dev.yml`).
- The **Backend** starts on **http://localhost:8008**.
- The **Frontend** starts on **http://localhost:3003**.
- You can set breakpoints in both Python (backend) and TypeScript (frontend) code.

### 2. Other Debug Configurations
- **Backend: FastAPI (Python)**: Runs only the backend (starts DB automatically).
- **Frontend: Next.js**: Runs only the frontend (requires running backend).
- **All Tests**: Runs unit tests for Backend, Frontend, and Client Library.

---

## 🐳 Docker: Production Mode

To run the entire application stack (Frontend, Backend, Database, Adminer) in containers simulating a production environment.

**Command:**
```bash
docker compose -f docker-compose.prod.yml up --build
```

**Access:**
- **Frontend**: http://localhost:3004
- **Backend API**: http://localhost:8004
- **Adminer (DB GUI)**: http://localhost:8080

*Note: The ports in Docker Production mode (3004/8004) are different from VS Code Debug mode (3003/8008) to avoid conflicts if both are running.*

---

## 🛠 Docker: Development Mode (Database Only)

If you prefer to run the apps manually in your terminal but need the database and adminer running:

**Command:**
```bash
docker compose -f docker-compose.dev.yml up
```

This starts:
- **PostgreSQL**: Port 5432
- **Adminer**: Port 8080

You can then run the backend/frontend using your standard terminal commands (`uv run uvicorn...` / `npm run dev`).

---

## 🗄 Database Access (Adminer)

Adminer is a lightweight database management tool included in both Docker setups.

**URL**: http://localhost:8080

**Login Credentials:**
- **System**: `PostgreSQL`
- **Server**: `postgres`
- **Username**: `expense_user`
- **Password**: `expense_password`
- **Database**: `expense_settlement`

*Note: These credentials are defined in the `.env` files or `docker-compose` files and should be changed for actual production deployment.*

---

## 🧪 Testing

Detailed testing guides are available in each directory:
- **General Testing Guide**: [TESTING.md](./TESTING.md)
- **Backend Tests**: `backend/tests/README.md`
- **Frontend Tests**: `frontend/README_TESTS.md`
- **E2E Tests**: `frontend/README_E2E.md`

To run all tests via VS Code, select the **"All Tests"** configuration in the Debug view.
