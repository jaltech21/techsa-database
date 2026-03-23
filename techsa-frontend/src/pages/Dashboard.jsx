import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ─── Icon ───────────────────────────────────────────────────────
function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    grid:   "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    menu:   "M4 6h16M4 12h16M4 18h16",
    x:      "M6 18L18 6M6 6l12 12",
    user:   "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    card:   "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    star:   "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    admin:  "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    help:   "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

// ─── Avatar ─────────────────────────────────────────────────────
function Avatar({ firstName = "", lastName = "", size = "md" }) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  const sz = { sm: "w-9 h-9 text-sm", md: "w-11 h-11 text-base", lg: "w-16 h-16 text-xl" }[size] ?? "w-11 h-11 text-base";
  return (
    <div className={`rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow ${sz}`}>
      {initials || "?"}
    </div>
  );
}

// ─── StatCard ───────────────────────────────────────────────────
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-extrabold text-gray-800 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

// ─── SectionCard ────────────────────────────────────────────────
function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── Field ──────────────────────────────────────────────────────
function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value || "—"}</p>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "overview",    label: "Dashboard",  icon: "grid" },
  { id: "personal",   label: "Profile",    icon: "user" },
  { id: "membership", label: "Membership", icon: "card" },
  { id: "interests",  label: "Interests",  icon: "star" },
];

