import { useState } from "react";
import { useTurnstile } from "@/hooks/useTurnStile";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createProject } from "@/api/projects";

// ── Types ───────────────────────────────────────────────────────────────────
type Category   = "landing" | "ecommerce" | "webapp" | "mobile" | "api" | "support" | "design" | "other";
type Budget     = "under500" | "500_2k" | "2k_10k" | "10k_plus" | "negotiable";
type Timeline   = "asap" | "1month" | "3months" | "6months" | "ongoing";
type Visibility = "public" | "invite";

interface FormState {
  title:       string;
  category:    Category | null;
  description: string;
  skills:      string[];
  budget:      Budget | null;
  timeline:    Timeline | null;
  visibility:  Visibility;
}

// Budget / timeline → human-readable label (sent to the API as-is)
const BUDGET_LABELS: Record<Budget, string> = {
  under500:   "Under $500",
  "500_2k":   "$500 – $2,000",
  "2k_10k":   "$2,000 – $10,000",
  "10k_plus":  "$10,000+",
  negotiable: "Negotiable",
};
const TIMELINE_LABELS: Record<Timeline, string> = {
  asap:     "ASAP",
  "1month":  "Within 1 month",
  "3months": "1 – 3 months",
  "6months": "3 – 6 months",
  ongoing:  "Ongoing",
};

// ── Reusable components ─────────────────────────────────────────────────────
const Field: React.FC<{
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}> = ({ label, required, hint, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">
        {label}{required && <span className="text-violet-500 ml-1">*</span>}
      </label>
      {hint && <span className="text-[10px] text-gray-600">{hint}</span>}
    </div>
    {children}
    {error && (
      <span className="flex items-center gap-1.5 text-[10px] text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12} y2={16}/></svg>
        {error}
      </span>
    )}
  </div>
);

const Input: React.FC<{
  value: string; onChange: (v: string) => void;
  placeholder?: string; error?: boolean; maxLength?: number;
}> = ({ value, onChange, placeholder, error, maxLength }) => (
  <input
    type="text" value={value} onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder} maxLength={maxLength}
    className={`w-full px-4 py-3 bg-violet-950/20 border rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-colors ${
      error ? "border-red-500/60 focus:border-red-500" : "border-violet-900/50 focus:border-violet-500/70"
    }`}
  />
);

const Textarea: React.FC<{
  value: string; onChange: (v: string) => void;
  placeholder?: string; rows?: number; error?: boolean; maxLength?: number;
}> = ({ value, onChange, placeholder, rows = 5, error, maxLength }) => (
  <textarea
    value={value} onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder} rows={rows} maxLength={maxLength}
    className={`w-full px-4 py-3 bg-violet-950/20 border rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-colors resize-none ${
      error ? "border-red-500/60" : "border-violet-900/50 focus:border-violet-500/70"
    }`}
  />
);

