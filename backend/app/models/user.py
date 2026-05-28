from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(length=255), unique=True, index=True, nullable=False)
    full_name = Column(String(length=255), nullable=True)
    hashed_password = Column(String(length=255), nullable=False)
    is_active = Column(Boolean, default=True)

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="responsible_user", cascade="all, delete-orphan")
