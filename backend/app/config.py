import os
from functools import lru_cache
from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "Propalyze API"
    environment: str = os.getenv("ENVIRONMENT", "development")
    backend_cors_origins: list[str] = [
        os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
    ]

    database_url: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./propalyze.db",
    )

    secret_key: str = os.getenv(
        "SECRET_KEY",
        "CHANGE_ME_SUPER_SECRET_KEY",  # override in production
    )
    algorithm: str = "HS256"
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    )

    stripe_secret_key: str | None = os.getenv("STRIPE_SECRET_KEY")
    stripe_publishable_key: str | None = os.getenv("STRIPE_PUBLISHABLE_KEY")
    stripe_price_id: str | None = os.getenv("STRIPE_PRICE_ID")


@lru_cache
def get_settings() -> Settings:
    return Settings()


