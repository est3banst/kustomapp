import { NavLink } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const FooterHeading: React.FC<{ label: string }> = ({ label }) => (
  <div className="mb-5">
    <h3 className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600">{label}</h3>
    <div className="mt-2 h-px w-8 bg-violet-600" />
  </div>
);

const FLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-xs font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 group ${
        isActive ? "text-violet-300" : "text-gray-500 hover:text-gray-200"
      }`
    }
  >
    <span className="w-0 h-px bg-violet-500 group-hover:w-3 transition-all duration-200 shrink-0" />
    {children}
  </NavLink>
);

const SocialLink: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({
  href, label, children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center border border-violet-900/60 text-gray-500 hover:text-violet-300 hover:border-violet-500/60 rounded transition-all duration-200 bg-violet-950/20 hover:bg-violet-950/60"
  >
    {children}
  </a>
);

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const { lang } = useLanguage();
  const { user } = useUser();
  const year = new Date().getFullYear();

  // ── Platform links (always shown) ────────────────────────────────────────
  const platformLinks = [
    { label: lang === "en" ? "Browse services"   : "Ver servicios",        path: "/services"          },
    { label: lang === "en" ? "Find a developer"  : "Encontrar dev",        path: "/developers"        },
    { label: lang === "en" ? "Post a project"    : "Publicar proyecto",    path: "/pub-project"       },
    { label: lang === "en" ? "FAQ"               : "Preguntas frecuentes", path: "/faq"               },
    { label: lang === "en" ? "Free consultation" : "Consulta gratis",      path: "/free-consultation" },
  ];

  // ── Account links — change based on auth state ────────────────────────────
  const dashHref = user?.role === "developer" && user?.sub
    ? `/user/developer/${user.sub}`
    : "/user/business";

  const accountLinks = user
    ? [
        { label: lang === "en" ? "Dashboard" : "Panel",              path: dashHref    },
        { label: lang === "en" ? "Settings"  : "Configuración",      path: "/settings" },
        { label: lang === "en" ? "Help"      : "Ayuda",              path: "/help"     },
      ]
    : [
        { label: lang === "en" ? "Sign in"           : "Ingresar",       path: "/login"             },
        { label: lang === "en" ? "Create account"    : "Crear cuenta",   path: "/registro"          },
        { label: lang === "en" ? "Help center"       : "Centro de ayuda",path: "/help"              },
      ];

  // ── Legal ─────────────────────────────────────────────────────────────────
  const legalLinks = [
    { label: lang === "en" ? "Privacy Policy"   : "Privacidad", path: "/privacy" },
    { label: lang === "en" ? "Terms of Service" : "Términos",   path: "/terms"   },
    { label: lang === "en" ? "Cookie Policy"    : "Cookies",    path: "/cookies" },
  ];

  return (
    <footer className="relative bg-black border-t border-violet-950/60 overflow-hidden">

      {/* Bg grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* ── 4-col grid: brand / platform / account / newsletter ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="relative w-7 h-7">
                <div className="absolute inset-0 bg-violet-500 opacity-20 rounded blur-sm" />
                <div className="relative w-full h-full border border-violet-400/60 rounded flex items-center justify-center">
                  <span className="text-violet-300 font-black text-xs">K</span>
                </div>
              </div>
              <span className="text-white font-black text-base tracking-[0.2em] uppercase">KUSTOM</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-6 max-w-[220px]">
              {lang === "en"
                ? "The platform connecting vetted developers with businesses that need digital solutions."
                : "La plataforma que conecta desarrolladores verificados con empresas que necesitan soluciones digitales."}
            </p>
            <div className="flex items-center gap-2">
              <SocialLink href="https://www.instagram.com/kustom_desarrollo/" label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x={2} y={2} width={20} height={20} rx={5} />
                  <circle cx={12} cy={12} r={4} />
                  <circle cx={17.5} cy={6.5} r={0.5} fill="currentColor" />
                </svg>
              </SocialLink>
              <SocialLink href="https://twitter.com/" label="Twitter / X">
                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com/" label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialLink>
              <SocialLink href="mailto:info@kustomdev.com" label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x={2} y={4} width={20} height={16} rx={2} />
                  <path d="m2 7 10 7 10-7" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Platform */}
          <div>
            <FooterHeading label={lang === "en" ? "Platform" : "Plataforma"} />
            <nav className="flex flex-col gap-3.5">
              {platformLinks.map((l) => <FLink key={l.path} to={l.path}>{l.label}</FLink>)}
            </nav>
          </div>

          {/* Account — context-aware */}
          <div>
            <FooterHeading label={lang === "en" ? "Account" : "Cuenta"} />
            <nav className="flex flex-col gap-3.5">
              {accountLinks.map((l) => <FLink key={l.path} to={l.path}>{l.label}</FLink>)}
            </nav>

            {/* Signed-in indicator */}
            {user && (
              <div className="mt-5 flex items-center gap-2 px-3 py-2 border border-violet-900/40 rounded-lg bg-violet-950/20 w-fit">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[10px] text-gray-500 truncate max-w-[120px]">
                  {user.displayName ?? user.username}
                </span>
                <span className={`text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border ${
                  user.role === "developer"
                    ? "text-cyan-400 border-cyan-800/50 bg-cyan-950/30"
                    : "text-violet-400 border-violet-800/50 bg-violet-950/30"
                }`}>
                  {user.role === "developer" ? "Dev" : "Biz"}
                </span>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div>
            <FooterHeading label={lang === "en" ? "Stay in the loop" : "Mantente al día"} />
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              {lang === "en"
                ? "Get updates on new developers, features & opportunities."
                : "Novedades sobre desarrolladores, funciones y oportunidades."}
            </p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder={lang === "en" ? "username@email.com" : "usuario@correo.com"}
                className="flex-1 min-w-0 px-3 py-2 text-xs bg-violet-950/30 border border-violet-900/50 rounded text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500/70 transition-colors"
              />
              <button className="px-3 py-2 bg-violet-500 hover:bg-violet-400 text-black text-xs font-black rounded transition-colors shrink-0">
                →
              </button>
            </div>
            <a
              href="mailto:info@kustomdev.com"
              className="text-xs text-gray-500 hover:text-violet-300 transition-colors flex items-center gap-2 group"
            >
              <span className="w-0 h-px bg-violet-500 group-hover:w-3 transition-all duration-200" />
              info@kustomdev.com
            </a>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-violet-900/60 to-transparent mb-8" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-600">
            Kustom © {year} — {lang === "en" ? "Digital solutions at your reach" : "Soluciones digitales a tu alcance"}
          </span>
          <div className="flex items-center gap-6">
            {legalLinks.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                className="text-[10px] font-medium tracking-widest uppercase text-gray-600 hover:text-gray-400 transition-colors"
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;