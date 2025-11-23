"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";

export function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/login" className="text-xl font-bold text-gray-900">
                Expense Settlement
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Expense Settlement
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/groups"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Groups
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/profile">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

