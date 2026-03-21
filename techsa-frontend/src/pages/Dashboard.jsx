import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";

function Avatar({ firstName = "", lastName = "", size = "lg" }) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  const sz = size === "lg"
    ? "w-20 h-20 text-2xl ring-4 ring-white ring-offset-2"
    : "w-12 h-12 text-base";
  return (
    <div className={`rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-lg ${sz}`}>
      {initials || "?"}
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-base font-extrabold text-gray-800 truncate">{value || "—"}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="divide-y divide-gray-50">{children}</div>
    </div>
  );
}

function Field({ label, value, full }) {
  if (!value) return null;
  return (
    <div className={`px-5 py-4 ${full ? "" : ""}`}>
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}

function TwoCol({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>;
}

const TABS = ["Overview", "Personal", "Contact", "Interests"];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState("Overview");

  const statusActive = currentUser?.status === "active";
  const statusCls = statusActive
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-amber-100 text-amber-700 border-amber-200";

  const interests = currentUser?.areas_of_interest ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      <Navbar />

      {/* ── Hero banner ── */}
      <div className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-violet-500/20" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center sm:items-end gap-5">
          <Avatar firstName={currentUser?.first_name} lastName={currentUser?.last_name} size="lg" />
          <div className="text-center sm:text-left flex-1">
            <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Student Member</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2">
              {currentUser?.first_name} {currentUser?.last_name}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-sm text-indigo-200 font-mono">{currentUser?.registration_number}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${statusCls}`}>
                {currentUser?.status}
              </span>
            </div>
          </div>
          {currentUser?.role === "admin" && (
            <Link to="/admin"
              className="shrink-0 flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 text-sm font-bold px-4 py-2.5 rounded-xl transition-all">
              Admin Panel
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto scrollbar-none">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 py-4 px-4 text-sm font-bold border-b-2 transition-all ${
                tab === t
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-16">

        {/* ── OVERVIEW ── */}
        {tab === "Overview" && (
          <div className="space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon="🎓" label="Department" value={currentUser?.department} />
              <StatCard icon="📚" label="Level" value={currentUser?.level} />
              <StatCard icon="🪪" label="Student ID" value={currentUser?.student_id} />
            </div>

            {/* Membership card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/50 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-2">Membership ID</p>
              <p className="text-3xl sm:text-4xl font-mono font-extrabold mb-4 tracking-tight">
                {currentUser?.registration_number ?? "—"}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-xs uppercase tracking-widest mb-0.5">Status</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${statusCls}`}>
                    {currentUser?.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-indigo-200 text-xs uppercase tracking-widest mb-0.5">Member since</p>
                  <p className="text-white font-bold text-sm">
                    {currentUser?.created_at
                      ? new Date(currentUser.created_at).getFullYear()
                      : new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending notice */}
            {!statusActive && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
                <span className="text-xl shrink-0">⏳</span>
                <div>
                  <p className="font-bold text-amber-800 text-sm mb-0.5">Pending Approval</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Your membership application is under review. An administrator will activate your account shortly.
                  </p>
                </div>
              </div>
            )}

            {/* Interests snapshot */}
            {interests.length > 0 && (
              <Section title="Areas of Interest">
                <div className="px-5 py-4 flex flex-wrap gap-2">
                  {interests.map((i) => (
                    <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                      {i}
                    </span>
                  ))}
                  {currentUser?.other_interests && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                      {currentUser.other_interests}
                    </span>
                  )}
                </div>
              </Section>
            )}
          </div>
        )}

        {/* ── PERSONAL ── */}
        {tab === "Personal" && (
          <Section title="Personal Information">
            <TwoCol>
              <Field label="First Name" value={currentUser?.first_name} />
              <Field label="Last Name" value={currentUser?.last_name} />
            </TwoCol>
            <TwoCol>
              <Field label="Student ID" value={currentUser?.student_id} />
              <Field label="Department" value={currentUser?.department} />
            </TwoCol>
            <TwoCol>
              <Field label="Level / Year" value={currentUser?.level} />
              <Field label="Gender" value={currentUser?.gender
                ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1)
                : null} />
            </TwoCol>
            <Field label="Date of Birth" value={currentUser?.date_of_birth} />
          </Section>
        )}

        {/* ── CONTACT ── */}
        {tab === "Contact" && (
          <Section title="Contact Information">
            <Field label="Email Address" value={currentUser?.email} />
            <Field label="Phone Number" value={currentUser?.phone_number} />
            <Field label="Residential Area" value={currentUser?.residential_area} />
            <Field label="Emergency Contact" value={currentUser?.emergency_contact} />
          </Section>
        )}

        {/* ── INTERESTS ── */}
        {tab === "Interests" && (
          <div className="space-y-4">
            {interests.length > 0 ? (
              <Section title="Selected Areas of Interest">
                <div className="px-5 py-5 flex flex-wrap gap-2.5">
                  {interests.map((i) => (
                    <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-100">
                      {i}
                    </span>
                  ))}
                </div>
              </Section>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">💡</p>
                <p className="font-semibold text-gray-500">No interests selected yet</p>
              </div>
            )}
            {currentUser?.other_interests && (
              <Section title="Other Interests">
                <div className="px-5 py-5">
                  <p className="text-sm text-gray-700">{currentUser.other_interests}</p>
                </div>
              </Section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


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

