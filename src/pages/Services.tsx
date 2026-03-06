import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "react-intersection-observer";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  tag: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
  link: string;
  featured?: boolean;
  delay?: number;
}> = ({ icon, tag, name, description, price, features, cta, link, featured = false, delay = 0 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`relative flex flex-col border rounded-xl overflow-hidden transition-all duration-700 ease-out group hover:border-violet-600/60 ${
        featured
          ? "border-violet-600/60 bg-violet-950/20"
          : "border-violet-900/40 bg-violet-950/10"
      } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
    
      {featured && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {featured && (
        <div className="absolute top-4 right-4">
          <span className="px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border border-violet-600/60 bg-violet-600/10 text-violet-300">
            Popular
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col gap-5 flex-1">
       
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${featured ? "bg-violet-600/20 text-violet-300" : "bg-violet-950/40 text-gray-500 group-hover:text-violet-400"} transition-colors`}>
            {icon}
          </div>
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-gray-600 mt-1">{tag}</span>
        </div>

        <div>
          <h3 className="text-base font-black text-white tracking-tight mb-2">{name}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-white">{price.split("/")[0]}</span>
          {price.includes("/") && <span className="text-xs text-gray-600">/{price.split("/")[1]}</span>}
        </div>

        <div className="h-px bg-violet-900/30" />

        <ul className="flex flex-col gap-2.5 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="text-violet-500 mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-6 pt-0">
        <Link to={link}>
          <button className={`w-full py-3 text-xs font-black tracking-[0.2em] uppercase rounded transition-all ${
            featured
              ? "bg-violet-500 hover:bg-violet-400 text-black"
              : "border border-violet-700/50 hover:border-violet-500 text-violet-300 hover:bg-violet-900/20"
          }`}>
            {cta}
          </button>
        </Link>
      </div>
    </div>
  );
};

const TechBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-violet-900/50 bg-violet-950/20 text-gray-500">
    {label}
  </span>
);

