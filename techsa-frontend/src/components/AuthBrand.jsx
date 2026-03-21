const features = [
  { icon: "🎓", text: "Track your membership status" },
  { icon: "🌐", text: "Connect with tech students" },
  { icon: "🚀", text: "Access events & opportunities" },
];

export default function AuthBrand() {
  return (
    <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-700 to-violet-700 text-white p-10 rounded-l-2xl">
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
      <div className="absolute bottom-20 -left-12 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute bottom-0 right-0 w-28 h-28 rounded-full bg-violet-500/30" />

      {/* Logo + wordmark */}
      <div className="relative flex items-center gap-3">
        <div className="bg-white rounded-xl p-1.5 shadow-lg">
          <img src="/techsa-logo.png" alt="TECHSA" className="h-9 w-9 object-contain rounded-lg" />
        </div>
        <div>
          <p className="text-xl font-extrabold tracking-tight leading-none">TECHSA</p>
          <p className="text-indigo-300 text-xs tracking-widest uppercase">Member Portal</p>
        </div>
      </div>

      {/* Headline */}
      <div className="relative">
        <div className="w-8 h-1 bg-violet-400 rounded-full mb-5" />
        <h2 className="text-3xl font-extrabold leading-tight mb-4">
          Empowering<br />Tech Students
        </h2>
        <p className="text-indigo-200 text-sm leading-relaxed mb-8 max-w-xs">
          The Technology Student Association — your gateway to learning,
          networking, and growing in the tech community.
        </p>
        <div className="space-y-3">
          {features.map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base shrink-0">
                {icon}
              </div>
              <span className="text-indigo-100 text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="relative text-xs text-indigo-400">
        &copy; {new Date().getFullYear()} TECHSA. All rights reserved.
      </p>
    </div>
  );
}
