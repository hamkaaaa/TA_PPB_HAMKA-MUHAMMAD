import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="h-8 w-40 animate-pulse rounded-xl bg-zinc-800" />
        <div className="h-44 animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900/60" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
