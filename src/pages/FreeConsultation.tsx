import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type ProjectType = "landing" | "ecommerce" | "webapp" | "support" | "other";
type Budget      = "under500" | "500_2k" | "2k_10k" | "10k_plus" | "unsure";
type Step        = "form" | "done";

const BgGrid: React.FC = () => (
  <>
    <div
      className="absolute inset-0 opacity-[0.025] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />
  </>
);

const Chip: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}> = ({ label, selected, onClick, icon }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200 ${
      selected
        ? "border-violet-500/70 bg-violet-950/40 text-violet-300"
        : "border-violet-900/40 bg-violet-950/10 text-gray-500 hover:border-violet-700/50 hover:text-gray-300"
    }`}
  >
    {icon && <span className={`transition-colors ${selected ? "text-violet-400" : "text-gray-600"}`}>{icon}</span>}
    {label}
    {selected && (
      <span className="ml-auto w-3.5 h-3.5 rounded-full bg-violet-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    )}
  </button>
);

const Field: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  error?: string;
  required?: boolean;
}> = ({ label, type = "text", value, onChange, placeholder, multiline, error, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">
      {label}{required && <span className="text-violet-500 ml-1">*</span>}
    </label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-4 py-3 bg-violet-950/20 border rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-colors resize-none ${
          error ? "border-red-500/60" : "border-violet-900/50 focus:border-violet-500/70"
        }`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-violet-950/20 border rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-colors ${
          error ? "border-red-500/60" : "border-violet-900/50 focus:border-violet-500/70"
        }`}
      />
    )}
    {error && <span className="text-[10px] text-red-400">{error}</span>}
  </div>
);

const FreeConsultation: React.FC = () => {
  const { lang } = useLanguage();

  const [step, setStep]         = useState<Step>("form");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [company, setCompany]   = useState("");
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [budget, setBudget]     = useState<Budget | null>(null);
  const [message, setMessage]   = useState("");
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);

  const projectTypes: { value: ProjectType; label: string; icon: React.ReactNode }[] = [
    {
      value: "landing",
      label: lang === "en" ? "Landing page / Website" : "Landing page / Sitio web",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={18} height={18} rx={2}/><line x1={3} y1={9} x2={21} y2={9}/><line x1={9} y1={21} x2={9} y2={9}/></svg>,
    },
    {
      value: "ecommerce",
      label: "E-commerce",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={9} cy={21} r={1}/><circle cx={20} cy={21} r={1}/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    },
    {
      value: "webapp",
      label: lang === "en" ? "Custom web app" : "App web a medida",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    },
    {
      value: "support",
      label: lang === "en" ? "Technical support" : "Soporte técnico",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    },
    {
      value: "other",
      label: lang === "en" ? "Something else" : "Otro",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12} y2={16}/></svg>,
    },
  ];

  const budgets: { value: Budget; label: string }[] = [
    { value: "under500",  label: lang === "en" ? "Under $500"    : "Menos de $500"  },
    { value: "500_2k",    label: "$500 – $2,000"                                    },
    { value: "2k_10k",    label: "$2,000 – $10,000"                                 },
    { value: "10k_plus",  label: lang === "en" ? "$10k+"          : "$10k+"         },
    { value: "unsure",    label: lang === "en" ? "Not sure yet"  : "Aún no lo sé"  },
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())                   e.name    = lang === "en" ? "Name is required"           : "El nombre es requerido";
    if (!/\S+@\S+\.\S+/.test(email))   e.email   = lang === "en" ? "Valid email required"        : "Email inválido";
    if (!projectType)                   e.type    = lang === "en" ? "Select a project type"       : "Seleccioná un tipo de proyecto";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    await new Promise((res) => setTimeout(res, 1200)); // simulate request
    setLoading(false);
    setStep("done");
  };

  const t = {
    eyebrow:    lang === "en" ? "Free consultation"         : "Consulta gratuita",
    title:      lang === "en" ? "Tell us about your project": "Contanos sobre tu proyecto",
    sub:        lang === "en"
      ? "No commitment, no pressure. We'll get back to you within 24 hours."
      : "Sin compromiso, sin presión. Te respondemos en menos de 24 horas.",
    nameLabel:    lang === "en" ? "Your name"               : "Tu nombre",
    emailLabel:   lang === "en" ? "Email"                   : "Correo electrónico",
    companyLabel: lang === "en" ? "Company (optional)"      : "Empresa (opcional)",
    typeLabel:    lang === "en" ? "What do you need?"        : "¿Qué necesitás?",
    budgetLabel:  lang === "en" ? "Estimated budget"         : "Presupuesto estimado",
    msgLabel:     lang === "en" ? "Tell us more (optional)"  : "Contanos más (opcional)",
    msgPlaceholder: lang === "en"
      ? "Describe your project, timeline, or anything else that helps us understand what you need..."
      : "Describí tu proyecto, plazos, o cualquier cosa que nos ayude a entender lo que necesitás...",
    submit:       lang === "en" ? "Request consultation"    : "Solicitar consulta",
    submitting:   lang === "en" ? "Sending..."              : "Enviando...",
    doneTitle:    lang === "en" ? "Request received!"       : "¡Solicitud recibida!",
    doneSub:      lang === "en"
      ? "We'll reach out to you at"
      : "Te contactaremos a",
    doneDetails:  lang === "en"
      ? "within 24 hours to schedule your free consultation."
      : "en menos de 24 horas para coordinar tu consulta gratuita.",
    backHome:     lang === "en" ? "Back to home"            : "Volver al inicio",
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-0 relative overflow-hidden">
        <BgGrid />

        <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">

          {step === "done" ? (
            <div className="flex flex-col items-center text-center gap-8 py-16">
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
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t.doneSub}{" "}
                  <span className="text-violet-300 font-semibold">{email}</span>{" "}
                  {t.doneDetails}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/">
                  <button className="px-6 py-2.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all">
                    {t.backHome}
                  </button>
                </Link>
                <Link to="/services">
                  <button className="px-6 py-2.5 border border-violet-700/50 hover:border-violet-500 text-violet-300 font-black text-xs tracking-[0.2em] uppercase rounded transition-all">
                    {lang === "en" ? "Browse services" : "Ver servicios"}
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="flex items-center gap-3 justify-center mb-4">
                  <div className="h-px w-6 bg-violet-700" />
                  <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600">{t.eyebrow}</span>
                  <div className="h-px w-6 bg-violet-700" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">{t.title}</h1>
                <p className="text-sm text-gray-500 leading-relaxed">{t.sub}</p>
              </div>

              <div className="relative border border-violet-900/50 rounded-xl bg-violet-950/10 backdrop-blur-sm p-8 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/60 to-transparent" />

                <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label={t.nameLabel}    value={name}    onChange={setName}    placeholder={lang === "en" ? "John Doe" : "Juan García"} required error={errors.name}  />
                    <Field label={t.emailLabel}   type="email" value={email}   onChange={setEmail}   placeholder="you@company.com" required error={errors.email} />
                  </div>

                  <Field label={t.companyLabel} value={company} onChange={setCompany} placeholder={lang === "en" ? "Acme Inc. (optional)" : "Mi Empresa S.A. (opcional)"} />

                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">
                      {t.typeLabel} <span className="text-violet-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {projectTypes.map((pt) => (
                        <Chip
                          key={pt.value}
                          label={pt.label}
                          icon={pt.icon}
                          selected={projectType === pt.value}
                          onClick={() => setProjectType(pt.value)}
                        />
                      ))}
                    </div>
                    {errors.type && <span className="text-[10px] text-red-400">{errors.type}</span>}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">{t.budgetLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {budgets.map((b) => (
                        <Chip
                          key={b.value}
                          label={b.label}
                          selected={budget === b.value}
                          onClick={() => setBudget(b.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <Field label={t.msgLabel} value={message} onChange={setMessage} placeholder={t.msgPlaceholder} multiline />

                  <p className="text-[10px] text-gray-600 leading-relaxed -mt-2">
                    {lang === "en"
                      ? "By submitting this form you agree to our "
                      : "Al enviar este formulario aceptás nuestra "}
                    <Link to="/privacy" className="text-violet-500 hover:text-violet-400 transition-colors underline">
                      {lang === "en" ? "Privacy Policy" : "Política de Privacidad"}
                    </Link>
                    {lang === "en" ? ". We never share your data." : ". Nunca compartimos tus datos."}
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="py-3.5 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all flex items-center justify-center gap-2"
                  >
                    {loading && <span className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin" />}
                    {loading ? t.submitting : t.submit}
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                {[
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></svg>,
                    label: lang === "en" ? "Reply in 24h"       : "Respuesta en 24h",
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                    label: lang === "en" ? "No commitment"      : "Sin compromiso",
                  },
                  {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1={12} y1={1} x2={12} y2={23}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                    label: lang === "en" ? "100% free"          : "100% gratuito",
                  },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 p-4 border border-violet-900/30 rounded-lg bg-violet-950/10">
                    <span className="text-violet-500">{icon}</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-600 text-center">{label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FreeConsultation;