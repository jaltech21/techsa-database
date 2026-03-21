import { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext";
import { adminApi } from "../services/api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";

export default function AdminPanel() {
  const { showToast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    adminApi
      .listMembers()
      .then((res) => setMembers(res.data))
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));
  }, []);

  const confirmToggle = (member) => {
    setConfirmId(confirmId === member.id ? null : member.id);
  };

  const executeToggle = async (member) => {
    const newStatus = member.status === "active" ? "pending" : "active";
    setUpdating(member.id);
    setConfirmId(null);
    try {
      const res = await adminApi.updateMember(member.id, { status: newStatus });
      setMembers((prev) => prev.map((m) => (m.id === member.id ? res.data : m)));
      showToast(
        `${member.first_name} ${member.last_name} set to ${newStatus}.`,
        "success"
      );
    } catch {
      showToast("Failed to update member status.", "error");
    } finally {
      setUpdating(null);
    }
  };

  // Stats
  const total = members.length;
  const active = members.filter((m) => m.status === "active").length;
  const pending = total - active;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-500">TECHSA Member Management</p>
        </div>

        {/* Stats bar */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Members", value: total, color: "text-gray-800" },
              { label: "Active",        value: active,  color: "text-green-600" },
              { label: "Pending",       value: pending, color: "text-yellow-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl shadow-sm px-5 py-4 border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" className="text-indigo-500" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest text-left border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Student ID</th>
                  <th className="px-5 py-3">Registration No.</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{member.student_id}</td>
                    <td className="px-5 py-3.5 font-mono text-indigo-600 font-semibold">
                      {member.registration_number}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{member.email}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          member.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {confirmId === member.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Confirm?</span>
                          <button
                            onClick={() => executeToggle(member)}
                            disabled={updating === member.id}
                            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                          >
                            {updating === member.id ? "Saving…" : "Yes"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => confirmToggle(member)}
                          disabled={updating === member.id}
                          className={`px-3 py-1 text-xs rounded-lg font-semibold transition disabled:opacity-50 ${
                            member.status === "active"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {member.status === "active" ? "Set Pending" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {members.length === 0 && (
              <p className="text-center text-gray-400 py-10">No members yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
