"""Tests for user management endpoints."""
import pytest
from fastapi import status


def test_get_my_profile(client, auth_headers):
    """Test getting current user's profile."""
    response = client.get("/api/v1/users/me", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"


def test_update_my_profile(client, auth_headers):
    """Test updating current user's profile."""
    response = client.put(
        "/api/v1/users/me",
        headers=auth_headers,
        json={
            "email": "updated@example.com",
            "username": "updateduser",
            "full_name": "Updated Name",
        },
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "updated@example.com"
    assert data["username"] == "updateduser"
    assert data["full_name"] == "Updated Name"


def test_update_profile_duplicate_username(client, auth_headers, db):
    """Test updating profile with duplicate username."""
    from app.models import User
    from app.auth import get_password_hash

    # Create another user
    other_user = User(
        email="other@example.com",
        username="otheruser",
        hashed_password=get_password_hash("password123"),
    )
    db.add(other_user)
    db.commit()

    response = client.put(
        "/api/v1/users/me",
        headers=auth_headers,
        json={
            "email": "test@example.com",
            "username": "otheruser",  # Duplicate
            "full_name": "Test",
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_get_user_by_id(client, auth_headers, test_user):
    """Test getting user by ID."""
    response = client.get(f"/api/v1/users/{test_user.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == "test@example.com"


def test_get_user_not_found(client, auth_headers):
    """Test getting non-existent user."""
    response = client.get("/api/v1/users/99999", headers=auth_headers)
    assert response.status_code == status.HTTP_404_NOT_FOUND

