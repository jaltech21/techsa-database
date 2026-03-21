import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { authApi } from "../services/api";
import AuthBrand from "../components/AuthBrand";
import Spinner from "../components/Spinner";

export default function Register() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    student_id: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register(form);
      const loginRes = await authApi.login({
        email: form.email,
        password: form.password,
      });
      const token = loginRes.headers["authorization"]?.split(" ")[1];
      login(loginRes.data.member, token);
      navigate("/dashboard");
    } catch (err) {
      const msgs = err.response?.data?.errors;
      showToast(
        Array.isArray(msgs) ? msgs[0] : "Registration failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "first_name",  label: "First Name", type: "text",     placeholder: "Jane",          autoComplete: "given-name" },
    { name: "last_name",   label: "Last Name",  type: "text",     placeholder: "Smith",         autoComplete: "family-name" },
    { name: "student_id",  label: "Student ID", type: "text",     placeholder: "STU-2026-001", autoComplete: "off" },
    { name: "email",       label: "Email",      type: "email",    placeholder: "you@example.com", autoComplete: "email" },
    { name: "password",    label: "Password",   type: "password", placeholder: "Min. 6 characters", autoComplete: "new-password" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid lg:grid-cols-2">
        <AuthBrand />

        {/* Form panel */}
        <div className="p-10 flex flex-col justify-center overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Join TECHSA</h1>
          <p className="text-sm text-gray-500 mb-8">Create your membership account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder, autoComplete }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              {loading && <Spinner size="sm" />}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
