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

    # ==================== VARIABLES PRINCIPALES ====================
    PROJECT_NAME: str = "TaskFlow"

    # Auth
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Base de Datos - Prioridad a DATABASE_URL (importante para Render)
    DATABASE_URL: str | None = Field(None, env="DATABASE_URL")

    # Variables para fallback local (Docker Compose)
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
        """Prioriza DATABASE_URL (para Render)"""
        if self.DATABASE_URL and self.DATABASE_URL.strip():
            return self.DATABASE_URL.strip()
        
        # Fallback para desarrollo local con Docker Compose
        return (
            f"postgresql+psycopg2://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )


@lru_cache()
def get_settings() -> Settings:
    """Usar esta función para obtener settings en toda la aplicación"""
    return Settings()


# Instancia global
settings = get_settings()