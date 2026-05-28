from enum import Enum
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(length=255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(length=50), nullable=False, default=TaskStatus.PENDING.value)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    responsible_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    project = relationship("Project", back_populates="tasks")
    responsible_user = relationship("User", back_populates="tasks")