const Services: React.FC = () => {
  const { lang } = useLanguage();

  const services = [
    {
      tag:         lang === "en" ? "Web presence"      : "Presencia web",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={3} width={18} height={18} rx={2}/><line x1={3} y1={9} x2={21} y2={9}/><line x1={9} y1={21} x2={9} y2={9}/></svg>,
      name:        lang === "en" ? "Landing Page & Website"      : "Landing Page y Sitio Web",
      description: lang === "en"
        ? "Responsive, SEO-optimised websites that convert visitors into clients. Custom design, fast load times, and everything managed for you."
        : "Sitios web responsivos y optimizados para SEO que convierten visitas en clientes. Diseño a medida, carga rápida y todo gestionado por vos.",
      price:       lang === "en" ? "From $99/year"    : "Desde $99/año",
      features: lang === "en" ? [
        "Responsive design (mobile-first)",
        "On-page SEO optimization",
        "SSL certificate + hosting included",
        "Up to 5 corporate email accounts",
        "Contact forms & lead capture",
        "Technical support included",
      ] : [
        "Diseño responsivo (mobile-first)",
        "Optimización SEO on-page",
        "Certificado SSL + alojamiento incluido",
        "Hasta 5 cuentas de email corporativo",
        "Formularios de contacto y captación",
        "Soporte técnico incluido",
      ],
      cta:  lang === "en" ? "Get started"     : "Empezar",
      link: "/services/landing-page",
    },
    {
      tag:         lang === "en" ? "E-commerce"        : "Comercio electrónico",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={9} cy={21} r={1}/><circle cx={20} cy={21} r={1}/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
      name:        lang === "en" ? "E-commerce Store"             : "Tienda Virtual",
      description: lang === "en"
        ? "Full-featured online stores built to sell. Payment gateways, inventory management, and custom storefronts — all optimised for conversions."
        : "Tiendas virtuales completas construidas para vender. Pasarelas de pago, gestión de inventario y frentes de tienda a medida — todo optimizado para conversiones.",
      price:       lang === "en" ? "From $99/month"   : "Desde $99/mes",
      features: lang === "en" ? [
        "Payment gateway integration (Stripe, PayPal, MercadoPago)",
        "Unlimited products",
        "Inventory & order management",
        "Mobile-optimised checkout",
        "Analytics & sales reporting",
        "Scalable as you grow",
      ] : [
        "Integración de pasarelas de pago (Stripe, PayPal, MercadoPago)",
        "Productos ilimitados",
        "Gestión de inventario y pedidos",
        "Checkout optimizado para móviles",
        "Analítica e informes de ventas",
        "Escalable a medida que crecés",
      ],
      cta:      lang === "en" ? "Get started"     : "Empezar",
      link:     "/services/ecommerce",
      featured: true,
    },
    {
      tag:         lang === "en" ? "Custom development" : "Desarrollo a medida",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
      name:        lang === "en" ? "Custom Web Application"       : "Aplicación Web a Medida",
      description: lang === "en"
        ? "Complex platforms, internal tools, APIs and SaaS products built from scratch. Matched with a developer whose stack fits your project exactly."
        : "Plataformas complejas, herramientas internas, APIs y productos SaaS construidos desde cero. Conectado con un desarrollador cuyo stack encaja exactamente con tu proyecto.",
      price:       lang === "en" ? "From $500/project" : "Desde $500/proyecto",
      features: lang === "en" ? [
        "Full-stack development",
        "Database design & architecture",
        "Third-party API integrations",
        "Authentication & user management",
        "Deployment & CI/CD pipeline",
        "Ongoing support options",
      ] : [
        "Desarrollo full-stack",
        "Diseño de base de datos y arquitectura",
        "Integraciones con APIs de terceros",
        "Autenticación y gestión de usuarios",
        "Despliegue y pipeline CI/CD",
        "Opciones de soporte continuo",
      ],
      cta:  lang === "en" ? "Get a quote"     : "Pedir cotización",
      link: "/services/custom-app",
    },
    {
      tag:         lang === "en" ? "Support"           : "Soporte",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
      name:        lang === "en" ? "Technical Support"             : "Soporte Técnico",
      description: lang === "en"
        ? "Dedicated web technical support — bug fixes, performance tuning, updates, and consulting. No ticket limits, no hourly caps."
        : "Soporte técnico web dedicado — corrección de errores, optimización de rendimiento, actualizaciones y consultoría. Sin límite de tickets ni de horas.",
      price:       lang === "en" ? "From $149/month"  : "Desde $149/mes",
      features: lang === "en" ? [
        "Unlimited support tickets",
        "Guaranteed 24h response time",
        "Performance optimization",
        "Security monitoring & updates",
        "Consulting & code reviews",
        "Priority escalation",
      ] : [
        "Tickets de soporte ilimitados",
        "Tiempo de respuesta garantizado de 24h",
        "Optimización de rendimiento",
        "Monitoreo de seguridad y actualizaciones",
        "Consultoría y revisiones de código",
        "Escalado prioritario",
      ],
      cta:  lang === "en" ? "Get started"     : "Empezar",
      link: "/services/support",
    },
  ];

  const stack = ["React", "Next.js", "TypeScript", "Node.js", "Python", "AWS", "Supabase", "PostgreSQL", "MongoDB", "React Native", "Tailwind CSS", "GraphQL"];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-0 relative overflow-hidden">
  
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <div className="text-center mb-16">
            <div className="flex items-center gap-3 justify-center mb-5">
              <div className="h-px w-6 bg-violet-700" />
              <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600">
                {lang === "en" ? "What we offer" : "Lo que ofrecemos"}
              </span>
              <div className="h-px w-6 bg-violet-700" />
            </div>
            <h1 className="font-black text-white tracking-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {lang === "en" ? "Services built to" : "Servicios construidos"}{" "}
              <span className="text-violet-400">{lang === "en" ? "scale" : "para escalar"}</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
              {lang === "en"
                ? "From your first website to a full SaaS product — matched with a developer who's done it before."
                : "Desde tu primer sitio hasta un producto SaaS completo — conectado con un desarrollador que ya lo hizo."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-20">
            {services.map((s, i) => (
              <ServiceCard key={s.name} {...s} delay={i * 100} />
            ))}
          </div>

          <div className="mb-20">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600 text-center mb-5">
              {lang === "en" ? "Technologies we work with" : "Tecnologías con las que trabajamos"}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {stack.map((t) => <TechBadge key={t} label={t} />)}
            </div>
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border border-violet-800/40 rounded-xl bg-violet-950/10 overflow-hidden mb-0">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-24 bg-violet-700 opacity-[0.05] blur-3xl rounded-full" />
            </div>
            <div className="relative text-center sm:text-left">
              <h3 className="text-base font-black text-white mb-1">
                {lang === "en" ? "Not sure which fits?" : "¿No sabés cuál es para vos?"}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === "en" ? "Book a free consultation and we'll scope your project together." : "Agendá una consulta gratis y definimos tu proyecto juntos."}
              </p>
            </div>
            <div className="relative flex gap-3 shrink-0">
              <Link to="/free-consultation">
                <button className="px-6 py-2.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all whitespace-nowrap">
                  {lang === "en" ? "Free consultation" : "Consulta gratis"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Services;