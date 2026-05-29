from typing import Optional
from pydantic import BaseModel, EmailStr, validator


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str

    @validator("password")
    def password_strength(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        return value


class User(UserBase):
    id: int
    is_active: bool

    model_config = {"from_attributes": True}
