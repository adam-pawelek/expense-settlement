"""Wait for database to be ready before starting the application."""
import time
import sys
from sqlalchemy import create_engine, text
from app.config import settings

def wait_for_db(max_retries=30, retry_interval=2):
    """Wait for database to be ready."""
    for i in range(max_retries):
        try:
            engine = create_engine(settings.database_url)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("✓ Database is ready!")
            return True
        except Exception as e:
            if i == 0:
                print(f"Waiting for database to be ready...")
            print(f"  Attempt {i+1}/{max_retries}: {str(e)}")
            if i < max_retries - 1:
                time.sleep(retry_interval)
    print("✗ Database is not ready after maximum retries")
    return False

if __name__ == "__main__":
    if not wait_for_db():
        sys.exit(1)

