import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({
  value, label, icon,
}) => (
  <div className="relative flex-1 min-w-[140px] p-5 border border-violet-900/40 bg-violet-950/10 rounded-lg overflow-hidden group hover:border-violet-700/50 transition-colors">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="text-gray-600 mb-3">{icon}</div>
    <div className="text-2xl font-black text-white">{value}</div>
    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 mt-0.5">{label}</div>
  </div>
);

const ActionCard: React.FC<{
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
}> = ({ title, description, cta, href, icon }) => (
  <a
    href={href}
    className="relative flex flex-col gap-3 p-6 border border-violet-900/40 bg-violet-950/10 rounded-lg overflow-hidden group hover:border-violet-600/50 hover:bg-violet-950/20 transition-all duration-200"
  >
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="text-violet-500 group-hover:text-violet-400 transition-colors">{icon}</div>
    <div>
      <h3 className="text-sm font-black text-white tracking-tight mb-1">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-violet-400 group-hover:text-violet-300 transition-colors mt-auto">
      {cta}
      <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  </a>
);

const UserPage: React.FC = () => {
  const { user, setUser } = useUser();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const isDev      = user?.role === "developer";
  const displayName = user?.displayName ?? user?.username ?? "User";
  const initial    = displayName[0]?.toUpperCase() ?? "U";

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.clear();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const stats = isDev
    ? [
        { value: "0",   label: lang === "en" ? "Active projects" : "Proyectos activos",  icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg> },
        { value: "0",   label: lang === "en" ? "Proposals sent"  : "Propuestas enviadas", icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1={22} y1={2} x2={11} y2={13}/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
        { value: "$0",  label: lang === "en" ? "Total earned"    : "Total ganado",         icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1={12} y1={1} x2={12} y2={23}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
      ]
    : [
        { value: "0",   label: lang === "en" ? "Active projects" : "Proyectos activos",   icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg> },
        { value: "0",   label: lang === "en" ? "Developers hired": "Devs contratados",    icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
        { value: "0",   label: lang === "en" ? "Open requests"   : "Solicitudes abiertas", icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12} y2={16}/></svg> },
      ];

  const actions = isDev
    ? [
        {
          title:       lang === "en" ? "Browse projects"    : "Ver proyectos",
          description: lang === "en" ? "Find businesses looking for your skills" : "Encontrá negocios que buscan tus habilidades",
          cta:         lang === "en" ? "Explore"            : "Explorar",
          href:        "/projects",
          icon: <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/></svg>,
        },
        {
          title:       lang === "en" ? "My profile"         : "Mi perfil",
          description: lang === "en" ? "Update your skills, portfolio and rates" : "Actualizá tus habilidades, portfolio y tarifas",
          cta:         lang === "en" ? "Edit"               : "Editar",
          href:        "/profile",
          icon: <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx={12} cy={7} r={4}/></svg>,
        },
        {
          title:       lang === "en" ? "Earnings"           : "Ganancias",
          description: lang === "en" ? "Track payments and invoices"             : "Seguí tus pagos y facturas",
          cta:         lang === "en" ? "View"               : "Ver",
          href:        "/earnings",
          icon: <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={1} y={4} width={22} height={16} rx={2}/><line x1={1} y1={10} x2={23} y2={10}/></svg>,
        },
      ]
    : [
        {
          title:       lang === "en" ? "Post a project"     : "Publicar proyecto",
          description: lang === "en" ? "Describe what you need and get proposals" : "Describí lo que necesitás y recibí propuestas",
          cta:         lang === "en" ? "Post"               : "Publicar",
          href:        "/post-project",
          icon: <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={16}/><line x1={8} y1={12} x2={16} y2={12}/></svg>,
        },
        {
          title:       lang === "en" ? "Find developers"    : "Buscar desarrolladores",
          description: lang === "en" ? "Browse vetted devs by skill and rate"    : "Explorá devs verificados por habilidad y tarifa",
          cta:         lang === "en" ? "Browse"             : "Explorar",
          href:        "/developers",
          icon: <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
        },
        {
          title:       lang === "en" ? "My projects"        : "Mis proyectos",
          description: lang === "en" ? "Track progress on all your active work"  : "Seguí el progreso de todo tu trabajo activo",
          cta:         lang === "en" ? "View"               : "Ver",
          href:        "/my-projects",
          icon: <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>,
        },
      ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-violet-900/50 border border-violet-700/50 flex items-center justify-center text-xl font-black text-violet-300">
                {initial}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-violet-500 border-2 border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">{displayName}</h1>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${
                  isDev
                    ? "border-cyan-700/60 bg-cyan-950/30 text-cyan-400"
                    : "border-violet-700/60 bg-violet-950/30 text-violet-400"
                }`}>
                  {isDev ? (lang === "en" ? "Developer" : "Dev") : (lang === "en" ? "Business" : "Negocio")}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-500 border border-violet-900/40 hover:border-violet-700/50 hover:text-gray-300 rounded transition-all self-start sm:self-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1={21} y1={12} x2={9} y2={12}/>
            </svg>
            {lang === "en" ? "Sign out" : "Salir"}
          </button>
        </div>

        <div className="mb-3">
          <h2 className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600 mb-4">
            {lang === "en" ? "Overview" : "Resumen"}
          </h2>
          <div className="flex flex-wrap gap-4">
            {stats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-violet-900/50 to-transparent my-10" />

        <div>
          <h2 className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600 mb-4">
            {lang === "en" ? "Quick actions" : "Acciones rápidas"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((a) => <ActionCard key={a.title} {...a} />)}
          </div>
        </div>

        <div className="mt-12 p-5 border border-violet-900/30 rounded-lg bg-violet-950/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-black text-white tracking-tight mb-0.5">
              {lang === "en" ? "Account settings" : "Configuración de cuenta"}
            </h3>
            <p className="text-[10px] text-gray-600">
              {lang === "en" ? "Update email, password or notification preferences" : "Actualizá email, contraseña o preferencias de notificaciones"}
            </p>
          </div>
          <a
            href="/settings"
            className="shrink-0 px-5 py-2.5 text-xs font-black tracking-widest uppercase text-violet-300 border border-violet-700/50 hover:border-violet-500 hover:bg-violet-900/20 rounded transition-all"
          >
            {lang === "en" ? "Settings" : "Ajustes"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserPage;