from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app import crud
from app.schemas.task import Task, TaskStatusUpdate, TaskUpdate

router = APIRouter(tags=["Tasks"])


@router.patch("/{task_id}/status", response_model=Task)
def update_task_status(task_id: int, status_in: TaskStatusUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    task = crud.task.get_task_by_id(db, task_id=task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.responsible_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the responsible user can update task status")
    return crud.task.update_task_status(db, task=task, status=status_in.status)


@router.put("/{task_id}", response_model=Task)
def update_task(task_id: int, task_in: TaskUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    task = crud.task.get_task_by_id(db, task_id=task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.responsible_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the responsible user can update the task")
    return crud.task.update_task(db, task=task, task_in=task_in)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    task = crud.task.get_task_by_id(db, task_id=task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if task.responsible_user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the responsible user can delete the task")
    crud.task.delete_task(db, task_id=task_id)
