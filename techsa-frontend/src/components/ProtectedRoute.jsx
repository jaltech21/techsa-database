import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ requireAdmin = false, blockAdmin = false }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Admin trying to access member-only route → send to admin panel
  if (blockAdmin && currentUser.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Non-admin trying to access admin-only route → send to login
  if (requireAdmin && currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
