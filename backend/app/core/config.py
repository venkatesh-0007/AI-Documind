import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocuMind AI Backend"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Optional GitHub Token to increase rate limits (60/hr -> 5000/hr)
    GITHUB_TOKEN: str | None = os.getenv("GITHUB_TOKEN")
    
    # LLM Integration
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
    GEMINI_API_KEY: str | None = os.getenv("GEMINI_API_KEY")
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://documind-ai-generater.vercel.app",
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
