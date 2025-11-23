"""Group management routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Group, GroupMember, User
from app.schemas import (
    GroupCreate,
    GroupResponse,
    GroupWithMembers,
    GroupMemberResponse,
    AddMemberRequest,
)
from app.auth import get_current_active_user

router = APIRouter(prefix="/groups", tags=["groups"])


@router.post("", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
def create_group(
    group: GroupCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Create a new group."""
    db_group = Group(
        name=group.name,
        description=group.description,
        created_by_user_id=current_user.id,
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    
    # Add creator as a member
    member = GroupMember(group_id=db_group.id, user_id=current_user.id)
    db.add(member)
    db.commit()
    
    return db_group


@router.get("", response_model=List[GroupWithMembers])
def get_my_groups(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get all groups the current user is a member of."""
    groups = (
        db.query(Group)
        .join(GroupMember)
        .filter(GroupMember.user_id == current_user.id)
        .all()
    )
    return groups


@router.get("/{group_id}", response_model=GroupWithMembers)
def get_group(
    group_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get a specific group by ID."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if user is a member
    member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user.id
        )
        .first()
    )
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of this group"
        )
    
    return group


@router.post("/{group_id}/members", response_model=GroupMemberResponse, status_code=status.HTTP_201_CREATED)
def add_member_to_group(
    group_id: int,
    request: AddMemberRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Add a user to a group as a member."""
    # Check if group exists
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if current user is a member (required to add others)
    current_member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user.id
        )
        .first()
    )
    if not current_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be a member of the group to add members"
        )
    
    # Check if user exists by email
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_id = user.id
    
    # Check if user is already a member
    existing_member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        )
        .first()
    )
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a member of this group"
        )
    
    # Add member
    member = GroupMember(group_id=group_id, user_id=user_id)
    db.add(member)
    db.commit()
    db.refresh(member)
    
    # Load user relationship
    db.refresh(member.user)
    return member

