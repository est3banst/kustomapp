import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const AccordionItem: React.FC<{
  question: string;
  answer: string;
  defaultOpen?: boolean;
}> = ({ question, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${open ? "border-violet-700/50 bg-violet-950/20" : "border-violet-900/30 bg-violet-950/10"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left group"
      >
        <span className={`text-sm font-semibold leading-snug transition-colors ${open ? "text-violet-200" : "text-gray-300 group-hover:text-white"}`}>
          {question}
        </span>
        <span className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${open ? "border-violet-600 bg-violet-600/20 rotate-45" : "border-violet-900/50"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={open ? "text-violet-300" : "text-gray-600"}>
            <line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/>
          </svg>
        </span>
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}>
        <p className="px-6 pb-5 text-xs text-gray-500 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="relative flex flex-col gap-3 p-5 border border-violet-900/40 bg-violet-950/10 rounded-xl group hover:border-violet-700/50 hover:bg-violet-950/20 transition-all duration-200 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-9 h-9 rounded-lg bg-violet-950/50 border border-violet-900/40 flex items-center justify-center text-violet-500 group-hover:text-violet-400 transition-colors">
      {icon}
    </div>
    <div>
      <h3 className="text-xs font-black text-white tracking-tight mb-1">{title}</h3>
      <p className="text-[11px] text-gray-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

const SectionHeader: React.FC<{ eyebrow: string; title: string; sub?: string }> = ({ eyebrow, title, sub }) => (
  <div className="text-center mb-10">
    <div className="flex items-center gap-3 justify-center mb-4">
      <div className="h-px w-6 bg-violet-700" />
      <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600">{eyebrow}</span>
      <div className="h-px w-6 bg-violet-700" />
    </div>
    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">{title}</h2>
    {sub && <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">{sub}</p>}
  </div>
);

const Help: React.FC = () => {
  const { lang } = useLanguage();

  const features = [
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/></svg>,
      title:       lang === "en" ? "Smart matching"          : "Conexión inteligente",
      description: lang === "en" ? "We match your project requirements with the right developer based on skills, availability and budget." : "Conectamos tu proyecto con el desarrollador correcto según habilidades, disponibilidad y presupuesto.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      title:       lang === "en" ? "Verified developers"     : "Devs verificados",
      description: lang === "en" ? "Every developer on Kustom goes through a vetting process. You only work with professionals." : "Cada desarrollador en Kustom pasa por un proceso de verificación. Solo trabajás con profesionales.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={1} y={4} width={22} height={16} rx={2}/><line x1={1} y1={10} x2={23} y2={10}/></svg>,
      title:       lang === "en" ? "Secure payments"         : "Pagos seguros",
      description: lang === "en" ? "Payments are held in escrow and released only when you approve the delivered work." : "Los pagos se retienen en custodia y se liberan solo cuando aprobás el trabajo entregado.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      title:       lang === "en" ? "Direct communication"    : "Comunicación directa",
      description: lang === "en" ? "Chat directly with your developer. No account managers, no middlemen — just clear communication." : "Chateá directamente con tu desarrollador. Sin intermediarios — solo comunicación clara.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      title:       lang === "en" ? "Progress tracking"       : "Seguimiento de avance",
      description: lang === "en" ? "Track milestones, deliverables and timelines from your dashboard in real time." : "Seguí hitos, entregables y plazos desde tu panel en tiempo real.",
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><polyline points="12 6 12 12 16 14"/></svg>,
      title:       lang === "en" ? "Free consultation"       : "Consulta gratuita",
      description: lang === "en" ? "Not sure where to start? Book a free consultation and we'll help you scope your project." : "¿No sabés por dónde empezar? Agendá una consulta gratis y te ayudamos a definir tu proyecto.",
    },
  ];

  const faqBusiness = [
    {
      question: lang === "en" ? "How do I find the right developer for my project?" : "¿Cómo encuentro al desarrollador correcto?",
      answer:   lang === "en" ? "Browse our services section or post your project with requirements. We'll match you with vetted developers who fit your tech stack, budget and timeline. You can also book a free consultation for personalized guidance." : "Explorá nuestra sección de servicios o publicá tu proyecto con los requisitos. Te conectamos con desarrolladores verificados que se ajusten a tu stack, presupuesto y plazo. También podés agendar una consulta gratuita.",
    },
    {
      question: lang === "en" ? "What types of projects can I post?" : "¿Qué tipo de proyectos puedo publicar?",
      answer:   lang === "en" ? "Anything digital: landing pages, e-commerce stores, custom web apps, mobile apps, API integrations, ongoing technical support, and more. If it's digital, we can find someone for it." : "Todo lo digital: landing pages, tiendas e-commerce, apps web a medida, apps móviles, integraciones de API, soporte técnico continuo y más. Si es digital, encontramos a alguien.",
    },
    {
      question: lang === "en" ? "How does payment work?" : "¿Cómo funcionan los pagos?",
      answer:   lang === "en" ? "You fund a project milestone upfront. The payment is held securely until you approve the work. Once approved, funds are released to the developer. This protects both parties." : "Financiás un hito del proyecto por adelantado. El pago queda retenido de forma segura hasta que aprobás el trabajo. Una vez aprobado, se liberan los fondos al desarrollador.",
    },
    {
      question: lang === "en" ? "What if I'm not satisfied with the work?" : "¿Qué pasa si no estoy satisfecho con el trabajo?",
      answer:   lang === "en" ? "We have a dispute resolution process. If the delivered work doesn't meet the agreed specifications, our team steps in to mediate and find a resolution — including refunds where applicable." : "Tenemos un proceso de resolución de disputas. Si el trabajo no cumple con las especificaciones acordadas, nuestro equipo interviene para mediar y encontrar una solución, incluyendo reembolsos cuando corresponda.",
    },
    {
      question: lang === "en" ? "Is there a free tier?" : "¿Hay una versión gratuita?",
      answer:   lang === "en" ? "Creating an account and browsing services is completely free. You only pay when you hire a developer or purchase a service package." : "Crear una cuenta y explorar servicios es completamente gratuito. Solo pagás cuando contratás un desarrollador o comprás un paquete de servicio.",
    },
  ];

  const faqDev = [
    {
      question: lang === "en" ? "How do I get hired on Kustom?" : "¿Cómo me contratan en Kustom?",
      answer:   lang === "en" ? "Create a developer profile with your stack, portfolio and rates. Once verified, you can browse posted projects and submit proposals. Businesses can also find you directly through search." : "Creá un perfil de desarrollador con tu stack, portfolio y tarifas. Una vez verificado, podés explorar proyectos publicados y enviar propuestas. Las empresas también pueden encontrarte directamente por búsqueda.",
    },
    {
      question: lang === "en" ? "What is the verification process?" : "¿En qué consiste la verificación?",
      answer:   lang === "en" ? "We review your portfolio, do a short technical assessment relevant to your listed skills, and verify your identity. The process takes 2–5 business days." : "Revisamos tu portfolio, hacemos una evaluación técnica corta relevante a tus habilidades y verificamos tu identidad. El proceso tarda entre 2 y 5 días hábiles.",
    },
    {
      question: lang === "en" ? "What percentage does Kustom take?" : "¿Qué porcentaje se lleva Kustom?",
      answer:   lang === "en" ? "Kustom takes a 10% platform fee from each completed project. This covers payment processing, dispute protection, and platform maintenance. There are no monthly fees." : "Kustom toma un 10% de comisión de cada proyecto completado. Esto cubre el procesamiento de pagos, protección ante disputas y mantenimiento de la plataforma. No hay cuotas mensuales.",
    },
    {
      question: lang === "en" ? "How do I get paid?" : "¿Cómo cobro?",
      answer:   lang === "en" ? "Once the client approves a milestone, funds are released to your Kustom wallet within 24 hours. You can withdraw to your bank account or PayPal at any time with a minimum of $20." : "Una vez que el cliente aprueba un hito, los fondos se liberan a tu billetera Kustom en 24 horas. Podés retirar a tu cuenta bancaria o PayPal en cualquier momento con un mínimo de $20.",
    },
  ];

  const [activeTab, setActiveTab] = useState<"business" | "developer">("business");

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-0 relative overflow-hidden">
      
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">

          <div className="text-center mb-20">
            <div className="flex items-center gap-3 justify-center mb-5">
              <div className="h-px w-6 bg-violet-700" />
              <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600">
                {lang === "en" ? "Help center" : "Centro de ayuda"}
              </span>
              <div className="h-px w-6 bg-violet-700" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              {lang === "en" ? "How can we help?" : "¿En qué podemos ayudarte?"}
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
              {lang === "en"
                ? "Everything you need to know about Kustom — from getting started to getting paid."
                : "Todo lo que necesitás saber sobre Kustom — desde empezar hasta cobrar."}
            </p>
            <Link to="/free-consultation">
              <button className="px-6 py-2.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all">
                {lang === "en" ? "Book a free consultation" : "Agendar consulta gratis"}
              </button>
            </Link>
          </div>

          <div className="mb-24">
            <SectionHeader
              eyebrow={lang === "en" ? "Platform features" : "Funciones de la plataforma"}
              title={lang === "en" ? "Everything in one place" : "Todo en un solo lugar"}
              sub={lang === "en" ? "Kustom provides the tools both businesses and developers need to work together smoothly." : "Kustom provee las herramientas que negocios y desarrolladores necesitan para trabajar juntos sin fricciones."}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => <FeatureCard key={f.title} {...f} />)}
            </div>
          </div>

          <div className="mb-24">
            <SectionHeader
              eyebrow="FAQ"
              title={lang === "en" ? "Frequently asked questions" : "Preguntas frecuentes"}
            />

            <div className="flex items-center justify-center gap-2 mb-8 p-1 rounded-xl border border-violet-900/40 bg-violet-950/10 w-fit mx-auto">
              {(["business", "developer"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveTab(role)}
                  className={`px-5 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all ${
                    activeTab === role
                      ? "bg-violet-500/20 text-violet-300 border border-violet-600/60"
                      : "text-gray-600 border border-transparent hover:text-gray-400"
                  }`}
                >
                  {role === "business"
                    ? (lang === "en" ? "For businesses" : "Para negocios")
                    : (lang === "en" ? "For developers" : "Para desarrolladores")}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 max-w-2xl mx-auto">
              {(activeTab === "business" ? faqBusiness : faqDev).map((item, i) => (
                <AccordionItem key={item.question} {...item} defaultOpen={i === 0} />
              ))}
            </div>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border border-violet-800/40 rounded-xl bg-violet-950/10 overflow-hidden mb-0">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/50 to-transparent" />
            <div className="text-center sm:text-left">
              <h3 className="text-base font-black text-white mb-1">
                {lang === "en" ? "Still have questions?" : "¿Todavía tenés dudas?"}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === "en" ? "Our team is happy to help." : "Nuestro equipo está listo para ayudarte."}
              </p>
            </div>
            <a href="mailto:info@kustomdev.com" className="shrink-0 px-6 py-2.5 border border-violet-700/50 hover:border-violet-500 text-violet-300 font-black text-xs tracking-[0.2em] uppercase rounded transition-all whitespace-nowrap">
              {lang === "en" ? "Contact us" : "Contactanos"}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Help;