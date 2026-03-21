import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function InitialsAvatar({ firstName = "", lastName = "" }) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
      {initials || "?"}
    </div>
  );
}

export default function Navbar({ adminLink = false }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2.5 group">
        <img src="/techsa-logo.png" alt="TECHSA" className="h-8 w-8 object-contain" />
        <span className="text-base font-bold text-indigo-600 tracking-tight">TECHSA</span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {adminLink && currentUser?.role === "admin" && (
          <Link
            to="/admin"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            Admin Panel
          </Link>
        )}

        <div className="flex items-center gap-2.5">
          <InitialsAvatar
            firstName={currentUser?.first_name}
            lastName={currentUser?.last_name}
          />
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {currentUser?.first_name} {currentUser?.last_name}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-500 transition font-medium"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
