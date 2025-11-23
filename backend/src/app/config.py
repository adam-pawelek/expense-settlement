"""Configuration settings for the application."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # Database
    database_url: str = "sqlite:///./expense_settlement.db"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API
    api_v1_prefix: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

