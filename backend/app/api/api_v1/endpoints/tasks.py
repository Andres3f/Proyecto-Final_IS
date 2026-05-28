from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app import crud
from app.schemas.task import Task, TaskStatusUpdate

router = APIRouter(tags=["Tasks"])


@router.patch("/{task_id}/status", response_model=Task)
def update_task_status(task_id: int, status_in: TaskStatusUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    task = crud.task.get_task_by_id(db, task_id=task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.responsible_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the responsible user can update task status")
    return crud.task.update_task_status(db, task=task, status=status_in.status)
