import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { signOut, getCurrentUser } from "aws-amplify/auth";
import { fetchAuthSession } from "aws-amplify/auth";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import Nav from "@/components/Nav";

// ─────────────────────────────────────────────────────────────────────────────
// API
// ─────────────────────────────────────────────────────────────────────────────


async function authHeader() {
  const session = await fetchAuthSession();
  const token   = session.tokens?.accessToken?.toString();
  if (!token) throw new Error("No active session");
  return { Authorization: `Bearer ${token}` };
}

export interface DeveloperProfile {
  sub:           string;
  email:         string;
  username:      string;
  display_name:  string | null;
  avatar_url:    string | null;
  location:      string | null;
  bio:           string | null;
  skills:        string[];
  hourly_rate:   number | null;
  available:     boolean;
  portfolio_url: string | null;
  github_url:    string | null;
  linkedin_url:  string | null;
  created_at:    string;
  updated_at:    string;
}

async function fetchMyProfile(): Promise<DeveloperProfile> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/developers/me`, { headers: await authHeader() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data as DeveloperProfile;
}

async function patchMyProfile(patch: Partial<DeveloperProfile>): Promise<DeveloperProfile> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/developers/me`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body:    JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data as DeveloperProfile;
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile completion helpers
// ─────────────────────────────────────────────────────────────────────────────
interface CompletionField {
  key:      keyof DeveloperProfile;
  label_en: string;
  label_es: string;
  required: boolean;
}

const COMPLETION_FIELDS: CompletionField[] = [
  { key: "display_name",  label_en: "Display name",   label_es: "Nombre público",   required: true  },
  { key: "skills",        label_en: "Skills",          label_es: "Habilidades",      required: true  },
  { key: "bio",           label_en: "Bio",             label_es: "Biografía",        required: true  },
  { key: "portfolio_url", label_en: "Portfolio URL",   label_es: "URL de portfolio", required: false },
  { key: "github_url",    label_en: "GitHub",          label_es: "GitHub",           required: false },
  { key: "location",      label_en: "Location",        label_es: "Ubicación",        required: false },
];

function isFieldFilled(profile: DeveloperProfile, key: keyof DeveloperProfile): boolean {
  const val = profile[key];
  if (Array.isArray(val)) return val.length > 0;
  return val !== null && val !== undefined && String(val).trim() !== "";
}

function completionScore(profile: DeveloperProfile): number {
  const filled = COMPLETION_FIELDS.filter((f) => isFieldFilled(profile, f.key)).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// Skill tag input (same pattern as PostProject)
// ─────────────────────────────────────────────────────────────────────────────
const SUGGESTED_SKILLS = [
  "React","Next.js","TypeScript","JavaScript","Node.js",
  "Python","Django","PostgreSQL","MongoDB","AWS",
  "Docker","Tailwind CSS","PHP","Laravel","Vue.js",
  "React Native","Swift","GraphQL","Figma","Shopify",
];

const SkillInput: React.FC<{ skills: string[]; onChange: (s: string[]) => void }> = ({ skills, onChange }) => {
  const [input, setInput] = useState("");
  const add    = (s: string) => { const t = s.trim(); if (t && !skills.includes(t) && skills.length < 15) onChange([...skills, t]); setInput(""); };
  const remove = (s: string) => onChange(skills.filter((x) => x !== s));
  const onKey  = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) { e.preventDefault(); add(input); }
    if (e.key === "Backspace" && !input && skills.length) remove(skills[skills.length - 1]);
  };
  const suggestions = SUGGESTED_SKILLS.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !skills.includes(s)).slice(0, 5);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5 min-h-[44px] px-3 py-2 bg-black/40 border border-violet-900/50 focus-within:border-violet-500/70 rounded transition-colors">
        {skills.map((s) => (
          <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-900/40 border border-cyan-700/40 text-[11px] font-semibold text-cyan-300">
            {s}
            <button type="button" onClick={() => remove(s)} className="text-cyan-500 hover:text-cyan-200 leading-none ml-0.5">×</button>
          </span>
        ))}
        <input
          value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
          placeholder={skills.length === 0 ? "Type a skill and press Enter…" : ""}
          className="flex-1 min-w-[100px] bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
        />
      </div>
      {input.length > 0 && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="px-2 py-0.5 text-[10px] font-bold rounded border border-cyan-800/40 bg-cyan-950/20 text-gray-500 hover:text-cyan-300 transition-all">
              + {s}
            </button>
          ))}
        </div>
      )}
      {input.length === 0 && skills.length < 15 && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 7).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="px-2 py-0.5 text-[10px] font-bold rounded border border-violet-900/40 text-gray-600 hover:text-gray-300 hover:border-violet-700/50 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Profile completion banner + inline editor
