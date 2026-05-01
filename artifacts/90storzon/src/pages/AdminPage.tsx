import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Users, TrendingUp, Wrench, Trash2, Shield, ArrowLeft } from "lucide-react";
import {
  useGetCurrentUser, useGetAdminStats, useListUsers, useDeleteUser,
  getGetCurrentUserQueryKey, getGetAdminStatsQueryKey, getListUsersQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = useGetCurrentUser({ query: { queryKey: getGetCurrentUserQueryKey() } });
  const { data: stats, isLoading: statsLoading } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });
  const { data: users, isLoading: usersLoading } = useListUsers({ query: { queryKey: getListUsersQueryKey() } });
  const deleteUser = useDeleteUser();

  useEffect(() => { document.title = "Admin Panel — 90StorZon"; }, []);

  useEffect(() => {
    if (!userLoading && (!user || !user.isAdmin)) {
      navigate(user ? "/dashboard" : "/login");
    }
  }, [user, userLoading]);

  const handleDeleteUser = (id: number, name: string) => {
    if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    deleteUser.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: "User deleted", description: `${name} has been removed.` });
      },
      onError: () => {
        toast({ title: "Delete failed", description: "Could not delete the user.", variant: "destructive" });
      },
    });
  };

  if (userLoading) {
    return <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/4 mb-8" />
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
      </div>
    </div>;
  }

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Admin Panel</h1>
        </div>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map(i => <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-card rounded-xl border border-card-border p-6" data-testid="admin-stat-users">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total Users</span>
            </div>
            <p className="text-4xl font-bold text-foreground">{stats.totalUsers}</p>
          </div>
          <div className="bg-card rounded-xl border border-card-border p-6" data-testid="admin-stat-pageviews">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Page Views</span>
            </div>
            <p className="text-4xl font-bold text-foreground">{stats.totalPageViews}</p>
          </div>
          <div className="bg-card rounded-xl border border-card-border p-6" data-testid="admin-stat-tool-usage">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-chart-3" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Tool Uses</span>
            </div>
            <p className="text-4xl font-bold text-foreground">{stats.totalToolUsage}</p>
          </div>
        </div>
      )}

      {/* Tool Stats */}
      {stats && stats.toolStats.length > 0 && (
        <div className="bg-card rounded-xl border border-card-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tool Usage Stats</h2>
          <div className="space-y-3">
            {stats.toolStats.map((stat) => (
              <div key={stat.tool} className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground w-40 truncate">{stat.tool}</span>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(100, (stat.count / (stats.toolStats[0]?.count || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-card-border overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Registered Users</h2>
        </div>
        {usersLoading ? (
          <div className="p-6 animate-pulse space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((u) => (
                  <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors" data-testid={`admin-user-row-${u.id}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.isAdmin ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Admin</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">User</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={deleteUser.isPending}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          data-testid={`admin-delete-user-${u.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
