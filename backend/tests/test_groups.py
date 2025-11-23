"""Tests for group management endpoints."""
import pytest
from fastapi import status


def test_create_group(client, auth_headers):
    """Test creating a new group."""
    response = client.post(
        "/api/v1/groups",
        headers=auth_headers,
        json={
            "name": "Test Group",
            "description": "A test group",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == "Test Group"
    assert data["description"] == "A test group"
    assert "id" in data
    assert "created_by_user_id" in data


def test_create_group_unauthorized(client):
    """Test creating group without authentication."""
    response = client.post(
        "/api/v1/groups",
        json={"name": "Test Group"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_my_groups(client, auth_headers, test_user, db):
    """Test getting user's groups."""
    from app.models import Group, GroupMember

    # Create a group
    group = Group(name="My Group", created_by_user_id=test_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    # Add user as member
    member = GroupMember(group_id=group.id, user_id=test_user.id)
    db.add(member)
    db.commit()

    response = client.get("/api/v1/groups", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "My Group"
    assert len(data[0]["members"]) == 1


def test_get_group_by_id(client, auth_headers, test_user, db):
    """Test getting a specific group."""
    from app.models import Group, GroupMember

    group = Group(name="Test Group", created_by_user_id=test_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    member = GroupMember(group_id=group.id, user_id=test_user.id)
    db.add(member)
    db.commit()

    response = client.get(f"/api/v1/groups/{group.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "Test Group"
    assert len(data["members"]) == 1


def test_get_group_not_member(client, auth_headers, db):
    """Test getting group when not a member."""
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

    response = client.get(f"/api/v1/groups/{group.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_add_member_by_email(client, auth_headers, test_user, db):
    """Test adding a member to a group by email."""
    from app.models import Group, GroupMember, User
    from app.auth import get_password_hash

    # Create group
    group = Group(name="Test Group", created_by_user_id=test_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    # Add creator as member
    member = GroupMember(group_id=group.id, user_id=test_user.id)
    db.add(member)
    db.commit()

    # Create another user
    other_user = User(
        email="member@example.com",
        username="member",
        hashed_password=get_password_hash("password123"),
    )
    db.add(other_user)
    db.commit()

    # Add member by email
    response = client.post(
        f"/api/v1/groups/{group.id}/members",
        headers=auth_headers,
        json={"email": "member@example.com"},
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["user_id"] == other_user.id
    assert data["group_id"] == group.id


def test_add_member_user_not_found(client, auth_headers, test_user, db):
    """Test adding member with non-existent email."""
    from app.models import Group, GroupMember

    group = Group(name="Test Group", created_by_user_id=test_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    member = GroupMember(group_id=group.id, user_id=test_user.id)
    db.add(member)
    db.commit()

    response = client.post(
        f"/api/v1/groups/{group.id}/members",
        headers=auth_headers,
        json={"email": "nonexistent@example.com"},
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_add_member_already_member(client, auth_headers, test_user, db):
    """Test adding a member who is already in the group."""
    from app.models import Group, GroupMember

    group = Group(name="Test Group", created_by_user_id=test_user.id)
    db.add(group)
    db.commit()
    db.refresh(group)

    member = GroupMember(group_id=group.id, user_id=test_user.id)
    db.add(member)
    db.commit()

    # Try to add the same user again
    response = client.post(
        f"/api/v1/groups/{group.id}/members",
        headers=auth_headers,
        json={"email": "test@example.com"},
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST

