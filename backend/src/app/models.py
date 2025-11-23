"""Database models."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    """User model."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    groups = relationship("GroupMember", back_populates="user", cascade="all, delete-orphan")
    expenses_paid = relationship("Expense", back_populates="paid_by_user", foreign_keys="Expense.paid_by_user_id")


class Group(Base):
    """Group model."""
    __tablename__ = "groups"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    members = relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="group", cascade="all, delete-orphan")
    creator = relationship("User", foreign_keys=[created_by_user_id])


class GroupMember(Base):
    """Group membership model."""
    __tablename__ = "group_members"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    group = relationship("Group", back_populates="members")
    user = relationship("User", back_populates="groups")
    
    __table_args__ = ({"sqlite_autoincrement": True},)


class Expense(Base):
    """Expense model."""
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    paid_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    expense_metadata = Column(String, nullable=True)  # JSON string for additional metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    group = relationship("Group", back_populates="expenses")
    paid_by_user = relationship("User", back_populates="expenses_paid", foreign_keys=[paid_by_user_id])

