import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { adminApi } from "../services/api";
import Spinner from "../components/Spinner";

// ─── Icons ──────────────────────────────────────────────────────
function Icon({ name, className = "w-5 h-5" }) {
  const paths = {
    users:   "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    check:   "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    clock:   "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    home:    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    logout:  "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    x:       "M6 18L18 6M6 6l12 12",
    menu:    "M4 6h16M4 12h16M4 18h16",
    eye:     "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    shield:  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    chevron: "M9 5l7 7-7 7",
    mail:    "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    phone:   "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    id:      "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2",
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

// ─── Stat card ──────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green:  "bg-green-50 text-green-600",
    amber:  "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color] ?? colors.indigo}`}>
        <Icon name={icon} className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// ─── Detail row ─────────────────────────────────────────────────
function DetailRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon name={icon} className="w-4 h-4 text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm text-gray-800 font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

// ─── Admin Sidebar ──────────────────────────────────────────────
function AdminSidebar({ view, setView, onLogout, open, onClose }) {
  const navItems = [
    { id: "members", label: "All Members", icon: "users" },
    { id: "active",  label: "Active",      icon: "check" },
    { id: "pending", label: "Pending",     icon: "clock" },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 flex flex-col z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white rounded-lg p-0.5">
            <img src="/techsa-logo.png" alt="TECHSA" className="h-7 w-7 object-contain rounded" />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm tracking-tight block leading-none">TECHSA</span>
            <span className="text-slate-400 text-xs font-medium">Admin</span>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <Icon name="x" className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Members</p>
        {navItems.map((item) => {
          const on = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setView(item.id); onClose(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                on ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon name={item.icon} className="w-5 h-5 shrink-0" />
              {item.label}
            </button>
          );
        })}

        <div className="pt-5 border-t border-slate-800 mt-5 space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Navigation</p>
          <a
            href="/dashboard"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Icon name="home" className="w-5 h-5 shrink-0" />
            Member Dashboard
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <Icon name="logout" className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </nav>

      {/* Admin badge */}
      <div className="px-4 pb-4 shrink-0">
        <div className="flex items-center gap-2 bg-indigo-600/20 rounded-xl px-3 py-2.5">
          <Icon name="shield" className="w-4 h-4 text-indigo-400 shrink-0" />
          <p className="text-xs font-semibold text-indigo-300">Administrator Access</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Member detail drawer ────────────────────────────────────────
function MemberDrawer({ member, onClose, onToggleStatus, updating }) {
  if (!member) return null;

  const isActive = member.status === "active";
  const interests = member.areas_of_interest ?? [];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5 shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg">
              {(member.first_name?.[0] ?? "").toUpperCase()}{(member.last_name?.[0] ?? "").toUpperCase()}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors">
              <Icon name="x" className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-extrabold text-white mb-0.5">
            {member.first_name} {member.last_name}
          </h2>
          <p className="text-slate-400 text-sm font-mono mb-3">{member.registration_number}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${
              isActive ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"
            }`}>
              {member.status}
            </span>
            {member.role === "admin" && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Personal Details</p>
          <DetailRow icon="id"     label="Student ID"        value={member.student_id} />
          <DetailRow icon="users"  label="Department"        value={member.department} />
          <DetailRow icon="id"     label="Level / Year"      value={member.level} />
          <DetailRow icon="users"  label="Gender"            value={member.gender ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1) : null} />
          <DetailRow icon="clock"  label="Date of Birth"     value={member.date_of_birth} />

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-5">Contact</p>
          <DetailRow icon="mail"   label="Email"             value={member.email} />
          <DetailRow icon="phone"  label="Phone Number"      value={member.phone_number} />
          <DetailRow icon="home"   label="Residential Area"  value={member.residential_area} />
          <DetailRow icon="phone"  label="Emergency Contact" value={member.emergency_contact} />

          {(interests.length > 0 || member.other_interests) && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-5">Interests</p>
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2 py-3">
                  {interests.map((i) => (
                    <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                      {i}
                    </span>
                  ))}
                </div>
              )}
              {member.other_interests && (
                <div className="py-2">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Other</p>
                  <p className="text-sm text-gray-700">{member.other_interests}</p>
                </div>
              )}
            </>
          )}

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-5">Account</p>
          <DetailRow icon="clock"  label="Registered"
            value={member.created_at ? new Date(member.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : null}
          />
        </div>

        {/* Action footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={() => onToggleStatus(member)}
            disabled={updating}
            className={`w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${
              isActive
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                : "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200"
            }`}
          >
            {updating ? "Saving…" : isActive ? "Set to Pending" : "Activate Member"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main AdminPanel ─────────────────────────────────────────────
export default function AdminPanel() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [view, setView] = useState("members");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    adminApi
      .listMembers()
      .then((res) => setMembers(res.data))
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleToggleStatus(member) {
    const newStatus = member.status === "active" ? "pending" : "active";
    setUpdating(true);
    try {
      const res = await adminApi.updateMember(member.id, { status: newStatus });
      const updated = res.data;
      setMembers((prev) => prev.map((m) => (m.id === member.id ? updated : m)));
      setSelectedMember(updated);
      showToast(`${member.first_name} ${member.last_name} set to ${newStatus}.`, "success");
    } catch {
      showToast("Failed to update member status.", "error");
    } finally {
      setUpdating(false);
    }
  }

  // Filter members
  const filtered = members.filter((m) => {
    const matchesView =
      view === "members" ? true :
      view === "active"  ? m.status === "active" :
      view === "pending" ? m.status !== "active" : true;

    const q = search.toLowerCase();
    const matchesSearch = !q || [
      m.first_name, m.last_name, m.email,
      m.student_id, m.registration_number, m.department,
    ].some((f) => f?.toLowerCase().includes(q));

    return matchesView && matchesSearch;
  });

  const total   = members.length;
  const active  = members.filter((m) => m.status === "active").length;
  const pending = total - active;

  const viewLabels = { members: "All Members", active: "Active Members", pending: "Pending Approval" };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <AdminSidebar
        view={view}
        setView={setView}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-gray-800 leading-tight">{viewLabels[view]}</h1>
              <p className="text-xs text-gray-400 hidden sm:block">TECHSA Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <Icon name="shield" className="w-3.5 h-3.5" />
              Administrator
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 space-y-6">

          {/* Stats */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon="users" label="Total Members" value={total}   color="indigo" />
              <StatCard icon="check" label="Active"        value={active}  color="green" />
              <StatCard icon="clock" label="Pending"       value={pending} color="amber" />
            </div>
          )}

          {/* Search + table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Search bar */}
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
                />
              </div>
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-gray-400 hover:text-gray-600 font-semibold">
                  Clear
                </button>
              )}
              <span className="ml-auto text-xs text-gray-400 font-semibold shrink-0">
                {filtered.length} {filtered.length === 1 ? "member" : "members"}
              </span>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Spinner size="lg" className="text-indigo-500" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500 font-semibold">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-gray-500 font-semibold">No members found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Member", "Reg. Number", "Department", "Level", "Email", "Status", ""].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((member) => {
                      const isActive = member.status === "active";
                      return (
                        <tr
                          key={member.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer group"
                          onClick={() => setSelectedMember(member)}
                        >
                          {/* Member name + avatar */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                                {(member.first_name?.[0] ?? "").toUpperCase()}{(member.last_name?.[0] ?? "").toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 whitespace-nowrap">
                                  {member.first_name} {member.last_name}
                                </p>
                                <p className="text-xs text-gray-400">{member.student_id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-indigo-600 font-semibold whitespace-nowrap">
                            {member.registration_number}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                            {member.department || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                            {member.level || "—"}
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                            {member.email}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap ${
                              isActive ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                              <Icon name="eye" className="w-4 h-4" />
                              View
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Member detail drawer */}
      {selectedMember && (
        <MemberDrawer
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onToggleStatus={handleToggleStatus}
          updating={updating}
        />
      )}
    </div>
  );
}
