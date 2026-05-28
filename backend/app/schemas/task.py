from typing import Literal, Optional
from pydantic import BaseModel

TaskStatusType = Literal["pending", "in_progress", "completed"]


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatusType] = None


class TaskStatusUpdate(BaseModel):
    status: TaskStatusType


class Task(TaskBase):
    id: int
    status: TaskStatusType
    project_id: int
    responsible_user_id: int

    model_config = {"from_attributes": True}