const OptionChip: React.FC<{
  label: string; selected: boolean; onClick: () => void;
  icon?: React.ReactNode; description?: string;
}> = ({ label, selected, onClick, icon, description }) => (
  <button
    type="button" onClick={onClick}
    className={`relative flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all duration-150 group ${
      selected
        ? "border-violet-500/70 bg-violet-950/40 text-violet-300"
        : "border-violet-900/40 bg-violet-950/10 text-gray-500 hover:border-violet-700/50 hover:text-gray-300"
    }`}
  >
    {selected && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent rounded-t-lg" />}
    {icon && <span className={`mt-0.5 shrink-0 ${selected ? "text-violet-400" : "text-gray-700 group-hover:text-gray-500"}`}>{icon}</span>}
    <span className="flex flex-col gap-0.5">
      <span className={`text-xs font-bold leading-none ${selected ? "text-violet-200" : ""}`}>{label}</span>
      {description && <span className="text-[10px] text-gray-600 leading-relaxed">{description}</span>}
    </span>
    {selected && (
      <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full bg-violet-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width={7} height={7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5}><polyline points="20 6 9 17 4 12"/></svg>
      </span>
    )}
  </button>
);

// ── Skill tag input ─────────────────────────────────────────────────────────
const SUGGESTED_SKILLS = [
  "React","Next.js","TypeScript","JavaScript","Node.js",
  "Python","Django","PostgreSQL","MongoDB","AWS",
  "Docker","Tailwind CSS","PHP","Laravel","Vue.js",
  "React Native","Swift","GraphQL","Figma","Shopify",
];

const SkillInput: React.FC<{ skills: string[]; onChange: (s: string[]) => void; lang: string }> = ({
  skills, onChange, lang,
}) => {
  const [input, setInput] = useState("");

  const add = (skill: string) => {
    const t = skill.trim();
    if (t && !skills.includes(t) && skills.length < 10) onChange([...skills, t]);
    setInput("");
  };
  const remove = (s: string) => onChange(skills.filter((x) => x !== s));

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) { e.preventDefault(); add(input); }
    if (e.key === "Backspace" && !input && skills.length) remove(skills[skills.length - 1]);
  };

  const suggestions = SUGGESTED_SKILLS.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !skills.includes(s)
  ).slice(0, 6);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 min-h-[48px] px-3 py-2.5 bg-violet-950/20 border border-violet-900/50 focus-within:border-violet-500/70 rounded transition-colors">
        {skills.map((s) => (
          <span key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-violet-900/50 border border-violet-700/50 text-[11px] font-semibold text-violet-200">
            {s}
            <button type="button" onClick={() => remove(s)} className="text-violet-500 hover:text-violet-300 leading-none">×</button>
          </span>
        ))}
        <input
          value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
          placeholder={skills.length === 0 ? (lang === "en" ? "Type a skill and press Enter…" : "Escribí una habilidad y presioná Enter…") : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
        />
      </div>
      {input.length > 0 && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button type="button" key={s} onClick={() => add(s)}
              className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded border border-violet-800/50 bg-violet-950/30 text-gray-500 hover:text-violet-300 hover:border-violet-600/50 transition-all">
              + {s}
            </button>
          ))}
        </div>
      )}
      {input.length === 0 && skills.length < 10 && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
            <button type="button" key={s} onClick={() => add(s)}
              className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded border border-violet-900/40 bg-violet-950/10 text-gray-600 hover:text-gray-300 hover:border-violet-700/50 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}
      <span className="text-[10px] text-gray-700">{skills.length}/10 {lang === "en" ? "skills added" : "habilidades agregadas"}</span>
    </div>
  );
};

// ── Section wrapper ─────────────────────────────────────────────────────────
const Section: React.FC<{ number: string; title: string; sub?: string; children: React.ReactNode }> = ({
  number, title, sub, children,
}) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-start gap-4">
      <span className="text-[10px] font-black text-gray-700 w-5 shrink-0 mt-0.5">{number}</span>
      <div>
        <h2 className="text-sm font-black text-white tracking-tight">{title}</h2>
        {sub && <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{sub}</p>}
      </div>
    </div>
    <div className="pl-9 flex flex-col gap-5">{children}</div>
  </div>
);

