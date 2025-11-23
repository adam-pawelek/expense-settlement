"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, UserPlus, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { GroupWithMembers, ExpenseResponse, GroupBalanceSummary } from "@expense-settlement/client";
import { ValidationError, NotFoundError } from "@expense-settlement/client";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = parseInt(params.id as string);

  const [group, setGroup] = useState<GroupWithMembers | null>(null);
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [balance, setBalance] = useState<GroupBalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dialog states
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expensePaidBy, setExpensePaidBy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (groupId) {
      loadGroupData();
    }
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      const [groupData, expensesData, balanceData] = await Promise.all([
        apiClient.getGroup(groupId),
        apiClient.getGroupExpenses(groupId),
        apiClient.getGroupBalanceSummary(groupId),
      ]);
      setGroup(groupData);
      setExpenses(expensesData);
      setBalance(balanceData);
    } catch (err) {
      if (err instanceof NotFoundError) {
        setError("Group not found");
      } else {
        setError("Failed to load group data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await apiClient.addMemberToGroup(groupId, {
        email: selectedEmail,
      });
      setSelectedEmail("");
      setAddMemberDialogOpen(false);
      await loadGroupData();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.detail || "Validation error");
      } else if (err instanceof NotFoundError) {
        setError("User not found with this email");
      } else {
        setError("Failed to add member");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await apiClient.createExpense({
        group_id: groupId,
        paid_by_user_id: parseInt(expensePaidBy),
        amount: parseFloat(expenseAmount),
        description: expenseDescription || null,
      });
      setExpenseAmount("");
      setExpenseDescription("");
      setExpensePaidBy("");
      setAddExpenseDialogOpen(false);
      await loadGroupData();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.detail || "Validation error");
      } else {
        setError("Failed to add expense");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!group) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "Group not found"}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/groups")} className="mt-4">
            Back to Groups
          </Button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/groups")} className="mb-4">
            ← Back to Groups
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              {group.description && (
                <p className="mt-2 text-gray-600">{group.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Member to Group</DialogTitle>
                    <DialogDescription>
                      Add a user to this group by their email address
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddMember} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={selectedEmail}
                        onChange={(e) => setSelectedEmail(e.target.value)}
                        required
                        placeholder="user@example.com"
                      />
                      <p className="text-xs text-gray-500">
                        Enter the email address of the user you want to add to this group
                      </p>
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? "Adding..." : "Add Member"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={addExpenseDialogOpen} onOpenChange={setAddExpenseDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>
                      Record a new expense for this group
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        required
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paidBy">Paid By</Label>
                      <Select value={expensePaidBy} onValueChange={setExpensePaidBy} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent>
                          {group.members.map((member) => (
                            <SelectItem key={member.user_id} value={member.user_id.toString()}>
                              {member.user.username} ({member.user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        value={expenseDescription}
                        onChange={(e) => setExpenseDescription(e.target.value)}
                        placeholder="Dinner at restaurant"
                      />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? "Adding..." : "Add Expense"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="expenses">
              <DollarSign className="mr-2 h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="balance">
              <TrendingUp className="mr-2 h-4 w-4" />
              Balance Summary
            </TabsTrigger>
            <TabsTrigger value="members">
              <UserPlus className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Expense History</CardTitle>
                <CardDescription>All expenses for this group</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No expenses yet. Add your first expense to get started.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Paid By</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>
                            {new Date(expense.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{expense.description || "No description"}</TableCell>
                          <TableCell>{expense.paid_by_user.username}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${expense.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Balance Summary</CardTitle>
                <CardDescription>
                  Who owes what (assuming equal split for each expense)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {balance && balance.balances.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead className="text-right">Total Paid</TableHead>
                        <TableHead className="text-right">Total Owed</TableHead>
                        <TableHead className="text-right">Net Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {balance.balances.map((b) => (
                        <TableRow key={b.user_id}>
                          <TableCell className="font-medium">
                            {b.user.username}
                          </TableCell>
                          <TableCell className="text-right">
                            ${b.total_owed.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${b.total_owes.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            {b.net_balance > 0 ? (
                              <Badge variant="default" className="bg-green-500">
                                Owed ${b.net_balance.toFixed(2)}
                              </Badge>
                            ) : b.net_balance < 0 ? (
                              <Badge variant="destructive">
                                Owes ${Math.abs(b.net_balance).toFixed(2)}
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Settled</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No balance data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Group Members</CardTitle>
                <CardDescription>All members of this group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{member.user.username}</p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                      </div>
                      <Badge variant="secondary">
                        Joined {new Date(member.joined_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}

