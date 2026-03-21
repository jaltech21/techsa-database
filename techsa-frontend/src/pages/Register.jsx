import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { authApi } from "../services/api";
import AuthBrand from "../components/AuthBrand";
import Spinner from "../components/Spinner";

const INTERESTS = [
  { label: "Programming / Software Development", icon: "💻" },
  { label: "Networking / Cybersecurity", icon: "🔒" },
  { label: "Graphics & UI/UX Design", icon: "🎨" },
  { label: "Hardware / Electronics", icon: "🔧" },
];

const LEVELS = ["100", "200", "300", "400", "500", "Postgraduate"];

const STEPS = [
  { n: 1, label: "Personal" },
  { n: 2, label: "Contact" },
  { n: 3, label: "Interests" },
  { n: 4, label: "Account" },
];

const inp = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all";

function Label({ children, required }) {
  return (
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
      {children}
      {required && <span className="text-rose-400 ml-1">*</span>}
    </label>
  );
}

function SectionTitle({ step, title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-extrabold flex items-center justify-center shadow-md shadow-indigo-200">
        {step}
      </div>
      <h3 className="text-lg font-extrabold text-gray-800 tracking-tight">{title}</h3>
    </div>
  );
}

/* ── Validation per step ── */
function validateStep(step, form) {
  if (step === 1) {
    return (
      form.first_name.trim() &&
      form.last_name.trim() &&
      form.student_id.trim() &&
      form.department.trim() &&
      form.level &&
      form.date_of_birth &&
      form.gender
    );
  }
  if (step === 2) {
    return (
      form.phone_number.trim() &&
      form.email.trim() &&
      form.residential_area.trim()
    );
  }
  if (step === 3) return true; // interests optional
  if (step === 4) return form.password.length >= 6;
  return true;
}

