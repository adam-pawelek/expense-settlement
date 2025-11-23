"""Tests for expense management endpoints."""
import pytest
from fastapi import status


def test_create_expense(client, auth_headers, test_user, db):
    """Test creating an expense."""
    from app.models import Group, GroupMember

    # Create group and add user as member
    group = Group(name="Test Group", created_by_user_id=test_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    member = GroupMember(group_id=group.id, user_id=test_user.id)
    db.add(member)
    db.commit()

    response = client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "group_id": group.id,
            "paid_by_user_id": test_user.id,
            "amount": 100.50,
            "description": "Test expense",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["amount"] == 100.50
    assert data["description"] == "Test expense"
    assert data["group_id"] == group.id
    assert data["paid_by_user_id"] == test_user.id


def test_create_expense_not_member(client, auth_headers, db):
    """Test creating expense when not a group member."""
    from app.models import Group, User
    from app.auth import get_password_hash

    # Create another user and group
    other_user = User(
        email="other@example.com",
        username="otheruser",
        hashed_password=get_password_hash("password123"),
    )
    db.add(other_user)
    db.commit()

    group = Group(name="Other Group", created_by_user_id=other_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    response = client.post(
        "/api/v1/expenses",
        headers=auth_headers,
        json={
            "group_id": group.id,
            "paid_by_user_id": other_user.id,
            "amount": 100.0,
        },
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_get_group_expenses(client, auth_headers, test_user, db):
    """Test getting expenses for a group."""
    from app.models import Group, GroupMember, Expense

    # Create group
    group = Group(name="Test Group", created_by_user_id=test_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    member = GroupMember(group_id=group.id, user_id=test_user.id)
    db.add(member)
    db.commit()

    # Create expense
    expense = Expense(
        group_id=group.id,
        paid_by_user_id=test_user.id,
        amount=50.0,
        description="Test expense",
    )
    db.add(expense)
    db.commit()

    response = client.get(
        f"/api/v1/expenses/group/{group.id}",
        headers=auth_headers,
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1
    assert data[0]["amount"] == 50.0
    assert data[0]["description"] == "Test expense"


def test_get_group_balance_summary(client, auth_headers, test_user, db):
    """Test getting balance summary for a group."""
    from app.models import Group, GroupMember, Expense, User
    from app.auth import get_password_hash

    # Create group
    group = Group(name="Test Group", created_by_user_id=test_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    # Add two members
    member1 = GroupMember(group_id=group.id, user_id=test_user.id)
    db.add(member1)

    other_user = User(
        email="other@example.com",
        username="otheruser",
        hashed_password=get_password_hash("password123"),
    )
    db.add(other_user)
    db.commit()

    member2 = GroupMember(group_id=group.id, user_id=other_user.id)
    db.add(member2)
    db.commit()

    # Create expense paid by test_user
    expense = Expense(
        group_id=group.id,
        paid_by_user_id=test_user.id,
        amount=100.0,
        description="Test expense",
    )
    db.add(expense)
    db.commit()

    response = client.get(
        f"/api/v1/expenses/group/{group.id}/balance",
        headers=auth_headers,
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["group_id"] == group.id
    assert len(data["balances"]) == 2

    # Check balance calculations
    # test_user paid 100, so they should be owed 50 (100 - 50 share)
    # other_user should owe 50 (their share)
    test_user_balance = next(
        b for b in data["balances"] if b["user_id"] == test_user.id
    )
    other_user_balance = next(
        b for b in data["balances"] if b["user_id"] == other_user.id
    )

    assert test_user_balance["total_owed"] == 100.0
    assert test_user_balance["total_owes"] == 50.0
    assert test_user_balance["net_balance"] == 50.0

    assert other_user_balance["total_owed"] == 0.0
    assert other_user_balance["total_owes"] == 50.0
    assert other_user_balance["net_balance"] == -50.0

