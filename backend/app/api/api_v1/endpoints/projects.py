from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app import crud
from app.schemas.project import Project, ProjectCreate
from app.schemas.task import Task, TaskCreate

router = APIRouter(tags=["Projects"])


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(project_in: ProjectCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.project.create_project(db, project_in=project_in, owner_id=current_user.id)


@router.get("/", response_model=list[Project])
def read_projects(db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.project.get_projects_by_owner(db, owner_id=current_user.id)


@router.get("/{project_id}/tasks", response_model=list[Task])
def read_project_tasks(project_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    project = crud.project.get_project_by_id(db, project_id=project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return crud.task.get_tasks_by_project(db, project_id=project_id)


@router.post("/{project_id}/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_project_task(project_id: int, task_in: TaskCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    project = crud.project.get_project_by_id(db, project_id=project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return crud.task.create_task(db, task_in=task_in, project_id=project_id, responsible_user_id=current_user.id)