// ── Live preview ────────────────────────────────────────────────────────────
const PreviewCard: React.FC<{ form: FormState; lang: string; postedAt: string }> = ({ form, lang, postedAt }) => (
  <div className="sticky top-24 flex flex-col gap-4 p-6 border border-violet-900/40 bg-violet-950/10 rounded-xl overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent" />
    <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600">
      {lang === "en" ? "Live preview" : "Vista previa"}
    </span>
    <div>
      <h3 className="text-sm font-black text-white leading-snug mb-1">
        {form.title || (lang === "en" ? "Project title…" : "Título del proyecto…")}
      </h3>
      <p className="text-[10px] text-gray-600">{postedAt}</p>
    </div>
    {form.category && (
      <span className="w-fit px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-violet-700/50 bg-violet-950/30 text-violet-400">
        {form.category}
      </span>
    )}
    {form.description && (
      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-4">{form.description}</p>
    )}
    {form.skills.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {form.skills.map((s) => (
          <span key={s} className="px-2 py-0.5 text-[9px] font-bold rounded border border-violet-900/50 bg-violet-950/20 text-gray-500">{s}</span>
        ))}
      </div>
    )}
    <div className="flex flex-col gap-1.5 pt-1 border-t border-violet-900/30">
      {form.budget && (
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-600">{lang === "en" ? "Budget" : "Presupuesto"}</span>
          <span className="font-semibold text-gray-400">{BUDGET_LABELS[form.budget]}</span>
        </div>
      )}
      {form.timeline && (
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-600">{lang === "en" ? "Timeline" : "Plazo"}</span>
          <span className="font-semibold text-gray-400">{TIMELINE_LABELS[form.timeline]}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gray-600">{lang === "en" ? "Visibility" : "Visibilidad"}</span>
        <span className={`font-semibold ${form.visibility === "public" ? "text-emerald-400" : "text-amber-400"}`}>
          {form.visibility === "public" ? (lang === "en" ? "Public" : "Público") : (lang === "en" ? "Invite only" : "Solo invitación")}
        </span>
      </div>
    </div>
  </div>
);

// ── PostProject ─────────────────────────────────────────────────────────────
const PostProject: React.FC = () => {
  const { lang }   = useLanguage();
  const { user }   = useUser();
  const navigate   = useNavigate();
  const { getToken, WidgetSlot } = useTurnstile();

  const now      = new Date();
  const postedAt = now.toLocaleDateString(lang === "en" ? "en-US" : "es-AR", {
    year: "numeric", month: "long", day: "numeric",
  });

  const [form, setForm] = useState<FormState>({
    title: "", category: null, description: "",
    skills: [], budget: null, timeline: null, visibility: "public",
  });
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState("");
  const [createdId,  setCreatedId]  = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim() || form.title.length < 10)
      e.title       = lang === "en" ? "Title must be at least 10 characters" : "El título debe tener al menos 10 caracteres";
    if (!form.category)
      e.category    = lang === "en" ? "Select a category"                    : "Seleccioná una categoría";
    if (!form.description.trim() || form.description.length < 50)
      e.description = lang === "en" ? "Description must be at least 50 characters" : "La descripción debe tener al menos 50 caracteres";
    if (!form.budget)
      e.budget      = lang === "en" ? "Select a budget range"                : "Seleccioná un rango de presupuesto";
    if (!form.timeline)
      e.timeline    = lang === "en" ? "Select a timeline"                    : "Seleccioná un plazo";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");

    try {
      const cfToken = await getToken();
      if (!cfToken) {
        setApiError(lang === "en" ? "Bot check failed — please try again" : "Verificación fallida — intentá de nuevo");
        setLoading(false);
        return;
      }

      const result = await createProject({
        title:             form.title.trim(),
        category:          form.category!,
        description:       form.description.trim(),
        skills:            form.skills,
        budget:            form.budget ? BUDGET_LABELS[form.budget] : null,
        timeline:          form.timeline ? TIMELINE_LABELS[form.timeline] : null,
        visibility:        form.visibility,
        cf_turnstile_token: cfToken,
      });

      setCreatedId(result.id);
    } catch (err: any) {
      setApiError(err.message ?? (lang === "en" ? "Something went wrong. Try again." : "Algo salió mal. Intentá de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  const t = {
    eyebrow:     lang === "en" ? "Post a project"            : "Publicar proyecto",
    heading:     lang === "en" ? "Describe what you need"    : "Describí lo que necesitás",
    sub:         lang === "en" ? "The more detail you provide, the better the proposals you'll receive." : "Cuanto más detalle brindás, mejores propuestas vas a recibir.",
    s1title:     lang === "en" ? "Project basics"            : "Datos básicos",
    s1sub:       lang === "en" ? "Give your project a clear, specific title." : "Dale a tu proyecto un título claro y específico.",
    s2title:     lang === "en" ? "Project description"       : "Descripción del proyecto",
    s2sub:       lang === "en" ? "Describe what you want built and any technical context." : "Describí qué querés construir y cualquier contexto técnico.",
    s3title:     lang === "en" ? "Scope & timeline"          : "Alcance y plazo",
    s3sub:       lang === "en" ? "Help developers understand the size and urgency." : "Ayudá a los desarrolladores a entender el tamaño y la urgencia.",
    s4title:     lang === "en" ? "Visibility"                : "Visibilidad",
    s4sub:       lang === "en" ? "Choose who can see and apply to your project." : "Elegí quién puede ver y postularse a tu proyecto.",
    submit:      lang === "en" ? "Post project"              : "Publicar proyecto",
    submitting:  lang === "en" ? "Publishing…"               : "Publicando…",
    doneTitle:   lang === "en" ? "Project published!"        : "¡Proyecto publicado!",
    doneSub:     lang === "en" ? "Your project is live. Developers will start sending proposals shortly." : "Tu proyecto ya está publicado. Los desarrolladores comenzarán a enviarte propuestas pronto.",
    viewDash:    lang === "en" ? "Go to my dashboard"        : "Ir a mi panel",
    postAnother: lang === "en" ? "Post another project"      : "Publicar otro proyecto",
    cancel:      lang === "en" ? "Cancel"                    : "Cancelar",
  };

  const categories: { value: Category; label: string; icon: React.ReactNode }[] = [
    { value: "landing",   label: lang === "en" ? "Landing page / Website" : "Landing page / Sitio web", icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={18} height={18} rx={2}/><line x1={3} y1={9} x2={21} y2={9}/><line x1={9} y1={21} x2={9} y2={9}/></svg> },
    { value: "ecommerce", label: "E-commerce",                                                           icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={9} cy={21} r={1}/><circle cx={20} cy={21} r={1}/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
    { value: "webapp",    label: lang === "en" ? "Custom web app"          : "App web a medida",         icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
    { value: "mobile",    label: lang === "en" ? "Mobile app"              : "App móvil",                icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={5} y={2} width={14} height={20} rx={2}/><line x1={12} y1={18} x2={12} y2={18}/></svg> },
    { value: "api",       label: lang === "en" ? "API / Backend"           : "API / Backend",            icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><ellipse cx={12} cy={5} rx={9} ry={3}/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
    { value: "support",   label: lang === "en" ? "Technical support"       : "Soporte técnico",          icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { value: "design",    label: lang === "en" ? "UI / UX Design"          : "Diseño UI / UX",           icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><circle cx={12} cy={12} r={3}/></svg> },
    { value: "other",     label: lang === "en" ? "Other"                   : "Otro",                     icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={1}/><circle cx={19} cy={12} r={1}/><circle cx={5} cy={12} r={1}/></svg> },
  ];

  const budgets: { value: Budget; label: string }[] = [
    { value: "under500",   label: lang === "en" ? "Under $500"  : "Menos de $500" },
    { value: "500_2k",     label: "$500 – $2,000"                                 },
    { value: "2k_10k",     label: "$2,000 – $10,000"                              },
    { value: "10k_plus",   label: lang === "en" ? "$10,000+"    : "$10.000+"      },
    { value: "negotiable", label: lang === "en" ? "Negotiable"  : "A negociar"   },
  ];

  const timelines: { value: Timeline; label: string; description: string }[] = [
    { value: "asap",    label: lang === "en" ? "ASAP"           : "Lo antes posible", description: lang === "en" ? "Start immediately"    : "Empezar de inmediato"       },
    { value: "1month",  label: lang === "en" ? "Within 1 month" : "En 1 mes",          description: lang === "en" ? "Flexible start"       : "Inicio flexible"           },
    { value: "3months", label: lang === "en" ? "1 – 3 months"   : "1 – 3 meses",       description: lang === "en" ? "Planning stage"       : "Etapa de planificación"    },
    { value: "6months", label: lang === "en" ? "3 – 6 months"   : "3 – 6 meses",       description: lang === "en" ? "Long-term project"    : "Proyecto a largo plazo"    },
    { value: "ongoing", label: lang === "en" ? "Ongoing"        : "Continuo",          description: lang === "en" ? "No set end date"      : "Sin fecha de fin"          },
  ];

  // ── Success screen ──
  if (createdId) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center relative overflow-hidden px-6">
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-violet-600 opacity-20 blur-md" />
              <div className="relative w-full h-full rounded-full border border-violet-600/50 bg-violet-950/40 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-violet-400">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-3">{t.doneTitle}</h1>
              <p className="text-sm text-gray-500 leading-relaxed">{t.doneSub}</p>
              <p className="text-[10px] text-gray-700 mt-2 font-mono">id: {createdId}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link to="/user/business" className="flex-1">
                <button className="w-full py-3 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all">
                  {t.viewDash}
                </button>
              </Link>
              <button
                onClick={() => {
                  setForm({ title: "", category: null, description: "", skills: [], budget: null, timeline: null, visibility: "public" });
                  setErrors({});
                  setCreatedId(null);
                }}
                className="flex-1 py-3 border border-violet-700/50 hover:border-violet-500 text-violet-300 font-black text-xs tracking-[0.2em] uppercase rounded transition-all"
              >
                {t.postAnother}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-violet-700" />
              <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600">{t.eyebrow}</span>
            </div>
            <h1 className="font-black text-white tracking-tight mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              {t.heading}
            </h1>
            <p className="text-sm text-gray-500">{t.sub}</p>

            {/* Who / when */}
            <div className="flex items-center gap-3 mt-5 text-[11px] text-gray-600">
              <div className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-700/40 flex items-center justify-center text-[9px] font-black text-violet-300 uppercase">
                {(user?.displayName?.[0] ?? user?.username?.[0] ?? "U").toUpperCase()}
              </div>
              <span>{user?.displayName ?? user?.username}</span>
              <span className="text-gray-700">·</span>
              <span>{postedAt}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-12" noValidate>

              {/* 01 */}
              <Section number="01" title={t.s1title} sub={t.s1sub}>
                <Field label={lang === "en" ? "Project title" : "Título del proyecto"} required hint={`${form.title.length}/100`} error={errors.title}>
                  <Input value={form.title} onChange={(v) => set("title", v)} placeholder={lang === "en" ? "e.g. E-commerce store for a clothing brand" : "ej. Tienda online para marca de ropa"} maxLength={100} error={!!errors.title} />
                </Field>
                <Field label={lang === "en" ? "Project category" : "Categoría"} required error={errors.category}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {categories.map((c) => (
                      <OptionChip key={c.value} label={c.label} icon={c.icon} selected={form.category === c.value} onClick={() => set("category", c.value)} />
                    ))}
                  </div>
                </Field>
              </Section>

              <div className="h-px bg-violet-900/30" />

              {/* 02 */}
              <Section number="02" title={t.s2title} sub={t.s2sub}>
                <Field label={lang === "en" ? "Description" : "Descripción"} required hint={`${form.description.length}/2000`} error={errors.description}>
                  <Textarea
                    value={form.description} onChange={(v) => set("description", v)} rows={6} maxLength={2000} error={!!errors.description}
                    placeholder={lang === "en" ? "Tell developers what you need built, any existing systems, design preferences…" : "Contales a los desarrolladores qué necesitás construir, con qué sistemas integrarse, preferencias de diseño…"}
                  />
                </Field>
                <Field label={lang === "en" ? "Required skills" : "Habilidades requeridas"}>
                  <SkillInput skills={form.skills} onChange={(s) => set("skills", s)} lang={lang} />
                </Field>
              </Section>

              <div className="h-px bg-violet-900/30" />

              {/* 03 */}
              <Section number="03" title={t.s3title} sub={t.s3sub}>
                <Field label={lang === "en" ? "Budget range" : "Rango de presupuesto"} required error={errors.budget}>
                  <div className="flex flex-wrap gap-2">
                    {budgets.map((b) => (
                      <OptionChip key={b.value} label={b.label} selected={form.budget === b.value} onClick={() => set("budget", b.value)} />
                    ))}
                  </div>
                </Field>
                <Field label={lang === "en" ? "Timeline" : "Plazo estimado"} required error={errors.timeline}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {timelines.map((tl) => (
                      <OptionChip key={tl.value} label={tl.label} description={tl.description} selected={form.timeline === tl.value} onClick={() => set("timeline", tl.value)} />
                    ))}
                  </div>
                </Field>
              </Section>

              <div className="h-px bg-violet-900/30" />

              {/* 04 */}
              <Section number="04" title={t.s4title} sub={t.s4sub}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <OptionChip
                    label={lang === "en" ? "Public" : "Público"}
                    description={lang === "en" ? "All verified developers can see and apply" : "Todos los devs verificados pueden ver y aplicar"}
                    selected={form.visibility === "public"} onClick={() => set("visibility", "public")}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><line x1={2} y1={12} x2={22} y2={12}/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
                  />
                  <OptionChip
                    label={lang === "en" ? "Invite only" : "Solo por invitación"}
                    description={lang === "en" ? "Only developers you invite can apply" : "Solo los devs que invités pueden aplicar"}
                    selected={form.visibility === "invite"} onClick={() => set("visibility", "invite")}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                  />
                </div>
              </Section>

              {/* API error */}
              {apiError && (
                <div className="flex items-center gap-3 px-4 py-3 border border-red-800/50 bg-red-950/20 rounded text-xs text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12} y2={16}/></svg>
                  {apiError}
                </div>
              )}

              {/* Submit */}
              <WidgetSlot />
              <div className="flex flex-col sm:flex-row gap-4 items-center pt-2 pb-12">
                <button
                  type="submit" disabled={loading}
                  className="w-full sm:w-auto px-10 py-3.5 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin" />}
                  {loading ? t.submitting : t.submit}
                </button>
                <Link to="/user/business" className="w-full sm:w-auto text-center text-xs font-semibold tracking-widest uppercase text-gray-600 hover:text-gray-400 transition-colors py-2">
                  {t.cancel}
                </Link>
              </div>
            </form>

            {/* Preview */}
            <div className="hidden lg:block">
              <PreviewCard form={form} lang={lang} postedAt={postedAt} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PostProject;