from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import User

router = APIRouter(tags=["Users"])


@router.get("/me", response_model=User)
def read_current_user(current_user: User = Depends(deps.get_current_active_user)):
    return current_user