function Sidebar({ active, setActive, currentUser, onLogout, open, onClose }) {
  function NavBtn({ item }) {
    const on = active === item.id;
    return (
      <button
        onClick={() => { setActive(item.id); onClose(); }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
          on ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
        }`}
      >
        <Icon name={item.icon} className={`w-5 h-5 shrink-0 ${on ? "text-indigo-600" : "text-gray-400"}`} />
        {item.label}
      </button>
    );
  }

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-30 shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between gap-2.5 px-5 h-16 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white rounded-lg p-0.5 shadow-sm border border-gray-100">
            <img src="/techsa-logo.png" alt="TECHSA" className="h-7 w-7 object-contain rounded" />
          </div>
          <span className="font-extrabold text-gray-900 text-base tracking-tight">TECHSA</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
          <Icon name="x" className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest px-3 mb-2">Main</p>
        {NAV_ITEMS.map((item) => (
          <NavBtn key={item.id} item={item} />
        ))}

        {currentUser?.role === "admin" && (
          <Link
            to="/admin"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
          >
            <Icon name="admin" className="w-5 h-5 shrink-0 text-gray-400" />
            Admin Panel
          </Link>
        )}

        <div className="pt-4 space-y-0.5">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest px-3 mb-2">Other</p>
          <NavBtn item={{ id: "help", label: "Help / Support", icon: "help" }} />
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <Icon name="logout" className="w-5 h-5 shrink-0 text-red-400" />
            Logout
          </button>
        </div>
      </nav>

      {currentUser?.status !== "active" && (
        <div className="mx-3 mb-3 bg-amber-50 border border-amber-200 rounded-xl p-3 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">⏳</span>
            <p className="text-xs font-bold text-amber-800">Pending Approval</p>
          </div>
          <p className="text-xs text-amber-600 leading-snug">Your account is under review by an admin.</p>
        </div>
      )}
    </aside>
  );
}

// ─── Dashboard page ─────────────────────────────────────────────
export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statusActive = currentUser?.status === "active";
  const statusCls = statusActive
    ? "bg-green-100 text-green-700 border border-green-200"
    : "bg-amber-100 text-amber-700 border border-amber-200";

  const interests = currentUser?.areas_of_interest ?? [];

  const titles = {
    overview:   "Dashboard",
    personal:   "My Profile",
    membership: "Membership",
    interests:  "Interests",
    help:       "Help & Support",
  };

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        active={active}
        setActive={setActive}
        currentUser={currentUser}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-extrabold text-gray-800">{titles[active] ?? "Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${statusCls}`}>
              {currentUser?.status}
            </span>
            <Avatar firstName={currentUser?.first_name} lastName={currentUser?.last_name} size="sm" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-7 space-y-5 max-w-5xl w-full">

          {active === "overview" && (
            <>
              {/* Welcome banner */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200/40 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-28 h-28 rounded-full bg-violet-500/20 pointer-events-none" />
                <div className="relative flex items-center gap-5">
                  <Avatar firstName={currentUser?.first_name} lastName={currentUser?.last_name} size="lg" />
                  <div>
                    <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Welcome back</p>
                    <h2 className="text-2xl font-extrabold leading-tight">
                      {currentUser?.first_name} {currentUser?.last_name}
                    </h2>
                    <p className="text-indigo-200 text-sm font-mono mt-1">{currentUser?.registration_number}</p>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon="🎓" label="Department" value={currentUser?.department} />
                <StatCard icon="📚" label="Level"      value={currentUser?.level} />
                <StatCard icon="🪪" label="Student ID" value={currentUser?.student_id} />
              </div>

              {/* Pending notice */}
              {!statusActive && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
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
                <SectionCard title="Areas of Interest">
                  <div className="flex flex-wrap gap-2">
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
                </SectionCard>
              )}
            </>
          )}

          {active === "personal" && (
            <SectionCard title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                <Field label="First Name"        value={currentUser?.first_name} />
                <Field label="Last Name"         value={currentUser?.last_name} />
                <Field label="Student ID"        value={currentUser?.student_id} />
                <Field label="Department"        value={currentUser?.department} />
                <Field label="Level / Year"      value={currentUser?.level} />
                <Field label="Gender"
                  value={currentUser?.gender
                    ? currentUser.gender.charAt(0).toUpperCase() + currentUser.gender.slice(1)
                    : null}
                />
                <Field label="Date of Birth"     value={currentUser?.date_of_birth} />
                <Field label="Email Address"     value={currentUser?.email} />
                <Field label="Phone Number"      value={currentUser?.phone_number} />
                <Field label="Residential Area"  value={currentUser?.residential_area} />
                <Field label="Emergency Contact" value={currentUser?.emergency_contact} />
              </div>
            </SectionCard>
          )}

          {active === "membership" && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200/50 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
                <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-3">TECHSA Membership Card</p>
                <p className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight mb-8">
                  {currentUser?.registration_number ?? "—"}
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-indigo-200 text-xs uppercase tracking-widest mb-1">Member Name</p>
                    <p className="font-bold text-lg">{currentUser?.first_name} {currentUser?.last_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-200 text-xs uppercase tracking-widest mb-1">Status</p>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${statusCls}`}>
                      {currentUser?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard icon="🏛️" label="Department" value={currentUser?.department} />
                <StatCard icon="📚" label="Level"      value={currentUser?.level} />
              </div>

              {!statusActive && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <span className="text-xl shrink-0">⏳</span>
                  <div>
                    <p className="font-bold text-amber-800 text-sm mb-0.5">Account Pending</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Your membership is pending administrator approval. You will be notified once activated.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {active === "interests" && (
            <div className="space-y-4">
              {interests.length > 0 ? (
                <SectionCard title="Selected Areas of Interest">
                  <div className="flex flex-wrap gap-2.5">
                    {interests.map((i) => (
                      <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-100">
                        {i}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <p className="text-5xl mb-4">💡</p>
                  <p className="font-semibold text-gray-500">No interests selected yet</p>
                </div>
              )}
              {currentUser?.other_interests && (
                <SectionCard title="Other Interests">
                  <p className="text-sm text-gray-700">{currentUser.other_interests}</p>
                </SectionCard>
              )}
            </div>
          )}

          {active === "help" && (
            <SectionCard title="Help & Support">
              <div className="text-center py-12">
                <p className="text-5xl mb-4">🛟</p>
                <p className="font-semibold text-gray-600 mb-2">Need help?</p>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Contact the TECHSA team at your institution's student services office for any membership-related queries.
                </p>
              </div>
            </SectionCard>
          )}

        </main>
      </div>
    </div>
  );
}
