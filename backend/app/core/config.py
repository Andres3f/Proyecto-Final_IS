from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from pydantic import Field


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
        case_sensitive=True,
    )

    PROJECT_NAME: str = "TaskFlow"

    # Auth
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Database
    # Use Render-managed DATABASE_URL when available. Otherwise use local Docker Compose defaults.
    DATABASE_URL: str | None = Field(None, env="DATABASE_URL")
    DATABASE_USER: str = Field("postgres", env="DATABASE_USER")
    DATABASE_PASSWORD: str = Field("postgres", env="DATABASE_PASSWORD")
    DATABASE_HOST: str = Field("db", env="DATABASE_HOST")
    DATABASE_PORT: int = Field(5432, env="DATABASE_PORT")
    DATABASE_NAME: str = Field("fastapi_db", env="DATABASE_NAME")

    # API
    API_V1_STR: str = Field("/api/v1", env="API_V1_STR")

    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL and self.DATABASE_URL.strip():
            return self.DATABASE_URL.strip()
        
        return (
            f"postgresql+psycopg2://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# Instancia global
settings = get_settings()