import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SuccessModal({ member, onClose }) {
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const initials = `${member?.first_name?.[0] ?? ""}${member?.last_name?.[0] ?? ""}`.toUpperCase();

  const statusColor =
    member?.status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-amber-100 text-amber-700 border-amber-200";

  const interests = member?.areas_of_interest ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header banner */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 px-6 pt-8 pb-16 text-center overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5" />

          {/* Checkmark */}
          <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-white mb-1">Application Submitted!</h2>
          <p className="text-indigo-200 text-sm">Your TECHSA membership has been registered</p>
        </div>

        {/* Avatar — overlapping the banner */}
        <div className="relative -mt-10 flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-2xl font-extrabold flex items-center justify-center ring-4 ring-white shadow-xl">
            {initials}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-center text-lg font-extrabold text-gray-900 mb-0.5">
            {member?.first_name} {member?.last_name}
          </p>
          <p className="text-center text-sm text-gray-400 mb-5">{member?.email}</p>

          {/* Key details */}
          <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 mb-5">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Membership ID</span>
              <span className="font-mono text-indigo-600 font-bold text-sm">{member?.registration_number}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Status</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${statusColor}`}>
                {member?.status}
              </span>
            </div>
            {member?.department && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Department</span>
                <span className="text-sm text-gray-700 font-medium">{member.department}</span>
              </div>
            )}
            {member?.level && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Level</span>
                <span className="text-sm text-gray-700 font-medium">{member.level}</span>
              </div>
            )}
          </div>

          {/* Interests tags */}
          {interests.length > 0 && (
            <div className="mb-5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2">Areas of Interest</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((i) => (
                  <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pending notice */}
          {member?.status === "pending" && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-5">
              <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-amber-700 leading-relaxed">
                Your membership is <strong>pending approval</strong>. An admin will review and activate your account shortly.
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-indigo-200 transition-all mb-3"
          >
            Go to My Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
