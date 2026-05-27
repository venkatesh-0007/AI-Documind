import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DocuMind AI Backend"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Optional GitHub Token to increase rate limits (60/hr -> 5000/hr)
    GITHUB_TOKEN: str | None = os.getenv("GITHUB_TOKEN")
    GITHUB_CLIENT_ID: str | None = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET: str | None = os.getenv("GITHUB_CLIENT_SECRET")
    GITHUB_OAUTH_REDIRECT_URI: str | None = os.getenv("GITHUB_OAUTH_REDIRECT_URI")
    BACKEND_PUBLIC_URL: str = os.getenv("BACKEND_PUBLIC_URL", "http://localhost:8000")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    SESSION_SECRET: str = os.getenv("SESSION_SECRET", "change-me-in-production")
    SESSION_COOKIE_NAME: str = os.getenv("SESSION_COOKIE_NAME", "documind_session")
    OAUTH_STATE_COOKIE_NAME: str = os.getenv("OAUTH_STATE_COOKIE_NAME", "documind_oauth_state")
    COOKIE_SECURE: bool = os.getenv("COOKIE_SECURE", "false").lower() == "true"
    COOKIE_SAMESITE: str = os.getenv("COOKIE_SAMESITE", "lax")
    
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
