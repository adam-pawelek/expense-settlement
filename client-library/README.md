# Expense Settlement Client Library

TypeScript client library for the Expense Settlement API. This library provides a type-safe interface for interacting with the backend API from your Next.js or other TypeScript applications.

## Installation

```bash
npm install
npm run build
```

Or if you're using this as a local package in your Next.js app:

```bash
# In your Next.js project
npm install ../client-library
# or
yarn add ../client-library
```

## Usage

### Basic Setup

```typescript
import { ExpenseSettlementClient } from '@expense-settlement/client';

// Initialize the client
const client = new ExpenseSettlementClient({
  baseUrl: 'http://localhost:8000', // Your API base URL
  apiPrefix: '/api/v1', // Optional, defaults to '/api/v1'
});
```

### Authentication

#### Sign Up

```typescript
try {
  const user = await client.signup({
    email: 'user@example.com',
    username: 'johndoe',
    password: 'securepassword123',
    full_name: 'John Doe',
  });
  console.log('User created:', user);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation error:', error.detail);
  }
}
```

#### Login

```typescript
try {
  const token = await client.login({
    email: 'user@example.com',
    password: 'securepassword123',
  });
  // Token is automatically stored
  console.log('Logged in successfully');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Login failed:', error.detail);
  }
}
```

#### Get Current User

```typescript
try {
  const user = await client.getCurrentUser();
  console.log('Current user:', user);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Not authenticated');
  }
}
```

### User Management

#### Get Profile

```typescript
const profile = await client.getMyProfile();
```

#### Update Profile

```typescript
const updatedProfile = await client.updateMyProfile({
  email: 'newemail@example.com',
  username: 'newusername',
  full_name: 'New Name',
});
```

#### Get User by ID

```typescript
const user = await client.getUser(123);
```

### Group Management

#### Create Group

```typescript
const group = await client.createGroup({
  name: 'Weekend Trip',
  description: 'Expenses for our weekend getaway',
});
```

#### Get My Groups

```typescript
const groups = await client.getMyGroups();
groups.forEach(group => {
  console.log(`Group: ${group.name} (${group.members.length} members)`);
});
```

#### Get Group by ID

```typescript
const group = await client.getGroup(1);
```

#### Add Member to Group

```typescript
const member = await client.addMemberToGroup(1, {
  user_id: 2,
});
```

### Expense Management

#### Create Expense

```typescript
const expense = await client.createExpense({
  group_id: 1,
  paid_by_user_id: 1,
  amount: 150.50,
  description: 'Dinner at restaurant',
  metadata: JSON.stringify({ category: 'food', location: 'NYC' }),
});
```

#### Get Group Expenses

```typescript
const expenses = await client.getGroupExpenses(1);
expenses.forEach(expense => {
  console.log(`${expense.paid_by_user.username} paid $${expense.amount}`);
});
```

#### Get Balance Summary

```typescript
const balance = await client.getGroupBalanceSummary(1);
balance.balances.forEach(b => {
  if (b.net_balance > 0) {
    console.log(`${b.user.username} is owed $${b.net_balance}`);
  } else if (b.net_balance < 0) {
    console.log(`${b.user.username} owes $${Math.abs(b.net_balance)}`);
  } else {
    console.log(`${b.user.username} is settled up`);
  }
});
```

### Error Handling

The client library provides specific error classes for different scenarios:

```typescript
import {
  ApiError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  ForbiddenError,
} from '@expense-settlement/client';

try {
  await client.createGroup({ name: '' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.detail);
  } else if (error instanceof AuthenticationError) {
    console.error('Please login first');
  } else if (error instanceof ForbiddenError) {
    console.error('You do not have permission');
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found');
  } else if (error instanceof ApiError) {
    console.error('API error:', error.message, error.statusCode);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Token Management

The client automatically handles token storage using localStorage in the browser or memory in Node.js. You can also manage tokens manually:

```typescript
// Get current token
const token = client.getToken();

// Set token manually (e.g., from server-side session)
client.setToken('your-token-here');

// Clear token (logout)
client.clearToken();

// Check if authenticated
if (client.isAuthenticated()) {
  // User is logged in
}
```

### Custom Token Storage

You can provide a custom token storage implementation:

```typescript
import { TokenStorage } from '@expense-settlement/client';

class CustomTokenStorage implements TokenStorage {
  getToken(): string | null {
    // Your custom logic
    return sessionStorage.getItem('token');
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  clearToken(): void {
    sessionStorage.removeItem('token');
  }
}

const client = new ExpenseSettlementClient({
  baseUrl: 'http://localhost:8000',
  tokenStorage: new CustomTokenStorage(),
});
```

### Next.js Usage Example

```typescript
// lib/api-client.ts
import { ExpenseSettlementClient } from '@expense-settlement/client';

export const apiClient = new ExpenseSettlementClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// app/login/page.tsx
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { AuthenticationError } from '@expense-settlement/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.login({ email, password });
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      if (err instanceof AuthenticationError) {
        setError(err.detail || 'Invalid credentials');
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
}
```

## API Reference

### Client Methods

#### Authentication
- `signup(userData: UserCreate): Promise<UserResponse>`
- `login(credentials: UserLogin): Promise<Token>`
- `getCurrentUser(): Promise<UserResponse>`

#### User Management
- `getMyProfile(): Promise<UserResponse>`
- `updateMyProfile(userData: UserBase): Promise<UserResponse>`
- `getUser(userId: number): Promise<UserResponse>`

#### Group Management
- `createGroup(groupData: GroupCreate): Promise<GroupResponse>`
- `getMyGroups(): Promise<GroupWithMembers[]>`
- `getGroup(groupId: number): Promise<GroupWithMembers>`
- `addMemberToGroup(groupId: number, request: AddMemberRequest): Promise<GroupMemberResponse>`

#### Expense Management
- `createExpense(expenseData: ExpenseCreate): Promise<ExpenseResponse>`
- `getGroupExpenses(groupId: number): Promise<ExpenseResponse[]>`
- `getGroupBalanceSummary(groupId: number): Promise<GroupBalanceSummary>`

### Type Definitions

All TypeScript types are exported from the package. See `src/types.ts` for complete definitions.

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run watch
```

## License

MIT

