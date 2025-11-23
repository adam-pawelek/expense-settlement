/**
 * Main client class for interacting with the Expense Settlement API
 */

import {
  UserCreate,
  UserLogin,
  UserResponse,
  UserBase,
  Token,
  GroupCreate,
  GroupResponse,
  GroupWithMembers,
  AddMemberRequest,
  GroupMemberResponse,
  ExpenseCreate,
  ExpenseResponse,
  GroupBalanceSummary,
  ClientConfig,
  TokenStorage,
} from "./types";
import {
  ApiError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "./errors";
import { createDefaultTokenStorage } from "./token-storage";

export class ExpenseSettlementClient {
  private baseUrl: string;
  private apiPrefix: string;
  private tokenStorage: TokenStorage;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.apiPrefix = config.apiPrefix || "/api/v1";
    this.tokenStorage = config.tokenStorage || createDefaultTokenStorage();
  }

  /**
   * Get the current access token
   */
  getToken(): string | null {
    return this.tokenStorage.getToken();
  }

  /**
   * Set the access token manually
   */
  setToken(token: string): void {
    this.tokenStorage.setToken(token);
  }

  /**
   * Clear the stored token
   */
  clearToken(): void {
    this.tokenStorage.clearToken();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Make an HTTP request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${this.apiPrefix}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: headers as HeadersInit,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    let data: any;
    if (isJson) {
      data = await response.json().catch(() => ({}));
    } else {
      data = await response.text().catch(() => "");
    }

    if (!response.ok) {
      const errorDetail = isJson && data.detail ? data.detail : response.statusText;
      
      switch (response.status) {
        case 401:
          this.clearToken(); // Clear invalid token
          throw new AuthenticationError("Authentication failed", errorDetail);
        case 403:
          throw new ForbiddenError("Access forbidden", errorDetail);
        case 404:
          throw new NotFoundError("Resource not found", errorDetail);
        case 400:
          throw new ValidationError("Validation error", errorDetail);
        default:
          throw new ApiError(
            `API request failed: ${response.statusText}`,
            response.status,
            errorDetail
          );
      }
    }

    return data as T;
  }

  // ==================== Authentication Methods ====================

  /**
   * Sign up a new user
   */
  async signup(userData: UserCreate): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Login with email and password
   * Automatically stores the access token
   */
  async login(credentials: UserLogin): Promise<Token> {
    const token = await this.request<Token>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    this.setToken(token.access_token);
    return token;
  }

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/me");
  }

  // ==================== User Management Methods ====================

  /**
   * Get current user's profile
   */
  async getMyProfile(): Promise<UserResponse> {
    return this.request<UserResponse>("/users/me");
  }

  /**
   * Update current user's profile
   */
  async updateMyProfile(userData: UserBase): Promise<UserResponse> {
    return this.request<UserResponse>("/users/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Get user by ID
   */
  async getUser(userId: number): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${userId}`);
  }

  // ==================== Group Management Methods ====================

  /**
   * Create a new group
   */
  async createGroup(groupData: GroupCreate): Promise<GroupResponse> {
    return this.request<GroupResponse>("/groups", {
      method: "POST",
      body: JSON.stringify(groupData),
    });
  }

  /**
   * Get all groups the current user is a member of
   */
  async getMyGroups(): Promise<GroupWithMembers[]> {
    return this.request<GroupWithMembers[]>("/groups");
  }

  /**
   * Get a specific group by ID
   */
  async getGroup(groupId: number): Promise<GroupWithMembers> {
    return this.request<GroupWithMembers>(`/groups/${groupId}`);
  }

  /**
   * Add a user to a group as a member
   */
  async addMemberToGroup(
    groupId: number,
    request: AddMemberRequest
  ): Promise<GroupMemberResponse> {
    return this.request<GroupMemberResponse>(`/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // ==================== Expense Management Methods ====================

  /**
   * Add an expense for a group
   */
  async createExpense(expenseData: ExpenseCreate): Promise<ExpenseResponse> {
    return this.request<ExpenseResponse>("/expenses", {
      method: "POST",
      body: JSON.stringify(expenseData),
    });
  }

  /**
   * View expense history for a group
   */
  async getGroupExpenses(groupId: number): Promise<ExpenseResponse[]> {
    return this.request<ExpenseResponse[]>(`/expenses/group/${groupId}`);
  }

  /**
   * Get balance summary for a group
   * Summarizes balance by amount owed to members (assuming equal share in each expense)
   */
  async getGroupBalanceSummary(
    groupId: number
  ): Promise<GroupBalanceSummary> {
    return this.request<GroupBalanceSummary>(
      `/expenses/group/${groupId}/balance`
    );
  }
}

