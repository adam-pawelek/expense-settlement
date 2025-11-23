"""Pydantic schemas for request/response validation."""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# User Schemas
class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """Schema for user creation."""
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """Schema for user response."""
    id: int
    is_active: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Token data schema."""
    username: Optional[str] = None


# Group Schemas
class GroupBase(BaseModel):
    """Base group schema."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None


class GroupCreate(GroupBase):
    """Schema for group creation."""
    pass


class GroupResponse(GroupBase):
    """Schema for group response."""
    id: int
    created_by_user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class GroupMemberResponse(BaseModel):
    """Schema for group member response."""
    id: int
    group_id: int
    user_id: int
    joined_at: datetime
    user: UserResponse
    
    model_config = ConfigDict(from_attributes=True)


class GroupWithMembers(GroupResponse):
    """Schema for group with members."""
    members: List[GroupMemberResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


class AddMemberRequest(BaseModel):
    """Schema for adding a member to a group."""
    email: EmailStr


# Expense Schemas
class ExpenseBase(BaseModel):
    """Base expense schema."""
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    expense_metadata: Optional[str] = Field(None, alias="metadata")  # Accept "metadata" in API
    
    model_config = ConfigDict(populate_by_name=True)  # Allow both field name and alias


class ExpenseCreate(ExpenseBase):
    """Schema for expense creation."""
    group_id: int
    paid_by_user_id: int
    amount: float
    description: Optional[str] = None
    expense_metadata: Optional[str] = Field(None, alias="metadata")  # Accept "metadata" in API

    

class ExpenseResponse(BaseModel):
    """Schema for expense response."""
    id: int
    group_id: int
    paid_by_user_id: int
    amount: float
    description: Optional[str] = None
    metadata: Optional[str] = None  # This will be populated from expense_metadata
    created_at: datetime
    paid_by_user: UserResponse
    
    model_config = ConfigDict(from_attributes=True)


# Balance Summary Schemas
class BalanceSummary(BaseModel):
    """Schema for balance summary."""
    user_id: int
    user: UserResponse
    total_owed: float
    total_owes: float
    net_balance: float  # positive = owed to user, negative = user owes


class GroupBalanceSummary(BaseModel):
    """Schema for group balance summary."""
    group_id: int
    group: GroupResponse
    balances: List[BalanceSummary]

