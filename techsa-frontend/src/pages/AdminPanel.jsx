import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { adminApi } from "../services/api";

export default function AdminPanel() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    adminApi
      .listMembers()
      .then((res) => setMembers(res.data))
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (member) => {
    const newStatus = member.status === "active" ? "pending" : "active";
    setUpdating(member.id);
    try {
      const res = await adminApi.updateMember(member.id, { status: newStatus });
      setMembers((prev) => prev.map((m) => (m.id === member.id ? res.data : m)));
    } catch {
      alert("Failed to update member status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-500">TECHSA Member Management</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-indigo-600 hover:underline"
            >
              My Dashboard
            </button>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading members…</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Registration No.</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{member.student_id}</td>
                    <td className="px-4 py-3 font-mono text-indigo-600">
                      {member.registration_number}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{member.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          member.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(member)}
                        disabled={updating === member.id}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition disabled:opacity-50 ${
                          member.status === "active"
                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {updating === member.id
                          ? "Saving…"
                          : member.status === "active"
                          ? "Set Pending"
                          : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {members.length === 0 && (
              <p className="text-center text-gray-400 py-8">No members yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
