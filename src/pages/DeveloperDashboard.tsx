import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut, getCurrentUser } from "aws-amplify/auth";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import Nav from "@/components/Nav";

// ── Small stat card ─────────────────────────────────────────────────
const Stat: React.FC<{ value: string; label: string; trend?: string; icon: React.ReactNode }> = ({
  value, label, trend, icon,
}) => (
  <div className="relative flex-1 min-w-[130px] p-5 border border-violet-900/40 bg-violet-950/10 rounded-xl overflow-hidden group hover:border-violet-700/50 transition-colors">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-700/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="text-gray-600 mb-3">{icon}</div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 mt-0.5">{label}</div>
    {trend && <div className="text-[10px] text-violet-400 font-semibold mt-1">{trend}</div>}
  </div>
);

// ── Project row ─────────────────────────────────────────────────────
const ProjectRow: React.FC<{
  title: string;
  client: string;
  status: "active" | "review" | "pending";
  budget: string;
  deadline: string;
  lang: string;
}> = ({ title, client, status, budget, deadline, lang }) => {
  const statusConfig = {
    active:  { label: lang === "en" ? "Active"      : "Activo",       color: "text-emerald-400 border-emerald-800/50 bg-emerald-950/20" },
    review:  { label: lang === "en" ? "In review"   : "En revisión",  color: "text-amber-400  border-amber-800/50  bg-amber-950/20"   },
    pending: { label: lang === "en" ? "Pending"     : "Pendiente",    color: "text-gray-400   border-gray-700/50   bg-gray-900/20"    },
  };
  const cfg = statusConfig[status];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-violet-900/20 last:border-0 group hover:bg-violet-950/10 px-2 -mx-2 rounded transition-colors">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-xs text-gray-600">{client}</span>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${cfg.color}`}>
          {cfg.label}
        </span>
        <span className="text-xs text-gray-500 hidden sm:block">{budget}</span>
        <span className="text-xs text-gray-600">{deadline}</span>
      </div>
    </div>
  );
};

// ── Proposal card ───────────────────────────────────────────────────
const ProposalCard: React.FC<{
  title: string;
  budget: string;
  stack: string[];
  posted: string;
  lang: string;
}> = ({ title, budget, stack, posted, lang }) => (
  <div className="relative flex flex-col gap-4 p-5 border border-violet-900/40 bg-violet-950/10 rounded-xl overflow-hidden group hover:border-violet-600/50 hover:bg-violet-950/20 transition-all">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-start justify-between gap-2">
      <h4 className="text-sm font-bold text-white leading-snug">{title}</h4>
      <span className="text-xs font-black text-violet-300 shrink-0">{budget}</span>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {stack.map((s) => (
        <span key={s} className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded border border-cyan-900/50 bg-cyan-950/20 text-cyan-500">
          {s}
        </span>
      ))}
    </div>
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-gray-600">{posted}</span>
      <button className="text-[10px] font-black tracking-widest uppercase text-violet-400 hover:text-violet-300 transition-colors">
        {lang === "en" ? "Apply →" : "Aplicar →"}
      </button>
    </div>
  </div>
);

// ── Developer dashboard ─────────────────────────────────────────────
const DeveloperDashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const { lang }          = useLanguage();
  const navigate          = useNavigate();
  const [checking, setChecking] = useState(true);

  // Session check — redirect non-devs
  useEffect(() => {
    const check = async () => {
      try {
        await getCurrentUser();
        // If user loaded but wrong role, redirect to generic user page
        if (user && user.role !== "developer" && user.role !== undefined) {
          navigate("/user-page", { replace: true });
        }
      } catch {
        navigate("/login", { state: { from: { pathname: "/user/developer" } }, replace: true });
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [navigate, user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.clear();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-600">
            {lang === "en" ? "Loading dashboard..." : "Cargando panel..."}
          </span>
        </div>
      </div>
    );
  }

  const displayName = user?.displayName ?? user?.username ?? "Developer";
  const initial     = displayName[0]?.toUpperCase() ?? "D";

  // Placeholder data — replace with real API calls
  const projects = [
    { title: "E-commerce redesign",    client: "Acme Corp",     status: "active"  as const, budget: "$1,200", deadline: "Mar 20" },
    { title: "API integration",        client: "StartupXYZ",    status: "review"  as const, budget: "$600",   deadline: "Mar 15" },
    { title: "Landing page",           client: "LocalBiz",      status: "pending" as const, budget: "$350",   deadline: "Apr 1"  },
  ];

  const openProposals = [
    { title: "Build a SaaS dashboard with React + Supabase", budget: "$1,500–$2,500", stack: ["React", "Supabase", "TypeScript"], posted: lang === "en" ? "2h ago" : "Hace 2h" },
    { title: "WooCommerce store migration to Next.js",        budget: "$800–$1,200",   stack: ["Next.js", "Node.js", "MySQL"],     posted: lang === "en" ? "5h ago" : "Hace 5h" },
    { title: "Mobile-first landing page for restaurant",      budget: "$300–$500",     stack: ["HTML", "Tailwind", "JS"],          posted: lang === "en" ? "1d ago" : "Hace 1d" },
  ];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        {/* Bg grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-700 opacity-[0.04] blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-cyan-900/40 border border-cyan-700/40 flex items-center justify-center text-lg font-black text-cyan-300">
                  {initial}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white">{displayName}</h1>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-cyan-700/60 bg-cyan-950/30 text-cyan-400">
                    {lang === "en" ? "Developer" : "Dev"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <button className="px-4 py-2 text-xs font-black tracking-widest uppercase text-violet-300 border border-violet-700/50 hover:border-violet-500 rounded transition-all">
                  {lang === "en" ? "Edit profile" : "Editar perfil"}
                </button>
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-500 border border-violet-900/40 hover:border-violet-700/50 hover:text-gray-300 rounded transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1={21} y1={12} x2={9} y2={12}/></svg>
                {lang === "en" ? "Sign out" : "Salir"}
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="mb-3">
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600">
              {lang === "en" ? "Overview" : "Resumen"}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 mb-10">
            <Stat
              value="3"
              label={lang === "en" ? "Active projects" : "Proyectos activos"}
              trend={lang === "en" ? "+1 this week" : "+1 esta semana"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>}
            />
            <Stat
              value="$2,150"
              label={lang === "en" ? "Pending payout" : "Por cobrar"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1={12} y1={1} x2={12} y2={23}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
            />
            <Stat
              value="12"
              label={lang === "en" ? "Proposals sent" : "Propuestas"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1={22} y1={2} x2={11} y2={13}/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
            />
            <Stat
              value="4.9★"
              label={lang === "en" ? "Avg rating" : "Calificación"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
            />
          </div>

          {/* ── Two-col layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

            {/* Active projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600">
                  {lang === "en" ? "My projects" : "Mis proyectos"}
                </span>
                <Link to="/my-projects" className="text-[10px] font-black tracking-widest uppercase text-violet-400 hover:text-violet-300 transition-colors">
                  {lang === "en" ? "View all →" : "Ver todos →"}
                </Link>
              </div>
              <div className="border border-violet-900/40 bg-violet-950/10 rounded-xl p-5">
                {projects.map((p) => <ProjectRow key={p.title} {...p} lang={lang} />)}
              </div>
            </div>

            {/* Open proposals sidebar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600">
                  {lang === "en" ? "Open projects" : "Proyectos abiertos"}
                </span>
                <Link to="/projects" className="text-[10px] font-black tracking-widest uppercase text-violet-400 hover:text-violet-300 transition-colors">
                  {lang === "en" ? "Browse all →" : "Ver todos →"}
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {openProposals.map((p) => <ProposalCard key={p.title} {...p} lang={lang} />)}
              </div>
            </div>
          </div>

          {/* ── Wallet strip ── */}
          <div className="mt-10 relative flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border border-violet-800/40 rounded-xl bg-violet-950/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-900/40 border border-violet-700/40 flex items-center justify-center text-violet-400">
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={1} y={4} width={22} height={16} rx={2}/><line x1={1} y1={10} x2={23} y2={10}/></svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{lang === "en" ? "Wallet balance" : "Saldo en billetera"}</div>
                <div className="text-xl font-black text-white">$0.00</div>
              </div>
            </div>
            <button className="shrink-0 px-5 py-2.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all whitespace-nowrap">
              {lang === "en" ? "Withdraw funds" : "Retirar fondos"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default DeveloperDashboard;