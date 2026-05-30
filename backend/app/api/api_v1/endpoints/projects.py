from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app import crud
from app.schemas.project import Project, ProjectCreate, ProjectUpdate
from app.schemas.task import Task, TaskCreate
from app.schemas.project_member import ProjectMember, ProjectInviteRequest, ProjectInvitation

router = APIRouter(tags=["Projects"])


@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(project_in: ProjectCreate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.project.create_project(db, project_in=project_in, owner_id=current_user.id)


@router.get("/", response_model=list[Project])
def read_projects(db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    return crud.project.get_projects_by_owner(db, owner_id=current_user.id)


@router.put("/{project_id}", response_model=Project)
def update_project(project_id: int, project_in: ProjectUpdate, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    project = crud.project.get_project_by_id(db, project_id=project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if project_in.name is not None and not project_in.name.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Project name is required")
    return crud.project.update_project(db, project=project, project_in=project_in)


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


@router.get("/{project_id}/members", response_model=list[ProjectMember])
def get_project_members(project_id: int, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    project = crud.project.get_project_by_id(db, project_id=project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return crud.project_member.get_project_members(db, project_id=project_id)


@router.post("/{project_id}/invite", response_model=ProjectInvitation, status_code=status.HTTP_201_CREATED)
def invite_user_to_project(project_id: int, invite_in: ProjectInviteRequest, db: Session = Depends(deps.get_db), current_user=Depends(deps.get_current_active_user)):
    project = crud.project.get_project_by_id(db, project_id=project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the project owner can invite members")
    
    # Check if email is already a member
    user = crud.user.get_user_by_email(db, email=invite_in.email)
    if user:
        existing_member = crud.project_member.get_project_member(db, project_id=project_id, user_id=user.id)
        if existing_member:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already a member of this project")
    
    # Create invitation
    return crud.project_member.create_project_invitation(db, project_id=project_id, invited_email=invite_in.email, invited_by_user_id=current_user.id)
