"""
AI service configuration.
"""
from typing import Optional
from pydantic_settings import BaseSettings

class AIServiceSettings(BaseSettings):
    PERPLEXITY_API_KEY: str
    PERPLEXITY_MODEL: str = "sonar-medium-online"  # Default model
    MAX_TOKENS: int = 1024
    TEMPERATURE: float = 0.7
    TOP_P: float = 0.9
    
    model_config = {
        "env_file": ".env",
        "extra": "allow"  # Allow unknown fields
    }

ai_settings = AIServiceSettings()