import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

function InitialsAvatar({ firstName = "", lastName = "" }) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-lg font-bold flex items-center justify-center shrink-0">
      {initials || "?"}
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();

  const statusColor =
    currentUser?.status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar adminLink />

      <main className="max-w-lg mx-auto mt-10 px-4 pb-12">
        {/* Welcome heading with avatar */}
        <div className="flex items-center gap-4 mb-8">
          <InitialsAvatar
            firstName={currentUser?.first_name}
            lastName={currentUser?.last_name}
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {currentUser?.first_name}!
            </h2>
            <p className="text-sm text-gray-500">Your membership details</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100">
          {/* Membership ID */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              Membership ID
            </p>
            <p className="text-3xl font-mono font-semibold text-indigo-600 tracking-tight">
              {currentUser?.registration_number ?? "—"}
            </p>
          </div>

          {/* Status */}
          <div className="px-6 py-5 flex items-center justify-between">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Status</p>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColor}`}
            >
              {currentUser?.status}
            </span>
          </div>

          {/* Name */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Name</p>
            <p className="text-sm text-gray-700">
              {currentUser?.first_name} {currentUser?.last_name}
            </p>
          </div>

          {/* Email */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Email</p>
            <p className="text-sm text-gray-700">{currentUser?.email}</p>
          </div>

          {/* Student ID */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              Student ID
            </p>
            <p className="text-sm text-gray-700">{currentUser?.student_id}</p>
          </div>

          {/* Admin link */}
          {currentUser?.role === "admin" && (
            <div className="px-6 py-4">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
              >
                Go to Admin Panel
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
