import React, { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "react-intersection-observer";

const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = "",
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Step: React.FC<{
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  accent?: boolean;
}> = ({ number, title, description, icon, delay = 0, accent = false }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`relative flex flex-col gap-4 p-6 border rounded-xl overflow-hidden transition-all duration-700 ease-out group hover:border-violet-600/50 hover:bg-violet-950/20 ${
        accent
          ? "border-violet-600/50 bg-violet-950/20"
          : "border-violet-900/40 bg-violet-950/10"
      } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
      )}

      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
          accent ? "bg-violet-500/20 text-violet-300" : "bg-violet-950/40 text-gray-500 group-hover:text-violet-400"
        }`}>
          {icon}
        </div>
        <span className="text-[10px] font-black tracking-[0.3em] text-gray-700">{number}</span>
      </div>

      <div>
        <h3 className="text-sm font-black text-white tracking-tight mb-2">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const Arrow: React.FC = () => (
  <div className="hidden lg:flex items-center justify-center px-2 pt-6">
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-violet-800">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </div>
);

const RoleTab: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black tracking-widest uppercase transition-all duration-200 ${
      active
        ? "bg-violet-500/20 text-violet-300 border border-violet-600/60"
        : "text-gray-600 border border-transparent hover:text-gray-400"
    }`}
  >
    <span className={`transition-colors ${active ? "text-violet-400" : "text-gray-700"}`}>{icon}</span>
    {label}
  </button>
);

const About: React.FC = () => {
  const { lang } = useLanguage();
  const [activeRole, setActiveRole] = React.useState<"business" | "developer">("business");

  const businessSteps = [
    {
      number: "01",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/></svg>,
      title:       lang === "en" ? "Browse services"        : "Explorá servicios",
      description: lang === "en"
        ? "Find exactly what your business needs — from landing pages and e-commerce to custom platforms and technical support."
        : "Encontrá exactamente lo que tu negocio necesita — desde landing pages y e-commerce hasta plataformas a medida y soporte técnico.",
    },
    {
      number: "02",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      title:       lang === "en" ? "Connect with a developer" : "Conectate con un dev",
      description: lang === "en"
        ? "Request a free consultation. We match you with a vetted developer whose skills fit your project perfectly."
        : "Pedí una consulta gratuita. Te conectamos con un desarrollador verificado cuyas habilidades encajan con tu proyecto.",
      accent: true,
    },
    {
      number: "03",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      title:       lang === "en" ? "Get results"            : "Obtené resultados",
      description: lang === "en"
        ? "Track progress, communicate directly, and receive a polished digital solution — on time, on budget."
        : "Seguí el progreso, comunicarte directamente y recibir una solución digital de calidad — en tiempo y presupuesto.",
    },
  ];

  const developerSteps = [
    {
      number: "01",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx={12} cy={7} r={4}/></svg>,
      title:       lang === "en" ? "Create your profile"    : "Creá tu perfil",
      description: lang === "en"
        ? "List your stack, portfolio, rates and availability. Your profile is your storefront — make it count."
        : "Listá tu stack, portfolio, tarifas y disponibilidad. Tu perfil es tu vidriera — hacelo destacar.",
    },
    {
      number: "02",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg>,
      title:       lang === "en" ? "Browse projects"        : "Explorá proyectos",
      description: lang === "en"
        ? "See real projects from real businesses. Filter by tech stack, budget and timeline. Apply with one click."
        : "Mirá proyectos reales de negocios reales. Filtrá por stack, presupuesto y plazo. Aplicá con un clic.",
      accent: true,
    },
    {
      number: "03",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1={12} y1={1} x2={12} y2={23}/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      title:       lang === "en" ? "Build & get paid"       : "Construí y cobrá",
      description: lang === "en"
        ? "Deliver your work, collect payment securely through the platform. Grow your reputation with every project."
        : "Entregá tu trabajo, cobrá de forma segura a través de la plataforma. Crecé tu reputación con cada proyecto.",
    },
  ];

  const steps = activeRole === "business" ? businessSteps : developerSteps;

  return (
    <section className="relative bg-black overflow-hidden py-24 md:py-32">
  
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-cyan-600 opacity-[0.04] blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

 
        <FadeUp>
          <div className="flex items-center gap-3 mb-5 justify-center">
            <div className="h-px w-8 bg-violet-700" />
            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600">
              {lang === "en" ? "How it works" : "Cómo funciona"}
            </span>
            <div className="h-px w-8 bg-violet-700" />
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <h2
            className="font-black text-white text-center leading-tight tracking-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            {lang === "en" ? (
              <>A platform built for <span className="text-violet-400">both sides</span></>
            ) : (
              <>Una plataforma para <span className="text-violet-400">los dos lados</span></>
            )}
          </h2>
        </FadeUp>

        <FadeUp delay={150}>
          <p className="text-xs text-gray-500 text-center max-w-lg mx-auto leading-relaxed mb-10">
            {lang === "en"
              ? "Whether you're a business looking for digital solutions or a developer looking for meaningful work — Kustom connects you."
              : "Ya sea que busques soluciones digitales para tu negocio o proyectos como desarrollador — Kustom te conecta."}
          </p>
        </FadeUp>

        <FadeUp delay={200}>
          <div className="flex items-center justify-center gap-2 mb-12 p-1 rounded-xl border border-violet-900/40 bg-violet-950/10 w-fit mx-auto">
            <RoleTab
              active={activeRole === "business"}
              onClick={() => setActiveRole("business")}
              label={lang === "en" ? "I'm a business" : "Soy un negocio"}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x={2} y={7} width={20} height={14} rx={2}/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              }
            />
            <RoleTab
              active={activeRole === "developer"}
              onClick={() => setActiveRole("developer")}
              label={lang === "en" ? "I'm a developer" : "Soy desarrollador"}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              }
            />
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 lg:gap-0 mb-16">
          {steps.map((step, i) => (
            <React.Fragment key={step.number}>
              <Step
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                accent={step.accent}
                delay={i * 120}
              />
              {i < steps.length - 1 && <Arrow />}
            </React.Fragment>
          ))}
        </div>

        <FadeUp delay={400}>
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border border-violet-800/40 rounded-xl bg-violet-950/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/50 to-transparent" />
          
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-32 bg-violet-700 opacity-[0.06] blur-3xl rounded-full" />
            </div>
            <div className="relative text-center sm:text-left">
              <h3 className="text-base font-black text-white mb-1">
                {lang === "en" ? "Ready to get started?" : "¿Listo para empezar?"}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === "en"
                  ? "Join hundreds of businesses and developers already on the platform."
                  : "Unite a cientos de negocios y desarrolladores que ya usan la plataforma."}
              </p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="/registro">
                <button className="w-full sm:w-auto px-6 py-2.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all whitespace-nowrap">
                  {lang === "en" ? "Create account" : "Crear cuenta"}
                </button>
              </a>
              <a href="/services">
                <button className="w-full sm:w-auto px-6 py-2.5 border border-violet-700/50 hover:border-violet-500 text-violet-300 hover:text-violet-200 font-black text-xs tracking-[0.2em] uppercase rounded transition-all whitespace-nowrap">
                  {lang === "en" ? "Browse services" : "Ver servicios"}
                </button>
              </a>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default About;