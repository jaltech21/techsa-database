import { useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ─── Floating code fragments ─────────────────────────────────────
const FRAGS = [
  "{ }",  "</>",   "01",     "0xFF",  "$ git",  "#include",
  "fn()", "def ",  "=>",     "&&",    "// ?",   "import",
  "class","const", "NULL",   "async", "sudo",   "npm i",
  "while","struct","API",    ":root", "SELECT", "int[]",
  "curl", "bash",  "index",  "0x00",  "ssh",    "jwt",
];

function useFragments(count = 32) {
  return useMemo(() => {
    // Use a seeded-style deterministic spread so SSR / HMR is stable
    return Array.from({ length: count }, (_, i) => {
      const pseudo = (i * 2654435761) >>> 0; // Knuth multiplicative hash
      return {
        id:       i,
        text:     FRAGS[i % FRAGS.length],
        left:     `${3 + (pseudo % 94)}%`,
        top:      `${(pseudo >> 8) % 110}%`,
        duration: 9 + (pseudo % 14),
        delay:    -((pseudo >> 4) % 18),
        opacity:  0.045 + ((pseudo >> 12) % 10) * 0.009,
        size:     11 + (i % 5),
      };
    });
  }, []);
}

// ─── Feature cards ───────────────────────────────────────────────
const FEATURES = [
  {
    icon: "📚",
    title: "Academic Support",
    desc: "Workshops, resources, and peer-led learning sessions for every level.",
  },
  {
    icon: "💻",
    title: "Tech Projects",
    desc: "Collaborate on real-world builds — apps, hardware, and open source.",
  },
  {
    icon: "🤝",
    title: "Networking",
    desc: "Industry events, meetups, and connections that outlast your degree.",
  },
];

// ─── Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fragments = useFragments(32);

  // Redirect already-logged-in users away from the landing page
  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-[#0f0c29] to-indigo-950 flex flex-col text-white">

      {/* ── Dot grid overlay ───────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(99,102,241,0.13) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* ── Glow orbs ──────────────────────────────────────────── */}
      <div className="absolute -top-36 -left-36 w-[28rem] h-[28rem] rounded-full bg-indigo-600/25 blur-3xl pointer-events-none animate-glow-pulse" />
      <div
        className="absolute bottom-0 -right-36 w-[32rem] h-[32rem] rounded-full bg-violet-700/20 blur-3xl pointer-events-none animate-glow-pulse"
        style={{ animationDelay: "-3.5s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-900/30 blur-[120px] pointer-events-none" />

      {/* ── Floating code fragments ─────────────────────────────── */}
      {fragments.map(({ id, text, left, top, duration, delay, opacity, size }) => (
        <span
          key={id}
          className="absolute font-mono text-indigo-300 pointer-events-none select-none animate-float"
          style={{
            left,
            top,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            opacity,
            fontSize: size,
          }}
        >
          {text}
        </span>
      ))}

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1.5 border border-white/10 shadow-lg">
            <img
              src="/techsa-logo.png"
              alt="TECHSA"
              className="h-8 w-8 object-contain rounded-lg"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-white tracking-tight text-base">TECHSA</span>
            <span className="text-indigo-400 text-[10px] font-semibold uppercase tracking-widest">
              Member Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/login"
            className="text-indigo-200 hover:text-white text-sm font-semibold transition-colors px-3 sm:px-4 py-2 rounded-xl hover:bg-white/5"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-900/60 transition-all"
          >
            Join Now
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-10 sm:py-16">

        {/* Live badge */}
        <div
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-indigo-300 text-xs font-semibold tracking-widest uppercase">
            Now Accepting Memberships
          </span>
        </div>

        {/* Logo block */}
        <div
          className="relative mb-8 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl blur-2xl opacity-40 scale-110 pointer-events-none" />
          <div className="relative bg-gradient-to-br from-indigo-900/70 to-violet-900/70 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-2xl">
            <img
              src="/techsa-logo.png"
              alt="TECHSA"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-xl"
            />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none mb-4 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="text-white">TEC</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300">
            HSA
          </span>
        </h1>

        <p
          className="text-indigo-200 text-lg sm:text-xl font-semibold mb-3 animate-fade-up"
          style={{ animationDelay: "0.4s" }}
        >
          Technology Students Association
        </p>

        <p
          className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mb-10 animate-fade-up"
          style={{ animationDelay: "0.5s" }}
        >
          Your community for tech, innovation, and growth. Connect with fellow students,
          join projects, and build the future — together.
        </p>

        {/* CTA buttons */}
        <div
          className="flex items-center gap-4 flex-wrap justify-center animate-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            to="/register"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-indigo-900/70 transition-all text-sm group"
          >
            Become a Member
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all text-sm backdrop-blur-sm"
          >
            Sign In
            <svg
              className="w-4 h-4 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
            </svg>
          </Link>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 animate-fade-up hidden sm:flex"
          style={{ animationDelay: "1s" }}
        >
          <span className="text-[10px] uppercase tracking-widest text-slate-400">Scroll</span>
          <svg className="w-4 h-4 text-slate-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </main>

      {/* ── Feature strip ───────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div
              key={title}
              className="flex items-start gap-4 animate-fade-up"
              style={{ animationDelay: `${0.7 + i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-xl">
                {icon}
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-1">{title}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer line */}
        <div className="border-t border-white/5 py-4 text-center">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} TECHSA — Technology Students Association
          </p>
        </div>
      </div>
    </div>
  );
}
