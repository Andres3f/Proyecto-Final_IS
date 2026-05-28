from sqlalchemy.orm import Session
from app.models.project_member import ProjectMember, ProjectInvitation
from app.models.user import User
from app.schemas.project_member import ProjectMemberCreate, ProjectInvitationCreate


def get_project_members(db: Session, project_id: int) -> list[ProjectMember]:
    return db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()


def get_project_member(db: Session, project_id: int, user_id: int) -> ProjectMember | None:
    return db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()


def add_project_member(db: Session, project_id: int, user_id: int, role: str = "member") -> ProjectMember:
    member = ProjectMember(project_id=project_id, user_id=user_id, role=role)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def remove_project_member(db: Session, project_id: int, user_id: int) -> bool:
    member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()
    if member:
        db.delete(member)
        db.commit()
        return True
    return False


def create_project_invitation(db: Session, project_id: int, invited_email: str, invited_by_user_id: int) -> ProjectInvitation:
    invitation = ProjectInvitation(
        project_id=project_id,
        invited_email=invited_email,
        invited_by_user_id=invited_by_user_id
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


def get_project_invitations(db: Session, project_id: int) -> list[ProjectInvitation]:
    return db.query(ProjectInvitation).filter(ProjectInvitation.project_id == project_id).all()


def get_pending_invitations_for_email(db: Session, email: str) -> list[ProjectInvitation]:
    return db.query(ProjectInvitation).filter(
        ProjectInvitation.invited_email == email,
        ProjectInvitation.is_accepted == False
    ).all()


def accept_invitation(db: Session, invitation_id: int, user_id: int) -> ProjectInvitation:
    invitation = db.query(ProjectInvitation).filter(ProjectInvitation.id == invitation_id).first()
    if invitation:
        invitation.is_accepted = True
        # Add user to project members
        member = ProjectMember(project_id=invitation.project_id, user_id=user_id, role="member")
        db.add(member)
        db.add(invitation)
        db.commit()
        db.refresh(invitation)
    return invitation


def delete_invitation(db: Session, invitation_id: int) -> bool:
    invitation = db.query(ProjectInvitation).filter(ProjectInvitation.id == invitation_id).first()
    if invitation:
        db.delete(invitation)
        db.commit()
        return True
    return False
