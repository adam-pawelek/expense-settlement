"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, DollarSign, TrendingUp } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your expenses and settle up with your groups
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Groups</span>
              </CardTitle>
              <CardDescription>Manage your expense groups</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/groups">
                <Button className="w-full">View Groups</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Expenses</span>
              </CardTitle>
              <CardDescription>Track and manage expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/groups">
                <Button className="w-full" variant="outline">
                  View Expenses
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Balances</span>
              </CardTitle>
              <CardDescription>View settlement balances</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/groups">
                <Button className="w-full" variant="outline">
                  View Balances
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
