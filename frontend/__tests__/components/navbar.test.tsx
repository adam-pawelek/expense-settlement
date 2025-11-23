import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/contexts/auth-context";

// Mock the auth context
jest.mock("@/contexts/auth-context", () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { useAuth } from "@/contexts/auth-context";

describe("Navbar", () => {
  it("renders login and signup buttons when user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    render(<Navbar />);

    expect(screen.getByText("Expense Settlement")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("renders user menu when authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: 1,
        email: "test@example.com",
        username: "testuser",
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
      },
      loading: false,
      logout: jest.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText("Expense Settlement")).toBeInTheDocument();
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("does not render when loading", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });

    const { container } = render(<Navbar />);
    expect(container.firstChild).toBeNull();
  });
});

