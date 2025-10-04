"""
Configuration loading using pydantic-settings and python-dotenv.
"""
from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # API Config
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "FounderCRM"
    FRONTEND_URL: str = "http://localhost:3000"
    NODE_ENV: str = "development"
    
    # Security
    JWT_SECRET: str = "supersecret"  # Change in production
    JWT_EXPIRE: str = "7d"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 * 7  # 7 days
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./foundercrm.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179"
    ]
    
    # AI Service
    PERPLEXITY_API_KEY: str = ""  # Set this in .env file
    PERPLEXITY_MODEL: str = "sonar-medium-online"
    ENABLE_AI_FEATURES: bool = False  # Will be True only if PERPLEXITY_API_KEY is set
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@foundercrm.com"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

@lru_cache
def get_settings() -> Settings:
    """
    Get cached settings instance.
    """
    settings = Settings()
    
    # Enable AI features only if API key is set
    settings.ENABLE_AI_FEATURES = bool(settings.PERPLEXITY_API_KEY)
    
    # Validate database URL
    if not settings.DATABASE_URL:
        settings.DATABASE_URL = "sqlite:///./foundercrm.db"
        
    return settings

settings = get_settings()
