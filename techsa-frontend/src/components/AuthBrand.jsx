export default function AuthBrand() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-500 text-white p-12 rounded-l-2xl">
      {/* Logo mark */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-lg tracking-tight">
          T
        </div>
        <span className="text-xl font-bold tracking-tight">TECHSA</span>
      </div>

      {/* Body */}
      <div>
        <h2 className="text-3xl font-bold leading-snug mb-4">
          Empowering<br />Tech Students
        </h2>
        <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
          The Technology Student Association portal — manage your membership,
          track your status, and connect with the community.
        </p>
      </div>

      {/* Footer quote */}
      <p className="text-xs text-indigo-300">
        &copy; {new Date().getFullYear()} TECHSA. All rights reserved.
      </p>
    </div>
  );
}
