"""Tests for authentication endpoints."""
import pytest
from fastapi import status


def test_signup_success(client):
    """Test successful user signup."""
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "password123",
            "full_name": "New User",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["username"] == "newuser"
    assert data["full_name"] == "New User"
    assert "id" in data
    assert "password" not in data


def test_signup_duplicate_email(client, test_user):
    """Test signup with duplicate email."""
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "test@example.com",
            "username": "differentuser",
            "password": "password123",
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_signup_duplicate_username(client, test_user):
    """Test signup with duplicate username."""
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "different@example.com",
            "username": "testuser",
            "password": "password123",
        },
    )
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_signup_invalid_password(client):
    """Test signup with invalid password (too short)."""
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "email": "user@example.com",
            "username": "user",
            "password": "short",
        },
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_success(client, test_user):
    """Test successful login."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpassword123"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_email(client):
    """Test login with invalid email."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "password123"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_invalid_password(client, test_user):
    """Test login with invalid password."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_current_user(client, auth_headers):
    """Test getting current user info."""
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["username"] == "testuser"


def test_get_current_user_unauthorized(client):
    """Test getting current user without authentication."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

