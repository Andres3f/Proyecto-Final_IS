from typing import Optional, Literal
from datetime import datetime
from pydantic import BaseModel


MemberRoleType = Literal["admin", "member"]


class ProjectMemberBase(BaseModel):
    role: Optional[MemberRoleType] = "member"


class ProjectMemberCreate(BaseModel):
    user_id: int
    role: Optional[MemberRoleType] = "member"


class ProjectMember(ProjectMemberBase):
    id: int
    project_id: int
    user_id: int
    joined_at: datetime

    model_config = {"from_attributes": True}


class ProjectInvitationBase(BaseModel):
    invited_email: str


class ProjectInvitationCreate(ProjectInvitationBase):
    pass


class ProjectInvitation(ProjectInvitationBase):
    id: int
    project_id: int
    invited_by_user_id: int
    created_at: datetime
    is_accepted: bool

    model_config = {"from_attributes": True}


class ProjectInviteRequest(BaseModel):
    email: str
