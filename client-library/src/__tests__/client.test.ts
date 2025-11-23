import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ExpenseSettlementClient } from "../client";
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from "../errors";

// Mock fetch
globalThis.fetch = vi.fn() as any;

describe("ExpenseSettlementClient", () => {
  let client: ExpenseSettlementClient;
  const baseUrl = "http://localhost:8000";

  beforeEach(() => {
    client = new ExpenseSettlementClient({ baseUrl });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Authentication", () => {
    it("should login successfully", async () => {
      const mockResponse = {
        access_token: "test-token",
        token_type: "bearer",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual(mockResponse);
      expect(client.getToken()).toBe("test-token");
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${baseUrl}/api/v1/auth/login`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      );
    });

    it("should throw AuthenticationError on login failure", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ detail: "Invalid credentials" }),
        headers: new Headers({ "content-type": "application/json" }),
      });

      await expect(
        client.login({
          email: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow(AuthenticationError);
    });

    it("should signup successfully", async () => {
      const mockUser = {
        id: 1,
        email: "new@example.com",
        username: "newuser",
        full_name: "New User",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.signup({
        email: "new@example.com",
        username: "newuser",
        password: "password123",
        full_name: "New User",
      });

      expect(result).toEqual(mockUser);
    });

    it("should get current user", async () => {
      client.setToken("test-token");
      const mockUser = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.getCurrentUser();
      expect(result).toEqual(mockUser);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${baseUrl}/api/v1/auth/me`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        })
      );
    });
  });

  describe("User Management", () => {
    beforeEach(() => {
      client.setToken("test-token");
    });

    it("should get my profile", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.getMyProfile();
      expect(result).toEqual(mockUser);
    });

    it("should update my profile", async () => {
      const mockUser = {
        id: 1,
        email: "updated@example.com",
        username: "updateduser",
        full_name: "Updated Name",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.updateMyProfile({
        email: "updated@example.com",
        username: "updateduser",
        full_name: "Updated Name",
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe("Group Management", () => {
    beforeEach(() => {
      client.setToken("test-token");
    });

    it("should create a group", async () => {
      const mockGroup = {
        id: 1,
        name: "Test Group",
        description: "Test description",
        created_by_user_id: 1,
        created_at: "2024-01-01T00:00:00Z",
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGroup,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.createGroup({
        name: "Test Group",
        description: "Test description",
      });

      expect(result).toEqual(mockGroup);
    });

    it("should get my groups", async () => {
      const mockGroups = [
        {
          id: 1,
          name: "Group 1",
          created_by_user_id: 1,
          created_at: "2024-01-01T00:00:00Z",
          members: [],
        },
      ];

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockGroups,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.getMyGroups();
      expect(result).toEqual(mockGroups);
    });

    it("should add member to group by email", async () => {
      const mockMember = {
        id: 1,
        group_id: 1,
        user_id: 2,
        joined_at: "2024-01-01T00:00:00Z",
        user: {
          id: 2,
          email: "member@example.com",
          username: "member",
          is_active: true,
          created_at: "2024-01-01T00:00:00Z",
        },
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMember,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.addMemberToGroup(1, {
        email: "member@example.com",
      });

      expect(result).toEqual(mockMember);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${baseUrl}/api/v1/groups/1/members`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "member@example.com" }),
        })
      );
    });
  });

  describe("Expense Management", () => {
    beforeEach(() => {
      client.setToken("test-token");
    });

    it("should create an expense", async () => {
      const mockExpense = {
        id: 1,
        group_id: 1,
        paid_by_user_id: 1,
        amount: 100.5,
        description: "Test expense",
        created_at: "2024-01-01T00:00:00Z",
        paid_by_user: {
          id: 1,
          email: "test@example.com",
          username: "testuser",
          is_active: true,
          created_at: "2024-01-01T00:00:00Z",
        },
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockExpense,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.createExpense({
        group_id: 1,
        paid_by_user_id: 1,
        amount: 100.5,
        description: "Test expense",
      });

      expect(result).toEqual(mockExpense);
    });

    it("should get group expenses", async () => {
      const mockExpenses = [
        {
          id: 1,
          group_id: 1,
          paid_by_user_id: 1,
          amount: 100.0,
          created_at: "2024-01-01T00:00:00Z",
          paid_by_user: {
            id: 1,
            email: "test@example.com",
            username: "testuser",
            is_active: true,
            created_at: "2024-01-01T00:00:00Z",
          },
        },
      ];

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockExpenses,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.getGroupExpenses(1);
      expect(result).toEqual(mockExpenses);
    });

    it("should get group balance summary", async () => {
      const mockBalance = {
        group_id: 1,
        group: {
          id: 1,
          name: "Test Group",
          created_by_user_id: 1,
          created_at: "2024-01-01T00:00:00Z",
        },
        balances: [
          {
            user_id: 1,
            user: {
              id: 1,
              email: "test@example.com",
              username: "testuser",
              is_active: true,
              created_at: "2024-01-01T00:00:00Z",
            },
            total_owed: 100.0,
            total_owes: 50.0,
            net_balance: 50.0,
          },
        ],
      };

      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBalance,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await client.getGroupBalanceSummary(1);
      expect(result).toEqual(mockBalance);
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      client.setToken("test-token");
    });

    it("should throw NotFoundError for 404", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ detail: "Resource not found" }),
        headers: new Headers({ "content-type": "application/json" }),
      });

      await expect(client.getUser(999)).rejects.toThrow(NotFoundError);
    });

    it("should throw ValidationError for 400", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ detail: "Validation error" }),
        headers: new Headers({ "content-type": "application/json" }),
      });

      await expect(
        client.createGroup({ name: "" })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw ForbiddenError for 403", async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ detail: "Access forbidden" }),
        headers: new Headers({ "content-type": "application/json" }),
      });

      await expect(client.getGroup(999)).rejects.toThrow(ForbiddenError);
    });

    it("should clear token on 401", async () => {
      client.setToken("invalid-token");
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ detail: "Invalid token" }),
        headers: new Headers({ "content-type": "application/json" }),
      });

      await expect(client.getCurrentUser()).rejects.toThrow(AuthenticationError);
      expect(client.getToken()).toBeNull();
    });
  });

  describe("Token Management", () => {
    it("should set and get token", () => {
      expect(client.getToken()).toBeNull();
      client.setToken("test-token");
      expect(client.getToken()).toBe("test-token");
    });

    it("should clear token", () => {
      client.setToken("test-token");
      client.clearToken();
      expect(client.getToken()).toBeNull();
    });

    it("should check if authenticated", () => {
      expect(client.isAuthenticated()).toBe(false);
      client.setToken("test-token");
      expect(client.isAuthenticated()).toBe(true);
    });
  });
});

