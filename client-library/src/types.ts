/**
 * Type definitions matching the backend API schemas
 */

// User Types
export interface UserBase {
  email: string;
  username: string;
  full_name?: string | null;
}

export interface UserCreate extends UserBase {
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse extends UserBase {
  id: number;
  is_active: boolean;
  created_at: string; // ISO datetime string
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Group Types
export interface GroupBase {
  name: string;
  description?: string | null;
}

export interface GroupCreate extends GroupBase {}

export interface GroupResponse extends GroupBase {
  id: number;
  created_by_user_id: number;
  created_at: string; // ISO datetime string
}

export interface GroupMemberResponse {
  id: number;
  group_id: number;
  user_id: number;
  joined_at: string; // ISO datetime string
  user: UserResponse;
}

export interface GroupWithMembers extends GroupResponse {
  members: GroupMemberResponse[];
}

export interface AddMemberRequest {
  email: string;
}

// Expense Types
export interface ExpenseBase {
  amount: number;
  description?: string | null;
  metadata?: string | null;
}

export interface ExpenseCreate extends ExpenseBase {
  group_id: number;
  paid_by_user_id: number;
  amount: number;
  description?: string | null;
  metadata?: string | null;
}

export interface ExpenseResponse {
  id: number;
  group_id: number;
  paid_by_user_id: number;
  amount: number;
  description?: string | null;
  metadata?: string | null;
  created_at: string; // ISO datetime string
  paid_by_user: UserResponse;
}

// Balance Summary Types
export interface BalanceSummary {
  user_id: number;
  user: UserResponse;
  total_owed: number;
  total_owes: number;
  net_balance: number; // positive = owed to user, negative = user owes
}

export interface GroupBalanceSummary {
  group_id: number;
  group: GroupResponse;
  balances: BalanceSummary[];
}

// API Error Response
export interface ApiErrorResponse {
  detail: string;
}

// Client Configuration
export interface ClientConfig {
  baseUrl: string;
  apiPrefix?: string;
  tokenStorage?: TokenStorage;
}

// Token Storage Interface
export interface TokenStorage {
  getToken(): string | null;
  setToken(token: string): void;
  clearToken(): void;
}

