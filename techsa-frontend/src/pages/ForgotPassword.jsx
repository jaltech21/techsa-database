import { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../services/api";
import { useToast } from "../contexts/ToastContext";
import AuthBrand from "../components/AuthBrand";
import Spinner from "../components/Spinner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailError = emailTouched && email && !EMAIL_RE.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setEmailTouched(true);
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch {
      // Always show the same message to prevent enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid lg:grid-cols-2">
        <AuthBrand />

        <div className="p-10 flex flex-col justify-center">
          {submitted ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-6">
                If <span className="font-medium text-gray-700">{email}</span> is registered, you'll receive reset instructions shortly.
              </p>
              <p className="text-xs text-gray-400 mb-6">The link expires in 6 hours. Check your spam folder if you don't see it.</p>
              <Link to="/login" className="text-sm text-indigo-600 font-semibold hover:underline">
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Forgot password?</h1>
              <p className="text-sm text-gray-500 mb-8">Enter your email and we'll send reset instructions.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                      emailError
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200 focus:ring-indigo-500"
                    }`}
                  />
                  {emailError && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">Please enter a valid email address.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                >
                  {loading && <Spinner size="sm" />}
                  {loading ? "Sending…" : "Send Reset Instructions"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                Remembered it?{" "}
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
