import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { authApi } from "../services/api";
import AuthBrand from "../components/AuthBrand";
import Spinner from "../components/Spinner";

const INTERESTS = [
  "Programming / Software Development",
  "Networking / Cybersecurity",
  "Graphics & UI/UX Design",
  "Hardware / Electronics",
];

const LEVELS = ["100", "200", "300", "400", "500", "Postgraduate"];

function SectionHeading({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {number}
      </div>
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">{title}</h3>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

export default function Register() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    first_name: "", last_name: "", student_id: "",
    department: "", level: "", gender: "", date_of_birth: "",
    phone_number: "", email: "", residential_area: "", emergency_contact: "",
    areas_of_interest: [], other_interests: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      areas_of_interest: prev.areas_of_interest.includes(interest)
        ? prev.areas_of_interest.filter((i) => i !== interest)
        : [...prev.areas_of_interest, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      showToast("You must agree to the membership declaration.", "error");
      return;
    }
    setLoading(true);
    try {
      await authApi.register(form);
      const loginRes = await authApi.login({ email: form.email, password: form.password });
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid lg:grid-cols-[280px_1fr]">
        <AuthBrand />

        {/* Form panel */}
        <div className="p-8 overflow-y-auto max-h-screen">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Join TECHSA</h1>
          <p className="text-sm text-gray-500 mb-8">Complete your membership application</p>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Section 1: Personal Information ── */}
            <div>
              <SectionHeading number="1" title="Personal Information" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" required>
                  <input type="text" name="first_name" value={form.first_name}
                    onChange={handleChange} required autoComplete="given-name"
                    placeholder="Jane" className={inputCls} />
                </Field>
                <Field label="Last Name" required>
                  <input type="text" name="last_name" value={form.last_name}
                    onChange={handleChange} required autoComplete="family-name"
                    placeholder="Smith" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Field label="Student ID" required>
                  <input type="text" name="student_id" value={form.student_id}
                    onChange={handleChange} required autoComplete="off"
                    placeholder="STU-2026-001" className={inputCls} />
                </Field>
                <Field label="Department" required>
                  <input type="text" name="department" value={form.department}
                    onChange={handleChange} required
                    placeholder="e.g. Computer Science" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Field label="Level / Year" required>
                  <select name="level" value={form.level} onChange={handleChange} required
                    className={inputCls}>
                    <option value="">Select level</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l} Level</option>)}
                  </select>
                </Field>
                <Field label="Date of Birth" required>
                  <input type="date" name="date_of_birth" value={form.date_of_birth}
                    onChange={handleChange} required className={inputCls} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Gender" required>
                  <div className="flex gap-6 mt-1">
                    {["Male", "Female"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                        <input type="radio" name="gender" value={g.toLowerCase()}
                          checked={form.gender === g.toLowerCase()}
                          onChange={handleChange} required
                          className="accent-indigo-600 w-4 h-4" />
                        {g}
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            {/* ── Section 2: Contact Information ── */}
            <div>
              <SectionHeading number="2" title="Contact Information" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone Number" required>
                  <input type="tel" name="phone_number" value={form.phone_number}
                    onChange={handleChange} required autoComplete="tel"
                    placeholder="+232 XX XXX XXXX" className={inputCls} />
                </Field>
                <Field label="Email Address" required>
                  <input type="email" name="email" value={form.email}
                    onChange={handleChange} required autoComplete="email"
                    placeholder="you@example.com" className={inputCls} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Field label="Residential Area" required>
                  <input type="text" name="residential_area" value={form.residential_area}
                    onChange={handleChange} required
                    placeholder="e.g. Freetown" className={inputCls} />
                </Field>
                <Field label="Emergency Contact">
                  <input type="text" name="emergency_contact" value={form.emergency_contact}
                    onChange={handleChange}
                    placeholder="Name & phone number" className={inputCls} />
                </Field>
              </div>
            </div>

            {/* ── Section 3: Areas of Interest ── */}
            <div>
              <SectionHeading number="3" title="Areas of Interest in Technology" />
              <div className="space-y-2.5">
                {INTERESTS.map((interest) => (
                  <label key={interest} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox"
                      checked={form.areas_of_interest.includes(interest)}
                      onChange={() => handleInterest(interest)}
                      className="accent-indigo-600 w-4 h-4 rounded" />
                    <span className="text-sm text-gray-700 group-hover:text-indigo-600 transition">{interest}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <Field label="Others — Please specify">
                  <input type="text" name="other_interests" value={form.other_interests}
                    onChange={handleChange}
                    placeholder="Any other areas..." className={inputCls} />
                </Field>
              </div>
            </div>

            {/* ── Section 4: Password & Declaration ── */}
            <div>
              <SectionHeading number="4" title="Account & Declaration" />
              <Field label="Password" required>
                <input type="password" name="password" value={form.password}
                  onChange={handleChange} required autoComplete="new-password"
                  placeholder="Min. 6 characters" className={inputCls} />
              </Field>

              <div className="mt-5 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  I hereby declare that the information provided above is accurate and that I agree
                  to abide by the rules and regulations of the Technology Students Association (TECHSA),
                  including attending events, honouring financial and social contributions, attending
                  general meetings, and upholding the values of the organisation.
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-indigo-800">
                    I agree to the TECHSA membership obligations and declaration
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              {loading && <Spinner size="sm" />}
              {loading ? "Submitting application…" : "Submit Membership Application"}
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
