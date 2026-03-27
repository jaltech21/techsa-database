import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { authApi } from "../services/api";
import AuthBrand from "../components/AuthBrand";
import Spinner from "../components/Spinner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BLOCKED_DOMAINS = [
  "example.com", "test.com", "fake.com", "sample.com",
  "mailinator.com", "tempmail.com", "yopmail.com", "guerrillamail.com",
  "10minutemail.com", "throwam.com", "trashmail.com", "sharklasers.com",
  "dispostable.com", "maildrop.cc", "spam4.me", "getairmail.com",
];

const ALLOWED_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
  "icloud.com", "live.com", "me.com", "protonmail.com",
  "unimtech.edu", "edu.sl",
];

function isEmailValid(email) {
  if (!EMAIL_RE.test(email)) return { ok: false, msg: "Please enter a valid email address." };
  const domain = email.split("@")[1]?.toLowerCase();
  if (BLOCKED_DOMAINS.includes(domain)) return { ok: false, msg: "Please use a real email address (not a test or disposable one)." };
  if (!ALLOWED_DOMAINS.includes(domain)) return { ok: false, msg: `Email domain "@${domain}" is not accepted. Please use a Gmail, Yahoo, Outlook or institutional address.` };
  return { ok: true, msg: "" };
}

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailValidation = isEmailValid(form.email);
  const emailError = emailTouched && form.email && !emailValidation.ok;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid(form.email).ok) {
      setEmailTouched(true);
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const token = res.headers["authorization"]?.split(" ")[1];
      login(res.data.member, token);
      navigate("/dashboard");
    } catch (err) {
      showToast(
        err.response?.data?.error ||
          err.response?.data?.errors?.[0] ||
          "Invalid email or password.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid lg:grid-cols-2">
        <AuthBrand />

        {/* Form panel */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">Sign in to your TECHSA account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => setEmailTouched(true)}
                required
                autoComplete="email"
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  emailError
                    ? "border-red-400 focus:ring-red-300"
                    : "border-gray-200 focus:ring-indigo-500"
                }`}
                placeholder="you@example.com"
              />
              {emailError && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">{emailValidation.msg}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              {loading && <Spinner size="sm" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
