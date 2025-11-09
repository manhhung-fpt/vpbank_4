"""
Configuration settings for the application
"""
from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # OpenAI
    OPENAI_API_KEY: str = ""
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./credit_scoring.db"
    
    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            if field_name == 'CORS_ORIGINS':
                return json.loads(raw_val)
            return raw_val


settings = Settings()
