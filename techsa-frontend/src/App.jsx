import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import LandingPage from "./pages/LandingPage";

function DefaultRedirect() {
  const { currentUser } = useAuth();
  if (currentUser?.role === "admin") return <Navigate to="/admin" replace />;
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/" replace />;
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <span className="text-2xl font-bold text-indigo-600 tracking-tight">TECHSA</span>
        <Spinner size="lg" className="text-indigo-500" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Member-protected routes (admins are redirected to /admin) */}
      <Route element={<ProtectedRoute blockAdmin />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Admin-protected routes */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>

      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
