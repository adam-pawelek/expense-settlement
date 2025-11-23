/**
 * Default token storage implementation using localStorage (browser) or memory (Node.js)
 */

import { TokenStorage } from "./types";

class MemoryTokenStorage implements TokenStorage {
  private token: string | null = null;

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }
}

class LocalStorageTokenStorage implements TokenStorage {
  private readonly TOKEN_KEY = "expense_settlement_token";

  getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  setToken(token: string): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch {
      // Ignore localStorage errors
    }
  }

  clearToken(): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch {
      // Ignore localStorage errors
    }
  }
}

/**
 * Creates an appropriate token storage based on the environment
 */
export function createDefaultTokenStorage(): TokenStorage {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    return new LocalStorageTokenStorage();
  }
  return new MemoryTokenStorage();
}

