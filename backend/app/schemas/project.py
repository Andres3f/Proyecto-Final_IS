from typing import Optional
from pydantic import BaseModel


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class Project(ProjectBase):
    id: int
    owner_id: int

    model_config = {"from_attributes": True}
