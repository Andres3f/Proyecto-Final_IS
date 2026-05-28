from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Auth App"
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    DATABASE_USER: str = Field("postgres", env="DATABASE_USER")
    DATABASE_PASSWORD: str = Field("postgres", env="DATABASE_PASSWORD")
    DATABASE_HOST: str = Field("db", env="DATABASE_HOST")
    DATABASE_PORT: int = Field(5432, env="DATABASE_PORT")
    DATABASE_NAME: str = Field("fastapi_db", env="DATABASE_NAME")
    API_V1_STR: str = Field("/api/v1", env="API_V1_STR")

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}"
            f"@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"
        )

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
