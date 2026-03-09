import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";


function dashboardHref(role?: string, sub?: string): string {
  if (role === "developer") {
    return sub ? `/user/developer/${sub}` : "/login";
  }
  return "/user/business";
}

const GlitchText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span
        className={`relative z-10 transition-all duration-75 ${glitching ? "text-violet-300" : ""}`}
        style={glitching ? { textShadow: "2px 0 #ff00ff, -2px 0 #00ffff", transform: "skewX(-2deg)" } : {}}
      >
        {text}
      </span>
      {glitching && (
        <>
          <span className="absolute inset-0 text-cyan-400 z-0 pointer-events-none"    style={{ transform: "translate(3px, 1px)",   opacity: 0.5, clipPath: "inset(30% 0 50% 0)" }} aria-hidden />
          <span className="absolute inset-0 text-fuchsia-500 z-0 pointer-events-none" style={{ transform: "translate(-3px, -1px)", opacity: 0.5, clipPath: "inset(60% 0 10% 0)" }} aria-hidden />
        </>
      )}
    </span>
  );
};

const LangToggle: React.FC = () => {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-1 px-3 py-1.5 rounded-full border border-violet-800/60 bg-violet-950/40 hover:border-violet-500/70 transition-all duration-200"
      aria-label="Toggle language"
    >
      <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${lang === "en" ? "text-violet-300" : "text-gray-500"}`}>EN</span>
      <span className="text-[10px] text-gray-600 mx-0.5">/</span>
      <span className={`text-[10px] font-black tracking-widest uppercase transition-colors ${lang === "es" ? "text-violet-300" : "text-gray-500"}`}>ES</span>
      <span
        className="absolute top-1 bottom-1 w-6 rounded-full bg-violet-600/30 transition-all duration-300"
        style={{ left: lang === "en" ? "4px" : "calc(100% - 28px)" }}
      />
    </button>
  );
};

const Nav: React.FC = () => {
  const { user, setUser } = useUser();
  const { lang }          = useLanguage();
  const location          = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null); // UserContext sets authStatus → unauthenticated, ProtectedRoute redirects
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const links = [
    { label: lang === "en" ? "Services" : "Servicios", path: "/services"   },
    { label: lang === "en" ? "For Devs" : "Devs",      path: "/developers" },
    { label: lang === "en" ? "Help"     : "Ayuda",     path: "/help"       },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const dashHref      = user ? dashboardHref(user.role, user.sub) : "/login";
  const avatarInitial = (user?.displayName?.[0] ?? user?.username?.[0] ?? "U").toUpperCase();
  const onDashboard   = location.pathname.startsWith("/user/") || location.pathname === "/settings";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-violet-900/40" : "bg-transparent"
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-violet-500 opacity-20 rounded blur-sm group-hover:opacity-40 transition-opacity" />
            <div className="relative w-full h-full border border-violet-400/60 rounded flex items-center justify-center">
              <span className="text-violet-300 font-black text-sm tracking-tighter">K</span>
            </div>
          </div>
          <GlitchText text="KUSTOM" className="text-white font-black text-lg tracking-[0.2em] uppercase" />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-200 group ${
                isActive(link.path) ? "text-violet-300" : "text-gray-400 hover:text-violet-300"
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              <span
                className={`absolute bottom-1 left-4 right-4 h-px bg-violet-500 transition-transform duration-200 origin-left ${
                  isActive(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Desktop account area */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <LangToggle />
          <div className="w-px h-4 bg-violet-800" />

          {user ? (
            <>
              <Link
                to={dashHref}
                className={`px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors ${
                  onDashboard ? "text-violet-300" : "text-gray-400 hover:text-violet-300"
                }`}
              >
                {lang === "en" ? "Dashboard" : "Panel"}
              </Link>

              {/* Avatar pill */}
              <Link
                to={dashHref}
                className="flex items-center gap-2 px-3 py-1.5 border border-violet-800/50 rounded bg-violet-950/30 hover:border-violet-600/60 transition-colors"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={avatarInitial} className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[9px] font-black text-white">
                    {avatarInitial}
                  </div>
                )}
                <span className="text-[10px] font-semibold tracking-widest text-gray-300 uppercase max-w-[80px] truncate">
                  {user.displayName ?? user.username}
                </span>
                <span className={`text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border ${
                  user.role === "developer"
                    ? "text-cyan-400 border-cyan-800/50 bg-cyan-950/30"
                    : "text-violet-400 border-violet-800/50 bg-violet-950/30"
                }`}>
                  {user.role === "developer" ? "Dev" : "Biz"}
                </span>
              </Link>

              <button
                onClick={handleSignOut}
                className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-violet-300 border border-violet-700 hover:border-violet-400 hover:bg-violet-900/30 transition-all rounded"
              >
                {lang === "en" ? "Sign out" : "Salir"}
              </button>
            </>
          ) : (
            // ── Guest: Sign in (primary) + Sign up (ghost) ──────────────────
            <div className="flex items-center gap-2">
              <Link
                to="/registro"
                className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-gray-400 border border-violet-900/50 hover:border-violet-600/60 hover:text-violet-300 transition-all rounded"
              >
                {lang === "en" ? "Sign up" : "Registrarse"}
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-black bg-violet-400 hover:bg-violet-300 transition-all rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx={12} cy={8} r={4} />
                  <path strokeLinecap="round" d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
                </svg>
                {lang === "en" ? "Sign in" : "Ingresar"}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: lang toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <LangToggle />
          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-px w-5 bg-violet-400 transition-all duration-300 ${
                  menuOpen
                    ? i === 0 ? "rotate-45 translate-y-[7px] translate-x-[3px]"
                    : i === 1 ? "opacity-0 scale-x-0"
                    : "-rotate-45 -translate-y-[8px] translate-x-[3px]"
                    : ""
                }`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[28rem] border-b border-violet-900/40" : "max-h-0"
        } bg-black/95 backdrop-blur-md`}
      >
        <div className="px-6 py-4 flex flex-col gap-1">

          {/* Nav links */}
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-3 text-xs font-semibold tracking-widest uppercase border-b border-violet-900/30 transition-colors ${
                isActive(link.path) ? "text-violet-300" : "text-gray-400"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Account section label */}
          <div className="pt-4 pb-1">
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-700">
              {lang === "en" ? "Account" : "Cuenta"}
            </span>
          </div>

          {user ? (
            // ── Signed in ────────────────────────────────────────────────────
            <div className="flex flex-col gap-2 pb-2">
              {/* User pill */}
              <div className="flex items-center gap-2 px-3 py-2 border border-violet-900/40 rounded-lg bg-violet-950/20">
                <div className="w-6 h-6 rounded-full bg-violet-700 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                  {avatarInitial}
                </div>
                <span className="text-xs text-gray-300 truncate flex-1">{user.displayName ?? user.username}</span>
                <span className={`text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                  user.role === "developer"
                    ? "text-cyan-400 border-cyan-800/50 bg-cyan-950/30"
                    : "text-violet-400 border-violet-800/50 bg-violet-950/30"
                }`}>
                  {user.role === "developer" ? "Dev" : "Biz"}
                </span>
              </div>

              <Link
                to={dashHref}
                className="text-center py-2.5 text-xs font-black tracking-widest uppercase text-violet-300 border border-violet-700 rounded"
              >
                {lang === "en" ? "Dashboard" : "Panel"}
              </Link>
              <Link
                to="/settings"
                className="text-center py-2.5 text-xs font-bold tracking-widest uppercase text-gray-400 border border-violet-900/40 rounded"
              >
                {lang === "en" ? "Settings" : "Configuración"}
              </Link>
              <button
                onClick={handleSignOut}
                className="py-2.5 text-xs font-bold tracking-widest uppercase text-gray-500 border border-violet-900/30 rounded"
              >
                {lang === "en" ? "Sign out" : "Cerrar sesión"}
              </button>
            </div>
          ) : (
            // ── Guest ────────────────────────────────────────────────────────
            <div className="flex flex-col gap-2 pb-2">
              <Link
                to="/login"
                className="text-center py-2.5 text-xs font-black tracking-widest uppercase text-black bg-violet-400 hover:bg-violet-300 transition-all rounded"
              >
                {lang === "en" ? "Sign in" : "Ingresar"}
              </Link>
              <Link
                to="/registro"
                className="text-center py-2.5 text-xs font-bold tracking-widest uppercase text-violet-300 border border-violet-700/60 hover:border-violet-500 rounded transition-colors"
              >
                {lang === "en" ? "Create account" : "Crear cuenta"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;