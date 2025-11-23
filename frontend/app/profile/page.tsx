"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ValidationError } from "@expense-settlement/client";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setUsername(user.username);
      setFullName(user.full_name || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiClient.updateMyProfile({
        email,
        username,
        full_name: fullName || null,
      });
      await refreshUser();
      setSuccess("Profile updated successfully!");
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.detail || "Validation error. Please check your input.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <p className="text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

