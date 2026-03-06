import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import Nav from "@/components/Nav";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type ProjectStatus = "open" | "in_progress" | "review" | "completed" | "cancelled";

interface Project {
  id:          string;
  title:       string;
  category:    string;
  budget:      string;
  timeline:    string;
  status:      ProjectStatus;
  proposals:   number;
  postedAt:    string;        // ISO string — format on render
  visibility:  "public" | "invite";
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder data — replace body of fetchProjects() with real API call
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PROJECTS: Project[] = [
  {
    id:          "proj_001",
    title:       "E-commerce store for clothing brand",
    category:    "ecommerce",
    budget:      "$500 – $2,000",
    timeline:    "1 – 3 months",
    status:      "open",
    proposals:   4,
    postedAt:    new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    visibility:  "public",
    description: "Need a full Shopify or WooCommerce store with custom theme...",
  },
  {
    id:          "proj_002",
    title:       "Landing page redesign",
    category:    "landing",
    budget:      "Under $500",
    timeline:    "Within 1 month",
    status:      "in_progress",
    proposals:   7,
    postedAt:    new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    visibility:  "public",
    description: "Redesign of our current landing page to improve conversion...",
  },
  {
    id:          "proj_003",
    title:       "Internal inventory management app",
    category:    "webapp",
    budget:      "$2,000 – $10,000",
    timeline:    "3 – 6 months",
    status:      "review",
    proposals:   2,
    postedAt:    new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    visibility:  "invite",
    description: "Custom web app to manage inventory across 3 warehouses...",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// API stub — swap these with your real endpoints
// ─────────────────────────────────────────────────────────────────────────────
async function fetchProjects(_userId: string): Promise<Project[]> {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`/api/projects?userId=${_userId}`, {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // return res.json();
  await new Promise((r) => setTimeout(r, 600)); // simulate latency
  return MOCK_PROJECTS;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<ProjectStatus, { label_en: string; label_es: string; color: string }> = {
  open:        { label_en: "Open",        label_es: "Abierto",     color: "text-emerald-400 border-emerald-800/50 bg-emerald-950/20" },
  in_progress: { label_en: "In progress", label_es: "En progreso", color: "text-blue-400    border-blue-800/50    bg-blue-950/20"    },
  review:      { label_en: "In review",   label_es: "En revisión", color: "text-amber-400   border-amber-800/50   bg-amber-950/20"   },
  completed:   { label_en: "Completed",   label_es: "Completado",  color: "text-gray-400    border-gray-700/50    bg-gray-900/20"    },
  cancelled:   { label_en: "Cancelled",   label_es: "Cancelado",   color: "text-red-400     border-red-900/50     bg-red-950/20"     },
};

const CATEGORY_LABELS: Record<string, { en: string; es: string }> = {
  landing:   { en: "Landing page",   es: "Landing page"  },
  ecommerce: { en: "E-commerce",     es: "E-commerce"    },
  webapp:    { en: "Web app",        es: "App web"       },
  mobile:    { en: "Mobile",         es: "Móvil"         },
  api:       { en: "API / Backend",  es: "API / Backend" },
  support:   { en: "Support",        es: "Soporte"       },
  design:    { en: "Design",         es: "Diseño"        },
  other:     { en: "Other",          es: "Otro"          },
};

function relativeDate(iso: string, lang: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return lang === "en" ? "Today"            : "Hoy";
  if (days === 1) return lang === "en" ? "Yesterday"        : "Ayer";
  if (days < 7)  return lang === "en" ? `${days}d ago`      : `Hace ${days}d`;
  if (days < 30) return lang === "en" ? `${Math.floor(days/7)}w ago` : `Hace ${Math.floor(days/7)} sem`;
  return new Date(iso).toLocaleDateString(lang === "en" ? "en-US" : "es-AR", { month: "short", day: "numeric" });
}

// ─────────────────────────────────────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────────────────────────────────────
const StatCard: React.FC<{ value: string | number; label: string; icon: React.ReactNode; accent?: boolean }> = ({
  value, label, icon, accent,
}) => (
  <div className={`relative flex-1 min-w-[130px] p-5 border rounded-xl overflow-hidden group transition-colors ${accent ? "border-violet-600/50 bg-violet-950/20 hover:border-violet-500/60" : "border-violet-900/40 bg-violet-950/10 hover:border-violet-700/50"}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className={`mb-3 ${accent ? "text-violet-500" : "text-gray-600"}`}>{icon}</div>
    <div className={`text-2xl font-black ${accent ? "text-violet-300" : "text-white"}`}>{value}</div>
    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 mt-0.5">{label}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Project row (table view)
// ─────────────────────────────────────────────────────────────────────────────
const ProjectRow: React.FC<{
  project: Project;
  lang: string;
  onDelete: (id: string) => void;
}> = ({ project, lang, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = STATUS_CFG[project.status];
  const cat = CATEGORY_LABELS[project.category] ?? { en: project.category, es: project.category };

  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-violet-900/20 last:border-0 hover:bg-violet-950/10 px-3 -mx-3 rounded transition-colors group">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white truncate">{project.title}</span>
          {project.visibility === "invite" && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border border-amber-800/40 bg-amber-950/20 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              {lang === "en" ? "Invite" : "Invitación"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-gray-600">{lang === "en" ? cat.en : cat.es}</span>
          <span className="text-[10px] text-gray-700">·</span>
          <span className="text-[10px] text-gray-600">{project.budget}</span>
          <span className="text-[10px] text-gray-700">·</span>
          <span className="text-[10px] text-gray-600">{relativeDate(project.postedAt, lang)}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Proposals badge */}
        {project.proposals > 0 && (
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-violet-900/30 border border-violet-800/40 text-[10px] font-black text-violet-300">
            <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {project.proposals} {lang === "en" ? "proposals" : "propuestas"}
          </span>
        )}

        {/* Status badge */}
        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${cfg.color}`}>
          {lang === "en" ? cfg.label_en : cfg.label_es}
        </span>

        {/* Actions menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded border border-violet-900/40 hover:border-violet-700/50 text-gray-600 hover:text-gray-300 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={5} r={1}/><circle cx={12} cy={12} r={1}/><circle cx={12} cy={19} r={1}/></svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 border border-violet-900/50 bg-black rounded-lg shadow-xl overflow-hidden">
                <Link to={`/pub-project?edit=${project.id}`} onClick={() => setMenuOpen(false)}>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-violet-950/40 transition-colors text-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    {lang === "en" ? "Edit" : "Editar"}
                  </button>
                </Link>
                <button
                  onClick={() => { onDelete(project.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors text-left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                  {lang === "en" ? "Delete" : "Eliminar"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────
const EmptyProjects: React.FC<{ lang: string }> = ({ lang }) => (
  <div className="flex flex-col items-center gap-5 py-16 text-center">
    <div className="w-16 h-16 rounded-xl border border-violet-900/40 bg-violet-950/10 flex items-center justify-center text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>
    </div>
    <div>
      <h3 className="text-sm font-black text-white mb-1">
        {lang === "en" ? "No projects yet" : "Sin proyectos aún"}
      </h3>
      <p className="text-xs text-gray-600 max-w-xs">
        {lang === "en"
          ? "Post your first project and start receiving proposals from vetted developers."
          : "Publicá tu primer proyecto y empezá a recibir propuestas de desarrolladores verificados."}
      </p>
    </div>
    <Link to="/pub-project">
      <button className="px-6 py-2.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all">
        {lang === "en" ? "Post a project" : "Publicar proyecto"}
      </button>
    </Link>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Filter tab
// ─────────────────────────────────────────────────────────────────────────────
const FilterTab: React.FC<{ label: string; count: number; active: boolean; onClick: () => void }> = ({
  label, count, active, onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all border ${
      active
        ? "border-violet-600/60 bg-violet-950/40 text-violet-300"
        : "border-transparent text-gray-600 hover:text-gray-400"
    }`}
  >
    {label}
    {count > 0 && (
      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${active ? "bg-violet-600/30 text-violet-300" : "bg-violet-900/30 text-gray-600"}`}>
        {count}
      </span>
    )}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// BusinessDashboard
// ─────────────────────────────────────────────────────────────────────────────
const BusinessDashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const { lang }          = useLanguage();
  const navigate          = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<ProjectStatus | "all">("all");

  // Guard: if a developer lands here, send them to their dashboard
  useEffect(() => {
    if (user?.role === "developer" && user?.sub) {
      navigate(`/user/developer/${user.sub}`, { replace: true });
    }
  }, [user, navigate]);

  // Fetch projects on mount — replace with real API when ready
  useEffect(() => {
    if (!user?.sub) return;
    setLoading(true);
    fetchProjects(user.sub)
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [user?.sub]);

  const handleDelete = (id: string) => {
    // TODO: call DELETE /api/projects/:id, then refetch
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const counts = {
    all:         projects.length,
    open:        projects.filter((p) => p.status === "open").length,
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    review:      projects.filter((p) => p.status === "review").length,
    completed:   projects.filter((p) => p.status === "completed").length,
  };

  const totalProposals = projects.reduce((acc, p) => acc + p.proposals, 0);

  const displayName = user?.displayName ?? user?.username ?? "User";
  const initial     = displayName[0]?.toUpperCase() ?? "U";

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

  const t = {
    overview:    lang === "en" ? "Overview"         : "Resumen",
    myProjects:  lang === "en" ? "My projects"      : "Mis proyectos",
    postProject: lang === "en" ? "Post project"     : "Publicar proyecto",
    signOut:     lang === "en" ? "Sign out"         : "Salir",
    settings:    lang === "en" ? "Settings"         : "Ajustes",
    allFilter:   lang === "en" ? "All"              : "Todos",
    filterOpen:  lang === "en" ? "Open"             : "Abiertos",
    filterIP:    lang === "en" ? "In progress"      : "En progreso",
    filterRev:   lang === "en" ? "In review"        : "En revisión",
    filterDone:  lang === "en" ? "Completed"        : "Completados",
    loading:     lang === "en" ? "Loading projects…": "Cargando proyectos…",
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={displayName} className="w-12 h-12 rounded-xl object-cover border border-violet-700/50" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-violet-900/50 border border-violet-700/50 flex items-center justify-center text-lg font-black text-violet-300">
                    {initial}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-violet-500 border-2 border-black" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white">{displayName}</h1>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-violet-700/60 bg-violet-950/30 text-violet-400">
                    {lang === "en" ? "Business" : "Negocio"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/pub-project">
                <button className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-widest uppercase rounded transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/></svg>
                  {t.postProject}
                </button>
              </Link>
              <Link to="/settings">
                <button className="p-2 border border-violet-900/40 hover:border-violet-700/50 text-gray-500 hover:text-gray-300 rounded transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={3}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-widest uppercase text-gray-500 border border-violet-900/40 hover:border-violet-700/50 hover:text-gray-300 rounded transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1={21} y1={12} x2={9} y2={12}/></svg>
                {t.signOut}
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <h2 className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600 mb-3">{t.overview}</h2>
          <div className="flex flex-wrap gap-3 mb-10">
            <StatCard
              value={counts.all}
              label={lang === "en" ? "Total projects" : "Proyectos totales"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>}
            />
            <StatCard
              value={counts.open}
              label={lang === "en" ? "Open"           : "Abiertos"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></svg>}
              accent
            />
            <StatCard
              value={counts.in_progress}
              label={lang === "en" ? "In progress"    : "En progreso"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
            />
            <StatCard
              value={totalProposals}
              label={lang === "en" ? "Proposals rcvd" : "Propuestas rcbd"}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            />
          </div>

          {/* ── Projects ── */}
          <div className="border border-violet-900/40 bg-violet-950/10 rounded-xl overflow-hidden">

            {/* Table header */}
            <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4 border-b border-violet-900/30">
              <h2 className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600">{t.myProjects}</h2>

              {/* Filter tabs */}
              <div className="flex items-center gap-1 flex-wrap justify-end">
                <FilterTab label={t.allFilter}  count={counts.all}         active={filter === "all"}         onClick={() => setFilter("all")}         />
                <FilterTab label={t.filterOpen} count={counts.open}        active={filter === "open"}        onClick={() => setFilter("open")}        />
                <FilterTab label={t.filterIP}   count={counts.in_progress} active={filter === "in_progress"} onClick={() => setFilter("in_progress")} />
                <FilterTab label={t.filterRev}  count={counts.review}      active={filter === "review"}      onClick={() => setFilter("review")}      />
                <FilterTab label={t.filterDone} count={counts.completed}   active={filter === "completed"}   onClick={() => setFilter("completed")}   />
              </div>
            </div>

            <div className="px-5 py-2 min-h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-gray-600">
                  <div className="w-5 h-5 border border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">{t.loading}</span>
                </div>
              ) : filtered.length === 0 ? (
                <EmptyProjects lang={lang} />
              ) : (
                filtered.map((p) => (
                  <ProjectRow key={p.id} project={p} lang={lang} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>

          <div className="mt-8 p-5 border border-violet-900/30 rounded-xl bg-violet-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-black text-white tracking-tight mb-0.5">
                {lang === "en" ? "Account settings" : "Configuración de cuenta"}
              </h3>
              <p className="text-[10px] text-gray-600">
                {lang === "en" ? "Update username, password or avatar" : "Actualizá nombre de usuario, contraseña o avatar"}
              </p>
            </div>
            <Link to="/settings" className="shrink-0 px-5 py-2.5 text-xs font-black tracking-widest uppercase text-violet-300 border border-violet-700/50 hover:border-violet-500 hover:bg-violet-900/20 rounded transition-all">
              {t.settings}
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default BusinessDashboard;