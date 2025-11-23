"""Database configuration and session management."""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

# Configure engine based on database type
if "sqlite" in settings.database_url:
    connect_args = {"check_same_thread": False}
    engine = create_engine(
        settings.database_url,
        connect_args=connect_args,
        echo=False,
    )
else:
    # PostgreSQL connection pool settings
    engine = create_engine(
        settings.database_url,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,  # Verify connections before using
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for getting database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)

