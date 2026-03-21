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

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="px-6 py-4">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();

  const statusColor =
    currentUser?.status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  const interests = currentUser?.areas_of_interest ?? [];
  const hasInterests = interests.length > 0 || currentUser?.other_interests;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar adminLink />

      <main className="max-w-2xl mx-auto mt-10 px-4 pb-12">
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

        {/* Membership Card */}
        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100 mb-6">
          {/* Membership ID */}
          <div className="px-6 py-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Membership ID</p>
            <p className="text-3xl font-mono font-semibold text-indigo-600 tracking-tight">
              {currentUser?.registration_number ?? "—"}
            </p>
          </div>
          {/* Status */}
          <div className="px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Status</p>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${statusColor}`}>
              {currentUser?.status}
            </span>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100 mb-6">
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Information</h3>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <InfoRow label="First Name" value={currentUser?.first_name} />
            <InfoRow label="Last Name" value={currentUser?.last_name} />
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <InfoRow label="Student ID" value={currentUser?.student_id} />
            <InfoRow label="Department" value={currentUser?.department} />
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <InfoRow label="Level / Year" value={currentUser?.level ? `${currentUser.level} Level` : null} />
            <InfoRow label="Gender" value={currentUser?.gender ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1) : null} />
          </div>
          <InfoRow label="Date of Birth" value={currentUser?.date_of_birth} />
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100 mb-6">
          <div className="px-6 py-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Information</h3>
          </div>
          <InfoRow label="Email" value={currentUser?.email} />
          <InfoRow label="Phone Number" value={currentUser?.phone_number} />
          <InfoRow label="Residential Area" value={currentUser?.residential_area} />
          <InfoRow label="Emergency Contact" value={currentUser?.emergency_contact} />
        </div>

        {/* Areas of Interest */}
        {hasInterests && (
          <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100 mb-6">
            <div className="px-6 py-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Areas of Interest</h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
                    {i}
                  </span>
                ))}
                {currentUser?.other_interests && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    {currentUser.other_interests}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin link */}
        {currentUser?.role === "admin" && (
          <div className="bg-white rounded-2xl shadow-md px-6 py-4">
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
      </main>
    </div>
  );
}
