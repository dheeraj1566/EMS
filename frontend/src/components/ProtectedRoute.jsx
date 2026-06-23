import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();
  const hasToken = !!localStorage.getItem("token");

  if (!user && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