export default function Register() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  const handleInterest = (label) => {
    setForm((prev) => ({
      ...prev,
      areas_of_interest: prev.areas_of_interest.includes(label)
        ? prev.areas_of_interest.filter((i) => i !== label)
        : [...prev.areas_of_interest, label],
    }));
  };

  const next = () => {
    if (!validateStep(step, form)) {
      showToast("Please fill in all required fields before continuing.", "error");
      return;
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      showToast("You must agree to the membership declaration.", "error");
      return;
    }
    if (!validateStep(4, form)) {
      showToast("Please enter a password of at least 6 characters.", "error");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-indigo-100/60 overflow-hidden grid lg:grid-cols-[300px_1fr]">
        <AuthBrand />

        {/* ── Form panel ── */}
        <div className="flex flex-col min-h-full">

          {/* Mobile brand strip */}
          <div className="lg:hidden bg-gradient-to-br from-indigo-800 to-violet-700 px-6 py-4 flex items-center gap-3">
            <div className="bg-white rounded-xl p-1.5 shadow">
              <img src="/techsa-logo.png" alt="TECHSA" className="h-8 w-8 object-contain rounded-lg" />
            </div>
            <div>
              <p className="text-white font-extrabold tracking-tight">TECHSA</p>
              <p className="text-indigo-200 text-xs">Member Portal</p>
            </div>
          </div>

          {/* Header */}
          <div className="px-8 pt-8 pb-4">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-0.5">Join TECHSA</h1>
            <p className="text-sm text-gray-400">
              Step {step} of {STEPS.length} — {STEPS[step - 1].label}
            </p>
          </div>

          {/* ── Step tracker ── */}
          <div className="px-8 pb-6">
            <div className="flex items-center">
              {STEPS.map(({ n, label }, i) => {
                const done = n < step;
                const active = n === step;
                return (
                  <div key={n} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold transition-all duration-300 ${
                        done
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                          : active
                          ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-100"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        {done ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : n}
                      </div>
                      <span className={`text-[10px] font-bold mt-1.5 hidden sm:block transition-colors ${
                        active ? "text-indigo-600" : done ? "text-indigo-400" : "text-gray-300"
                      }`}>{label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${
                        n < step ? "bg-indigo-500" : "bg-gray-100"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Step content ── */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-8 pb-8">
            <div className="flex-1">

              {/* Step 1 — Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <SectionTitle step="1" title="Personal Information" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>First Name</Label>
                      <input type="text" name="first_name" value={form.first_name}
                        onChange={handleChange} autoComplete="given-name"
                        placeholder="Jane" className={inp} />
                    </div>
                    <div>
                      <Label required>Last Name</Label>
                      <input type="text" name="last_name" value={form.last_name}
                        onChange={handleChange} autoComplete="family-name"
                        placeholder="Smith" className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>Student ID</Label>
                      <input type="text" name="student_id" value={form.student_id}
                        onChange={handleChange} autoComplete="off"
                        placeholder="STU-2026-001" className={inp} />
                    </div>
                    <div>
                      <Label required>Department</Label>
                      <input type="text" name="department" value={form.department}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science" className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>Level / Year</Label>
                      <select name="level" value={form.level} onChange={handleChange} className={inp}>
                        <option value="">Select level…</option>
                        {LEVELS.map((l) => <option key={l} value={l}>{l} Level</option>)}
                      </select>
                    </div>
                    <div>
                      <Label required>Date of Birth</Label>
                      <input type="date" name="date_of_birth" value={form.date_of_birth}
                        onChange={handleChange} className={inp} />
                    </div>
                  </div>
                  <div>
                    <Label required>Gender</Label>
                    <div className="flex gap-3">
                      {["Male", "Female"].map((g) => {
                        const val = g.toLowerCase();
                        const active = form.gender === val;
                        return (
                          <label key={g} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-all ${
                            active ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-indigo-300"
                          }`}>
                            <input type="radio" name="gender" value={val} checked={active}
                              onChange={handleChange} className="sr-only" />
                            <span>{g === "Male" ? "♂" : "♀"}</span>
                            {g}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 — Contact Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <SectionTitle step="2" title="Contact Information" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>Phone Number</Label>
                      <input type="tel" name="phone_number" value={form.phone_number}
                        onChange={handleChange} autoComplete="tel"
                        placeholder="+232 77 000 000" className={inp} />
                    </div>
                    <div>
                      <Label required>Email Address</Label>
                      <input type="email" name="email" value={form.email}
                        onChange={handleChange} autoComplete="email"
                        placeholder="you@example.com" className={inp} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label required>Residential Area</Label>
                      <input type="text" name="residential_area" value={form.residential_area}
                        onChange={handleChange}
                        placeholder="e.g. Freetown, Wilberforce" className={inp} />
                    </div>
                    <div>
                      <Label>Emergency Contact</Label>
                      <input type="text" name="emergency_contact" value={form.emergency_contact}
                        onChange={handleChange}
                        placeholder="Name & phone" className={inp} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Areas of Interest */}
              {step === 3 && (
                <div className="space-y-4">
                  <SectionTitle step="3" title="Areas of Interest" />
                  <div className="grid grid-cols-2 gap-3">
                    {INTERESTS.map(({ label, icon }) => {
                      const active = form.areas_of_interest.includes(label);
                      return (
                        <button type="button" key={label} onClick={() => handleInterest(label)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                            active ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300"
                          }`}>
                          <span className="text-2xl shrink-0">{icon}</span>
                          <span className="text-xs font-semibold leading-snug flex-1">{label}</span>
                          {active && (
                            <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div>
                    <Label>Others — please specify</Label>
                    <input type="text" name="other_interests" value={form.other_interests}
                      onChange={handleChange}
                      placeholder="Any other areas of interest…" className={inp} />
                  </div>
                  <p className="text-xs text-gray-400 text-center pt-1">
                    Selection is optional — you can skip and continue.
                  </p>
                </div>
              )}

              {/* Step 4 — Account & Declaration */}
              {step === 4 && (
                <div className="space-y-5">
                  <SectionTitle step="4" title="Account & Declaration" />
                  <div>
                    <Label required>Password</Label>
                    <input type="password" name="password" value={form.password}
                      onChange={handleChange} autoComplete="new-password"
                      placeholder="Min. 6 characters" className={inp} />
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">📋</span>
                      <h4 className="font-bold text-indigo-900 text-sm">Membership Declaration</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      I hereby declare that the information provided is accurate and that I agree to abide
                      by the rules and regulations of TECHSA, including attending events, honouring financial
                      and social contributions, attending general meetings, and upholding the values of the
                      organisation. I understand that failure to meet these obligations may result in loss of membership.
                    </p>
                    <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 transition-all ${
                      agreed ? "border-indigo-600 bg-white" : "border-gray-200 bg-white hover:border-indigo-300"
                    }`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        agreed ? "bg-indigo-600 border-indigo-600" : "border-gray-300"
                      }`}>
                        {agreed && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <input type="checkbox" checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)} className="sr-only" />
                      <span className="text-sm font-semibold text-indigo-900">
                        I agree to the TECHSA membership obligations and declaration
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* ── Navigation buttons ── */}
            <div className="flex items-center gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-indigo-200 transition-all"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !agreed}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-indigo-200 transition-all"
                >
                  {loading ? (
                    <><Spinner size="sm" /> Submitting…</>
                  ) : (
                    <>
                      Submit Application
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="text-center text-sm text-gray-400 mt-5">
              Already a member?{" "}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-800 transition">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
