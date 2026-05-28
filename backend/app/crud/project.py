from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate


def get_project_by_id(db: Session, project_id: int) -> Project | None:
    return db.query(Project).filter(Project.id == project_id).first()


def get_projects_by_owner(db: Session, owner_id: int) -> list[Project]:
    return db.query(Project).filter(Project.owner_id == owner_id).all()


def create_project(db: Session, project_in: ProjectCreate, owner_id: int) -> Project:
    project = Project(
        name=project_in.name,
        description=project_in.description,
        owner_id=owner_id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
