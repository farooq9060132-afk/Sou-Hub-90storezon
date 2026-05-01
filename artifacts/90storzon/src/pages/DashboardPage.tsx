import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { User, Shield, LogOut, Calendar, Mail } from "lucide-react";
import { useGetCurrentUser, useLogoutUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: user, isLoading } = useGetCurrentUser({ query: { queryKey: getGetCurrentUserQueryKey() } });
  const logoutUser = useLogoutUser();

  useEffect(() => { document.title = "Dashboard — 90StorZon"; }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading]);

  const handleLogout = () => {
    logoutUser.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
        toast({ title: "Logged out", description: "See you next time!" });
        navigate("/");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-6" />
        <div className="bg-card rounded-2xl border border-card-border p-8">
          <div className="h-16 w-16 bg-muted rounded-full mb-4" />
          <div className="h-6 bg-muted rounded w-1/2 mb-2" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Dashboard</h1>

      <div className="bg-card rounded-2xl border border-card-border p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground" data-testid="dashboard-user-name">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span data-testid="dashboard-user-email">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</span>
            </div>
            {user.isAdmin && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium">
                <Shield className="w-3.5 h-3.5" />
                Administrator
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Link href="/tools" className="bg-card rounded-xl border border-card-border p-5 hover:border-primary/50 hover:shadow-md transition-all group">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Explore Tools</h3>
          <p className="text-sm text-muted-foreground mt-1">Access all free productivity tools</p>
        </Link>
        <Link href="/shop" className="bg-card rounded-xl border border-card-border p-5 hover:border-primary/50 hover:shadow-md transition-all group">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">Visit Shop</h3>
          <p className="text-sm text-muted-foreground mt-1">Browse our product catalog</p>
        </Link>
        {user.isAdmin && (
          <Link href="/admin" className="bg-card rounded-xl border border-card-border p-5 hover:border-primary/50 hover:shadow-md transition-all group sm:col-span-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              <Shield className="w-4 h-4" /> Admin Panel
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Manage users, view analytics, and more</p>
          </Link>
        )}
      </div>

      <button
        onClick={handleLogout}
        disabled={logoutUser.isPending}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/5 transition-colors"
        data-testid="button-logout"
      >
        <LogOut className="w-4 h-4" />
        {logoutUser.isPending ? "Logging out..." : "Log Out"}
      </button>
    </div>
  );
}
