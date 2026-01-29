import { Navigate, useLocation } from "react-router-dom";
import { useMyRoles } from "@/hooks/use-my-roles";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useMyRoles();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Checking access…</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
