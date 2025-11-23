"""Expense management routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from collections import defaultdict

from app.database import get_db
from app.models import Expense, Group, GroupMember, User
from app.schemas import (
    ExpenseCreate,
    ExpenseResponse,
    BalanceSummary,
    GroupBalanceSummary,
    UserResponse,
)
from app.auth import get_current_active_user

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Add an expense for a group."""
    # Check if group exists
    group = db.query(Group).filter(Group.id == expense.group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if current user is a member of the group
    member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == expense.group_id,
            GroupMember.user_id == current_user.id
        )
        .first()
    )
    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be a member of the group to add expenses"
        )
    
    # Check if paying user is a member of the group
    paying_member = (
        db.query(GroupMember)
        .filter(
            GroupMember.group_id == expense.group_id,
            GroupMember.user_id == expense.paid_by_user_id
        )
        .first()
    )
    if not paying_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paying user must be a member of the group"
        )
    
    # Create expense
    db_expense = Expense(
        group_id=expense.group_id,
        paid_by_user_id=expense.paid_by_user_id,
        amount=expense.amount,
        description=expense.description,
        expense_metadata=expense.expense_metadata,
    )
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    # Manually construct response to avoid SQLAlchemy metadata conflict
    return ExpenseResponse(
        id=db_expense.id,
        group_id=db_expense.group_id,
        paid_by_user_id=db_expense.paid_by_user_id,
        amount=db_expense.amount,
        description=db_expense.description,
        metadata=db_expense.expense_metadata,  # Map expense_metadata to metadata
        created_at=db_expense.created_at,
        paid_by_user=db_expense.paid_by_user,
    )


@router.get("/group/{group_id}", response_model=List[ExpenseResponse])
def get_group_expenses(
    group_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """View expense history for a group."""
    # Check if group exists
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if current user is a member
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
            detail="You must be a member of the group to view expenses"
        )
    
    # Get all expenses for the group
    expenses = (
        db.query(Expense)
        .filter(Expense.group_id == group_id)
        .order_by(Expense.created_at.desc())
        .all()
    )
    # Manually construct responses to avoid SQLAlchemy metadata conflict
    return [
        ExpenseResponse(
            id=exp.id,
            group_id=exp.group_id,
            paid_by_user_id=exp.paid_by_user_id,
            amount=exp.amount,
            description=exp.description,
            metadata=exp.expense_metadata,  # Map expense_metadata to metadata
            created_at=exp.created_at,
            paid_by_user=exp.paid_by_user,
        )
        for exp in expenses
    ]


@router.get("/group/{group_id}/balance", response_model=GroupBalanceSummary)
def get_group_balance_summary(
    group_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Summarize balance by amount owed to members (assuming equal share in each expense)."""
    # Check if group exists
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if current user is a member
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
            detail="You must be a member of the group to view balance summary"
        )
    
    # Get all members of the group
    members = (
        db.query(GroupMember)
        .filter(GroupMember.group_id == group_id)
        .all()
    )
    member_ids = [m.user_id for m in members]
    
    # Get all expenses for the group
    expenses = (
        db.query(Expense)
        .filter(Expense.group_id == group_id)
        .all()
    )
    
    # Calculate balances
    # For each expense, split equally among all members
    # Track: how much each user paid, how much each user owes
    paid_amounts = defaultdict(float)  # user_id -> total paid
    owed_amounts = defaultdict(float)  # user_id -> total owed (their share)
    
    for expense in expenses:
        paid_amounts[expense.paid_by_user_id] += expense.amount
        share_per_person = expense.amount / len(member_ids)
        for member_id in member_ids:
            owed_amounts[member_id] += share_per_person
    
    # Calculate net balance for each user
    balances = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        total_owed = paid_amounts[member.user_id]  # Amount they paid
        total_owes = owed_amounts[member.user_id]  # Amount they owe
        net_balance = total_owed - total_owes  # Positive = others owe them, negative = they owe others
        
        balance = BalanceSummary(
            user_id=member.user_id,
            user=user,
            total_owed=round(total_owed, 2),
            total_owes=round(total_owes, 2),
            net_balance=round(net_balance, 2),
        )
        balances.append(balance)
    
    return GroupBalanceSummary(
        group_id=group_id,
        group=group,
        balances=balances,
    )

