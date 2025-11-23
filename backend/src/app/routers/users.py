"""User management routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User
from app.schemas import UserResponse, UserBase
from app.auth import get_current_active_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user's profile."""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_my_profile(
    user_update: UserBase,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Update current user's profile."""
    # Check if username or email is being changed and if it's already taken
    if user_update.username != current_user.username:
        existing_user = db.query(User).filter(User.username == user_update.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
    
    if user_update.email != current_user.email:
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken"
            )
    
    # Update user
    current_user.username = user_update.username
    current_user.email = user_update.email
    current_user.full_name = user_update.full_name
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

