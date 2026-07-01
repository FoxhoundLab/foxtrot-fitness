"""Application configuration loaded from environment variables."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://foxtrot:foxtrot_dev@localhost:5432/foxtrot"

    # Supabase
    supabase_url: str = ""
    supabase_service_key: str = ""

    # Email
    resend_api_key: str = ""

    # Auth
    jwt_secret: str = "change_me_in_prod"
    app_url: str = "http://localhost:3000"

    # LLM
    llm_api_key: str = ""
    llm_api_url: str = "https://openrouter.ai/api/v1/chat/completions"
    llm_model: str = "anthropic/claude-sonnet-4"

    # App
    env: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()