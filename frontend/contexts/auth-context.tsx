"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { UserResponse } from "@expense-settlement/client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    if (apiClient.isAuthenticated()) {
      refreshUser().catch(() => {
        // If refresh fails, user is not authenticated
        apiClient.clearToken();
      });
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch {
      setUser(null);
      apiClient.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await apiClient.login({ email, password });
    await refreshUser();
  };

  const signup = async (
    email: string,
    username: string,
    password: string,
    fullName?: string
  ) => {
    await apiClient.signup({
      email,
      username,
      password,
      full_name: fullName || null,
    });
    // Auto-login after signup
    await login(email, password);
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