// ─────────────────────────────────────────────────────────────────────────────
const ProfileSetupBanner: React.FC<{
  profile:   DeveloperProfile;
  lang:      string;
  onSaved:   (updated: DeveloperProfile) => void;
}> = ({ profile, lang, onSaved }) => {
  const score        = completionScore(profile);
  const missing      = COMPLETION_FIELDS.filter((f) => !isFieldFilled(profile, f.key));
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saveErr, setSaveErr] = useState("");

  // Local form state — pre-fill from profile
  const [form, setForm] = useState({
    display_name:  profile.display_name  ?? "",
    bio:           profile.bio           ?? "",
    location:      profile.location      ?? "",
    skills:        profile.skills        ?? [],
    available:     profile.available,
    hourly_rate:   profile.hourly_rate != null ? String(profile.hourly_rate) : "",
    portfolio_url: profile.portfolio_url ?? "",
    github_url:    profile.github_url    ?? "",
    linkedin_url:  profile.linkedin_url  ?? "",
  });

  if (score === 100) return null; // banner disappears when complete

  const handleSave = async () => {
    setSaving(true);
    setSaveErr("");
    try {
      const patch: Partial<DeveloperProfile> = {
        display_name:  form.display_name  || null,
        bio:           form.bio           || null,
        location:      form.location      || null,
        skills:        form.skills,
        available:     form.available,
        hourly_rate:   form.hourly_rate ? parseFloat(form.hourly_rate) : null,
        portfolio_url: form.portfolio_url || null,
        github_url:    form.github_url    || null,
        linkedin_url:  form.linkedin_url  || null,
      };
      const updated = await patchMyProfile(patch);
      onSaved(updated);
      setOpen(false);
    } catch (err: any) {
      setSaveErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8 border border-amber-700/40 bg-amber-950/10 rounded-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />

      {/* ── Summary row ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-amber-950/10 transition-colors"
      >
        {/* Progress ring (SVG) */}
        <div className="relative w-11 h-11 shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx={18} cy={18} r={15} fill="none" stroke="#422006" strokeWidth={3} />
            <circle
              cx={18} cy={18} r={15} fill="none"
              stroke={score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#f97316"}
              strokeWidth={3}
              strokeDasharray={`${(score / 100) * 94.25} 94.25`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-amber-300">{score}%</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white mb-0.5">
            {lang === "en" ? "Complete your profile" : "Completá tu perfil"}
          </p>
          <p className="text-[11px] text-amber-400/80 leading-relaxed">
            {lang === "en"
              ? `${missing.filter(f=>f.required).length} required field${missing.filter(f=>f.required).length !== 1 ? "s" : ""} missing — businesses can't hire you yet`
              : `Faltan ${missing.filter(f=>f.required).length} campo${missing.filter(f=>f.required).length !== 1 ? "s" : ""} requerido${missing.filter(f=>f.required).length !== 1 ? "s" : ""} — los clientes no pueden contratarte aún`}
          </p>

          {/* Missing fields chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {missing.map((f) => (
              <span key={f.key} className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${
                f.required
                  ? "border-orange-700/50 bg-orange-950/20 text-orange-400"
                  : "border-gray-700/50 bg-gray-900/20 text-gray-500"
              }`}>
                {lang === "en" ? f.label_en : f.label_es}
                {!f.required && <span className="ml-1 opacity-60">{lang === "en" ? "(opt)" : "(opt)"}</span>}
              </span>
            ))}
          </div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`text-amber-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* ── Inline form ── */}
      {open && (
        <div className="border-t border-amber-900/30 px-5 py-6 flex flex-col gap-5">

          {/* Display name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
                {lang === "en" ? "Display name" : "Nombre público"} <span className="text-orange-500">*</span>
              </label>
              <input
                type="text" value={form.display_name} onChange={(e) => setForm(p => ({...p, display_name: e.target.value}))}
                placeholder="Jane Doe"
                className="px-3 py-2.5 bg-black/40 border border-violet-900/50 focus:border-violet-500/70 rounded text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
                {lang === "en" ? "Location" : "Ubicación"}
              </label>
              <input
                type="text" value={form.location} onChange={(e) => setForm(p => ({...p, location: e.target.value}))}
                placeholder={lang === "en" ? "Buenos Aires, AR" : "Buenos Aires, AR"}
                className="px-3 py-2.5 bg-black/40 border border-violet-900/50 focus:border-violet-500/70 rounded text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500 flex items-center justify-between">
              <span>{lang === "en" ? "Bio" : "Biografía"} <span className="text-orange-500">*</span></span>
              <span className="text-gray-700 font-normal normal-case tracking-normal">{form.bio.length}/500</span>
            </label>
            <textarea
              value={form.bio} onChange={(e) => setForm(p => ({...p, bio: e.target.value}))} maxLength={500} rows={3}
              placeholder={lang === "en" ? "A short description of what you do and what you specialise in…" : "Una breve descripción de lo que hacés y en qué te especializás…"}
              className="px-3 py-2.5 bg-black/40 border border-violet-900/50 focus:border-violet-500/70 rounded text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
              {lang === "en" ? "Skills" : "Habilidades"} <span className="text-orange-500">*</span>
            </label>
            <SkillInput skills={form.skills} onChange={(s) => setForm(p => ({...p, skills: s}))} />
          </div>

          {/* Availability + rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
                {lang === "en" ? "Availability" : "Disponibilidad"} <span className="text-orange-500">*</span>
              </label>
              <div className="flex gap-2">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setForm(p => ({...p, available: val}))}
                    className={`flex-1 py-2.5 rounded border text-xs font-black tracking-widest uppercase transition-all ${
                      form.available === val
                        ? val
                          ? "border-emerald-600/60 bg-emerald-950/30 text-emerald-300"
                          : "border-red-700/50 bg-red-950/20 text-red-400"
                        : "border-violet-900/40 text-gray-600 hover:border-violet-700/50 hover:text-gray-400"
                    }`}
                  >
                    {val
                      ? (lang === "en" ? "Available" : "Disponible")
                      : (lang === "en" ? "Not available" : "No disponible")}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-500">
                {lang === "en" ? "Hourly rate (USD)" : "Tarifa por hora (USD)"}
              </label>
              <input
                type="number" min={0} value={form.hourly_rate} onChange={(e) => setForm(p => ({...p, hourly_rate: e.target.value}))}
                placeholder="50"
                className="px-3 py-2.5 bg-black/40 border border-violet-900/50 focus:border-violet-500/70 rounded text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Portfolio / GitHub / LinkedIn */}
          <div>
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-gray-700 mb-3">
              {lang === "en" ? "Links (optional)" : "Links (opcional)"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: "portfolio_url" as const, placeholder: "https://yoursite.com",       icon: "🌐" },
                { key: "github_url"    as const, placeholder: "https://github.com/you",     icon: "⌥"  },
                { key: "linkedin_url"  as const, placeholder: "https://linkedin.com/in/you",icon: "in" },
              ].map(({ key, placeholder, icon }) => (
                <div key={key} className="flex items-center gap-2 px-3 py-2.5 bg-black/40 border border-violet-900/50 focus-within:border-violet-500/70 rounded transition-colors">
                  <span className="text-[11px] text-gray-600 shrink-0 w-5 text-center">{icon}</span>
                  <input
                    type="url" value={form[key]} onChange={(e) => setForm(p => ({...p, [key]: e.target.value}))}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-xs text-gray-300 placeholder-gray-700 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          {saveErr && (
            <p className="text-xs text-red-400 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12} y2={16}/></svg>
              {saveErr}
            </p>
          )}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all"
            >
              {saving && <span className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />}
              {saving ? (lang === "en" ? "Saving…" : "Guardando…") : (lang === "en" ? "Save profile" : "Guardar perfil")}
            </button>
            <button onClick={() => setOpen(false)} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              {lang === "en" ? "Cancel" : "Cancelar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Small stat card
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Project row (placeholder — replace when projects API is wired)
// ─────────────────────────────────────────────────────────────────────────────
const ProjectRow: React.FC<{
  title: string; client: string; status: "active"|"review"|"pending"; budget: string; deadline: string; lang: string;
}> = ({ title, client, status, budget, deadline, lang }) => {
  const cfg = {
    active:  { label: lang === "en" ? "Active"    : "Activo",      color: "text-emerald-400 border-emerald-800/50 bg-emerald-950/20" },
    review:  { label: lang === "en" ? "In review" : "En revisión", color: "text-amber-400 border-amber-800/50 bg-amber-950/20"       },
    pending: { label: lang === "en" ? "Pending"   : "Pendiente",   color: "text-gray-400 border-gray-700/50 bg-gray-900/20"          },
  }[status];
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-violet-900/20 last:border-0 group hover:bg-violet-950/10 px-2 -mx-2 rounded transition-colors">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-xs text-gray-600">{client}</span>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${cfg.color}`}>{cfg.label}</span>
        <span className="text-xs text-gray-500 hidden sm:block">{budget}</span>
        <span className="text-xs text-gray-600">{deadline}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Open project card (placeholder)
// ─────────────────────────────────────────────────────────────────────────────
const ProposalCard: React.FC<{
  title: string; budget: string; stack: string[]; posted: string; lang: string;
}> = ({ title, budget, stack, posted, lang }) => (
  <div className="relative flex flex-col gap-4 p-5 border border-violet-900/40 bg-violet-950/10 rounded-xl overflow-hidden group hover:border-violet-600/50 hover:bg-violet-950/20 transition-all">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-start justify-between gap-2">
      <h4 className="text-sm font-bold text-white leading-snug">{title}</h4>
      <span className="text-xs font-black text-violet-300 shrink-0">{budget}</span>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {stack.map((s) => (
        <span key={s} className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded border border-cyan-900/50 bg-cyan-950/20 text-cyan-500">{s}</span>
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

// ─────────────────────────────────────────────────────────────────────────────
// DeveloperDashboard
// ─────────────────────────────────────────────────────────────────────────────
const DeveloperDashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const { lang }          = useLanguage();
  const navigate          = useNavigate();
  const { sub: paramSub } = useParams<{ sub: string }>();

  const [checking, setChecking]   = useState(true);
  const [profile,  setProfile]    = useState<DeveloperProfile | null>(null);
  const [profErr,  setProfErr]    = useState("");

  // ── Auth + role guard ──────────────────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      try {
        const cu = await getCurrentUser();
        // URL sub must match the logged-in user
        if (paramSub && cu.userId !== paramSub) {
          navigate("/login", { replace: true });
          return;
        }
        if (user && user.role !== "developer" && user.role !== undefined) {
          navigate("/user/business", { replace: true });
          return;
        }
      } catch {
        navigate("/login", { state: { from: { pathname: `/user/developer/${paramSub}` } }, replace: true });
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [navigate, user, paramSub]);

  // ── Fetch developer profile from D1 ───────────────────────────────────────
  useEffect(() => {
    if (checking) return;
    fetchMyProfile()
      .then(setProfile)
      .catch((err) => setProfErr(err.message));
  }, [checking]);

  const handleSignOut = async () => {
    try { await signOut(); localStorage.clear(); setUser(null); navigate("/login"); }
    catch (err) { console.error(err); }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (checking || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {profErr ? (
            <>
              <p className="text-xs text-red-400">{profErr}</p>
              <button onClick={() => { setProfErr(""); fetchMyProfile().then(setProfile).catch((e) => setProfErr(e.message)); }}
                className="px-4 py-2 text-xs font-black tracking-widest uppercase text-violet-300 border border-violet-700/50 hover:border-violet-500 rounded transition-all">
                {lang === "en" ? "Retry" : "Reintentar"}
              </button>
            </>
          ) : (
            <>
              <div className="w-8 h-8 border border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-600">
                {lang === "en" ? "Loading dashboard…" : "Cargando panel…"}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  const displayName = profile.display_name ?? user?.displayName ?? user?.username ?? "Developer";
  const initial     = displayName[0]?.toUpperCase() ?? "D";

  // Placeholder project / proposal data
  const projects = [
    { title: "E-commerce redesign", client: "Acme Corp",  status: "active"  as const, budget: "$1,200", deadline: "Mar 20" },
    { title: "API integration",     client: "StartupXYZ", status: "review"  as const, budget: "$600",   deadline: "Mar 15" },
    { title: "Landing page",        client: "LocalBiz",   status: "pending" as const, budget: "$350",   deadline: "Apr 1"  },
  ];
  const openProposals = [
    { title: "Build a SaaS dashboard with React + Supabase", budget: "$1,500–$2,500", stack: ["React","Supabase","TypeScript"], posted: lang === "en" ? "2h ago" : "Hace 2h" },
    { title: "WooCommerce migration to Next.js",              budget: "$800–$1,200",   stack: ["Next.js","Node.js","MySQL"],     posted: lang === "en" ? "5h ago" : "Hace 5h" },
    { title: "Mobile-first landing for restaurant",           budget: "$300–$500",     stack: ["HTML","Tailwind","JS"],          posted: lang === "en" ? "1d ago" : "Hace 1d"  },
  ];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-700 opacity-[0.04] blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={displayName} className="w-12 h-12 rounded-xl object-cover border border-cyan-700/40" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-cyan-900/40 border border-cyan-700/40 flex items-center justify-center text-lg font-black text-cyan-300">
                    {initial}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-black ${profile.available ? "bg-emerald-500" : "bg-gray-600"}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black text-white">{displayName}</h1>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-cyan-700/60 bg-cyan-950/30 text-cyan-400">
                    {lang === "en" ? "Developer" : "Dev"}
                  </span>
                  {profile.available ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-emerald-800/50 bg-emerald-950/20 text-emerald-400">
                      {lang === "en" ? "Available" : "Disponible"}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-gray-700/50 bg-gray-900/20 text-gray-500">
                      {lang === "en" ? "Unavailable" : "No disponible"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{profile.email}</p>
                {profile.location && <p className="text-[11px] text-gray-700 mt-0.5">{profile.location}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/settings">
                <button className="p-2 border border-violet-900/40 hover:border-violet-700/50 text-gray-500 hover:text-gray-300 rounded transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={3}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
              </Link>
              <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-500 border border-violet-900/40 hover:border-violet-700/50 hover:text-gray-300 rounded transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1={21} y1={12} x2={9} y2={12}/></svg>
                {lang === "en" ? "Sign out" : "Salir"}
              </button>
            </div>
          </div>

          {/* ── Profile completion banner ── */}
          <div className="relative">
            <ProfileSetupBanner profile={profile} lang={lang} onSaved={setProfile} />
          </div>

          {/* ── Skill chips (if filled) ── */}
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {profile.skills.map((s) => (
                <span key={s} className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded border border-cyan-900/50 bg-cyan-950/20 text-cyan-400">{s}</span>
              ))}
              {profile.hourly_rate && (
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded border border-violet-800/50 bg-violet-950/20 text-violet-400">
                  ${profile.hourly_rate}/hr
                </span>
              )}
            </div>
          )}

          {/* ── Stats ── */}
          <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600 block mb-3">
            {lang === "en" ? "Overview" : "Resumen"}
          </span>
          <div className="flex flex-wrap gap-4 mb-10">
            <Stat value="3"      label={lang === "en" ? "Active projects" : "Proyectos activos"} trend={lang === "en" ? "+1 this week" : "+1 esta semana"} icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>} />
            <Stat value="$2,150" label={lang === "en" ? "Pending payout"  : "Por cobrar"}        icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1={12} y1={1} x2={12} y2={23}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
            <Stat value="12"     label={lang === "en" ? "Proposals sent"  : "Propuestas"}         icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1={22} y1={2} x2={11} y2={13}/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>} />
            <Stat value="4.9★"   label={lang === "en" ? "Avg rating"      : "Calificación"}       icon={<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>} />
          </div>

          {/* ── Two-col: projects + open proposals ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600">{lang === "en" ? "My projects" : "Mis proyectos"}</span>
                <Link to="/my-projects" className="text-[10px] font-black tracking-widest uppercase text-violet-400 hover:text-violet-300 transition-colors">{lang === "en" ? "View all →" : "Ver todos →"}</Link>
              </div>
              <div className="border border-violet-900/40 bg-violet-950/10 rounded-xl p-5">
                {projects.map((p) => <ProjectRow key={p.title} {...p} lang={lang} />)}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-600">{lang === "en" ? "Open projects" : "Proyectos abiertos"}</span>
                <Link to="/projects" className="text-[10px] font-black tracking-widest uppercase text-violet-400 hover:text-violet-300 transition-colors">{lang === "en" ? "Browse all →" : "Ver todos →"}</Link>
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