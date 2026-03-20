import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const statusColor =
    currentUser?.status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">TECHSA</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Sign out
        </button>
      </nav>

      <main className="max-w-lg mx-auto mt-12 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Welcome, {currentUser?.first_name}!
        </h2>
        <p className="text-sm text-gray-500 mb-8">Your membership details</p>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100">
          {/* Membership ID */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Membership ID
            </p>
            <p className="text-2xl font-mono font-semibold text-blue-600">
              {currentUser?.registration_number ?? "—"}
            </p>
          </div>

          {/* Status */}
          <div className="px-6 py-5 flex items-center justify-between">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColor}`}
            >
              {currentUser?.status}
            </span>
          </div>

          {/* Name */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Name</p>
            <p className="text-sm text-gray-700">
              {currentUser?.first_name} {currentUser?.last_name}
            </p>
          </div>

          {/* Email */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
            <p className="text-sm text-gray-700">{currentUser?.email}</p>
          </div>

          {/* Student ID */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Student ID
            </p>
            <p className="text-sm text-gray-700">{currentUser?.student_id}</p>
          </div>

          {/* Admin link */}
          {currentUser?.role === "admin" && (
            <div className="px-6 py-5">
              <a
                href="/admin"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Go to Admin Panel →
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
