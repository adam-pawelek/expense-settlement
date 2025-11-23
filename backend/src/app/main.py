"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import auth, users, groups, expenses

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title="Expense Settlement API",
    description="API for managing split expenses between members of a group",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(users.router, prefix=settings.api_v1_prefix)
app.include_router(groups.router, prefix=settings.api_v1_prefix)
app.include_router(expenses.router, prefix=settings.api_v1_prefix)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Expense Settlement API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

