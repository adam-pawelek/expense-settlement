import { renderHook, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api-client";
import React from "react";

// Mock the API client
jest.mock("@/lib/api-client", () => ({
  apiClient: {
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    signup: jest.fn(),
    clearToken: jest.fn(),
    setToken: jest.fn(),
  },
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should provide auth context", () => {
    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(false);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should handle login", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
    };

    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(false);
    (apiClient.login as jest.Mock).mockResolvedValue({
      access_token: "token",
      token_type: "bearer",
    });
    (apiClient.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.login("test@example.com", "password");

    await waitFor(() => {
      expect(apiClient.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
    });
  });

  it("should handle signup", async () => {
    const mockUser = {
      id: 1,
      email: "new@example.com",
      username: "newuser",
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
    };

    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(false);
    (apiClient.signup as jest.Mock).mockResolvedValue(mockUser);
    (apiClient.login as jest.Mock).mockResolvedValue({
      access_token: "token",
      token_type: "bearer",
    });
    (apiClient.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.signup(
      "new@example.com",
      "newuser",
      "password123"
    );

    await waitFor(() => {
      expect(apiClient.signup).toHaveBeenCalledWith({
        email: "new@example.com",
        username: "newuser",
        password: "password123",
        full_name: undefined,
      });
    });
  });

  it("should handle logout", () => {
    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(true);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.logout();

    expect(apiClient.clearToken).toHaveBeenCalled();
  });
});

