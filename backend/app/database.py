from urllib.parse import urlparse

from sqlalchemy import create_engine
from sqlalchemy.exc import ArgumentError
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings


def _should_require_ssl(database_url: str) -> bool:
    parsed = urlparse(database_url)
    if parsed.hostname is None:
        return False
    return parsed.hostname not in {"localhost", "127.0.0.1", "db"}


def _get_connect_args(database_url: str) -> dict[str, str]:
    if settings.DATABASE_URL and _should_require_ssl(database_url) and "sslmode=" not in database_url:
        return {"sslmode": "require"}
    return {}


try:
    database_url = settings.database_url
    if not database_url:
        raise ValueError(
            "Database configuration is missing. Set DATABASE_URL or DATABASE_HOST/DATABASE_NAME."
        )

    engine = create_engine(
        database_url,
        future=True,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args=_get_connect_args(database_url),
    )
except (ArgumentError, ValueError) as exc:
    raise RuntimeError(
        "Unable to create the database engine. Check DATABASE_URL or local database settings."
    ) from exc

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
