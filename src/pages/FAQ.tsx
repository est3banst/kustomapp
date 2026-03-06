import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Category = "general" | "business" | "developer" | "billing" | "security";

interface FAQItem {
  q: string;
  a: string;
}

const AccordionItem: React.FC<{ item: FAQItem; defaultOpen?: boolean }> = ({ item, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-200 ${open ? "border-violet-700/50 bg-violet-950/20" : "border-violet-900/30 bg-violet-950/10 hover:border-violet-800/40"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left group">
        <span className={`text-sm font-semibold leading-snug transition-colors ${open ? "text-violet-200" : "text-gray-300 group-hover:text-white"}`}>
          {item.q}
        </span>
        <span className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${open ? "border-violet-600 bg-violet-600/20 rotate-45" : "border-violet-900/50"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={open ? "text-violet-300" : "text-gray-600"}>
            <line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/>
          </svg>
        </span>
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-[500px]" : "max-h-0"}`}>
        <p className="px-6 pb-5 text-xs text-gray-500 leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const { lang } = useLanguage();
  const [active, setActive] = useState<Category>("general");

  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    {
      id: "general",
      label: lang === "en" ? "General" : "General",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1={12} y1={17} x2={12} y2={17}/></svg>,
    },
    {
      id: "business",
      label: lang === "en" ? "For Businesses" : "Para Negocios",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={2} y={7} width={20} height={14} rx={2}/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    },
    {
      id: "developer",
      label: lang === "en" ? "For Developers" : "Para Devs",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    },
    {
      id: "billing",
      label: lang === "en" ? "Billing & Payments" : "Pagos",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={1} y={4} width={22} height={16} rx={2}/><line x1={1} y1={10} x2={23} y2={10}/></svg>,
    },
    {
      id: "security",
      label: lang === "en" ? "Security & Privacy" : "Seguridad",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    },
  ];

  const faqs: Record<Category, FAQItem[]> = {
    general: [
      {
        q: lang === "en" ? "What is Kustom?" : "¿Qué es Kustom?",
        a: lang === "en"
          ? "Kustom is a platform that connects businesses that need digital solutions with vetted developers who can build them. Whether you need a website, an e-commerce store, a custom app, or ongoing technical support — Kustom matches you with the right professional for the job."
          : "Kustom es una plataforma que conecta negocios que necesitan soluciones digitales con desarrolladores verificados que pueden construirlas. Ya sea que necesites un sitio web, una tienda online, una app a medida o soporte técnico continuo — Kustom te conecta con el profesional adecuado.",
      },
      {
        q: lang === "en" ? "Is Kustom free to join?" : "¿Es gratis unirse a Kustom?",
        a: lang === "en"
          ? "Yes. Creating an account is completely free for both businesses and developers. You only pay when you hire a developer or purchase a service package. Developers pay a 10% platform fee only on completed projects."
          : "Sí. Crear una cuenta es completamente gratuito tanto para negocios como para desarrolladores. Solo pagás cuando contratás un desarrollador o comprás un paquete de servicio. Los desarrolladores pagan un 10% de comisión solo en proyectos completados.",
      },
      {
        q: lang === "en" ? "What countries does Kustom operate in?" : "¿En qué países opera Kustom?",
        a: lang === "en"
          ? "Kustom is available worldwide. Our developer network is primarily based in Latin America and Spain, but we work with businesses globally. Projects can be conducted remotely in Spanish or English."
          : "Kustom está disponible en todo el mundo. Nuestra red de desarrolladores se basa principalmente en América Latina y España, pero trabajamos con negocios de todo el mundo. Los proyectos se pueden realizar de forma remota en español o inglés.",
      },
      {
        q: lang === "en" ? "What languages is the platform available in?" : "¿En qué idiomas está disponible la plataforma?",
        a: lang === "en"
          ? "Kustom is fully available in English and Spanish. You can switch languages at any time using the toggle in the navigation bar."
          : "Kustom está completamente disponible en inglés y español. Podés cambiar de idioma en cualquier momento usando el selector en la barra de navegación.",
      },
      {
        q: lang === "en" ? "How do I get support if something goes wrong?" : "¿Cómo obtengo soporte si algo sale mal?",
        a: lang === "en"
          ? "You can contact our team at any time via the Help center or by emailing info@kustomdev.com. For active project disputes, we have a dedicated resolution process that protects both clients and developers."
          : "Podés contactar a nuestro equipo en cualquier momento desde el Centro de Ayuda o escribiendo a info@kustomdev.com. Para disputas en proyectos activos, tenemos un proceso de resolución dedicado que protege tanto a clientes como a desarrolladores.",
      },
    ],
    business: [
      {
        q: lang === "en" ? "How do I post a project?" : "¿Cómo publico un proyecto?",
        a: lang === "en"
          ? "Create a free account and go to your dashboard. Click 'Post a project', fill in the description, required skills, timeline, and budget. Once published, matching developers will be able to send you proposals."
          : "Creá una cuenta gratis y andá a tu panel. Hacé clic en 'Publicar proyecto', completá la descripción, habilidades requeridas, plazo y presupuesto. Una vez publicado, los desarrolladores que coincidan podrán enviarte propuestas.",
      },
      {
        q: lang === "en" ? "How quickly will I get proposals?" : "¿Qué tan rápido recibiré propuestas?",
        a: lang === "en"
          ? "For most projects, you can expect your first proposals within a few hours of posting. If your project requires rare skills, it may take 1–2 business days. You can also book a free consultation and we'll proactively match you with the right developer."
          : "Para la mayoría de los proyectos, podés esperar las primeras propuestas pocas horas después de publicar. Si tu proyecto requiere habilidades poco comunes, puede demorar 1–2 días hábiles. También podés reservar una consulta gratuita y te conectamos proactivamente con el desarrollador adecuado.",
      },
      {
        q: lang === "en" ? "Can I hire the same developer again?" : "¿Puedo contratar al mismo desarrollador otra vez?",
        a: lang === "en"
          ? "Absolutely. Once you've worked with a developer, you can contact them directly for future projects through your dashboard. Building a long-term working relationship with a developer who knows your stack is strongly encouraged."
          : "Por supuesto. Una vez que trabajaste con un desarrollador, podés contactarlo directamente para proyectos futuros desde tu panel. Se recomienda construir una relación de trabajo a largo plazo con un desarrollador que conoce tu stack.",
      },
      {
        q: lang === "en" ? "What if the delivered work doesn't meet expectations?" : "¿Qué pasa si el trabajo entregado no cumple las expectativas?",
        a: lang === "en"
          ? "Payments are held in escrow and only released when you approve the work. If there's a disagreement, you can open a dispute. Our team reviews the agreed deliverables and mediates a resolution — including partial or full refunds where the developer didn't deliver what was specified."
          : "Los pagos se retienen en custodia y solo se liberan cuando aprobás el trabajo. Si hay un desacuerdo, podés abrir una disputa. Nuestro equipo revisa los entregables acordados y media una solución, incluyendo reembolsos parciales o totales cuando el desarrollador no entregó lo especificado.",
      },
      {
        q: lang === "en" ? "Do I need a technical background to use Kustom?" : "¿Necesito conocimientos técnicos para usar Kustom?",
        a: lang === "en"
          ? "Not at all. Kustom is designed for non-technical business owners. During a free consultation, we help you scope your project, translate your business needs into technical requirements, and find the right developer. You focus on the business side — we handle the tech translation."
          : "Para nada. Kustom está diseñado para dueños de negocios sin conocimientos técnicos. Durante una consulta gratuita, te ayudamos a definir tu proyecto, traducir tus necesidades de negocio en requisitos técnicos y encontrar al desarrollador adecuado. Vos te enfocás en el negocio — nosotros nos ocupamos de la parte técnica.",
      },
    ],
    developer: [
      {
        q: lang === "en" ? "How do I apply to join Kustom as a developer?" : "¿Cómo me postulo para unirme a Kustom como desarrollador?",
        a: lang === "en"
          ? "Register with the 'Developer' role, complete your profile with your skills, portfolio links and hourly rate, then submit for verification. Our team reviews your application within 2–5 business days. We look for a solid portfolio, clear communication, and professional reliability."
          : "Registrate eligiendo el rol 'Desarrollador', completá tu perfil con tus habilidades, links de portfolio y tarifa por hora, luego enviá para verificación. Nuestro equipo revisa tu solicitud en 2–5 días hábiles. Buscamos un portfolio sólido, comunicación clara y confiabilidad profesional.",
      },
      {
        q: lang === "en" ? "What does the verification process involve?" : "¿En qué consiste el proceso de verificación?",
        a: lang === "en"
          ? "We review your portfolio and listed skills, conduct a short technical assessment tailored to your stack, and verify your identity via a government-issued ID. This protects clients and ensures our developer network maintains quality standards."
          : "Revisamos tu portfolio y habilidades declaradas, realizamos una evaluación técnica corta adaptada a tu stack y verificamos tu identidad con un documento oficial. Esto protege a los clientes y asegura que nuestra red de desarrolladores mantenga estándares de calidad.",
      },
      {
        q: lang === "en" ? "Can I set my own rate?" : "¿Puedo establecer mi propia tarifa?",
        a: lang === "en"
          ? "Yes, completely. You set your own hourly rate and project rates. You can also submit custom quotes for individual projects. Kustom does not cap what you can charge."
          : "Sí, completamente. Vos establecés tu propia tarifa por hora y por proyecto. También podés enviar cotizaciones personalizadas para proyectos individuales. Kustom no limita lo que podés cobrar.",
      },
      {
        q: lang === "en" ? "How many projects can I take on at once?" : "¿Cuántos proyectos puedo tomar a la vez?",
        a: lang === "en"
          ? "There is no hard limit, but we recommend keeping your availability status up to date on your profile. Clients rely on this to judge whether you're a good fit for their timeline. Taking on more than you can handle negatively impacts your rating."
          : "No hay un límite estricto, pero recomendamos mantener tu estado de disponibilidad actualizado en tu perfil. Los clientes dependen de esto para juzgar si sos adecuado para su plazo. Tomar más de lo que podés manejar impacta negativamente tu calificación.",
      },
      {
        q: lang === "en" ? "What happens if a client opens a dispute?" : "¿Qué pasa si un cliente abre una disputa?",
        a: lang === "en"
          ? "You'll be notified immediately and asked to present your side along with any deliverables, communications, and relevant files. Our team reviews all evidence objectively and reaches a decision within 5 business days. Disputes are rare and usually resolved amicably."
          : "Serás notificado de inmediato y se te pedirá que presentes tu versión junto con los entregables, comunicaciones y archivos relevantes. Nuestro equipo revisa toda la evidencia objetivamente y llega a una decisión en 5 días hábiles. Las disputas son raras y generalmente se resuelven amigablemente.",
      },
    ],
    billing: [
      {
        q: lang === "en" ? "What payment methods are accepted?" : "¿Qué métodos de pago se aceptan?",
        a: lang === "en"
          ? "We accept all major credit and debit cards via Stripe, as well as PayPal. For large enterprise projects, bank transfers may be arranged. In supported regions, MercadoPago is also available."
          : "Aceptamos todas las tarjetas de crédito y débito principales a través de Stripe, así como PayPal. Para proyectos empresariales grandes, se pueden acordar transferencias bancarias. En regiones compatibles, MercadoPago también está disponible.",
      },
      {
        q: lang === "en" ? "How does the escrow system work?" : "¿Cómo funciona el sistema de custodia?",
        a: lang === "en"
          ? "When you fund a project milestone, your payment is held securely by Kustom. The developer can see the funds are in escrow, which motivates delivery. Once you approve the milestone, funds are released to the developer within 24 hours. You never pay before you're satisfied."
          : "Cuando financiás un hito del proyecto, tu pago es retenido de forma segura por Kustom. El desarrollador puede ver que los fondos están en custodia, lo que motiva la entrega. Una vez que aprobás el hito, los fondos se liberan al desarrollador en 24 horas. Nunca pagás antes de estar satisfecho.",
      },
      {
        q: lang === "en" ? "Are there any hidden fees?" : "¿Hay cargos ocultos?",
        a: lang === "en"
          ? "No hidden fees. Businesses pay only for the agreed project scope. Developers pay a transparent 10% platform fee on completed milestones — this is deducted automatically from the payout, so developers set their rates accordingly."
          : "Sin cargos ocultos. Los negocios pagan solo por el alcance del proyecto acordado. Los desarrolladores pagan una comisión de plataforma transparente del 10% sobre los hitos completados — esto se deduce automáticamente del pago, por lo que los desarrolladores establecen sus tarifas en consecuencia.",
      },
      {
        q: lang === "en" ? "Can I get a refund?" : "¿Puedo obtener un reembolso?",
        a: lang === "en"
          ? "Funds held in escrow for a milestone that has not yet been approved can be refunded. Once you've approved a milestone and funds have been released to the developer, refunds are handled through the dispute process. We assess each case individually and fairly."
          : "Los fondos retenidos en custodia para un hito que aún no fue aprobado pueden ser reembolsados. Una vez que aprobaste un hito y los fondos se liberaron al desarrollador, los reembolsos se manejan a través del proceso de disputa. Evaluamos cada caso de forma individual y justa.",
      },
      {
        q: lang === "en" ? "How do developers withdraw their earnings?" : "¿Cómo retiran sus ganancias los desarrolladores?",
        a: lang === "en"
          ? "Developers can withdraw from their Kustom wallet to a linked bank account or PayPal at any time, with a minimum withdrawal of $20. Withdrawals are processed within 1–3 business days depending on your bank and region."
          : "Los desarrolladores pueden retirar desde su billetera Kustom a una cuenta bancaria vinculada o PayPal en cualquier momento, con un retiro mínimo de $20. Los retiros se procesan en 1–3 días hábiles según tu banco y región.",
      },
    ],
    security: [
      {
        q: lang === "en" ? "How is my personal data protected?" : "¿Cómo se protegen mis datos personales?",
        a: lang === "en"
          ? "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never sell your personal data to third parties. Our infrastructure is hosted on AWS with strict access controls, and we follow GDPR principles for all users globally."
          : "Todos los datos están cifrados en tránsito (TLS 1.3) y en reposo (AES-256). Nunca vendemos tus datos personales a terceros. Nuestra infraestructura está alojada en AWS con estrictos controles de acceso y seguimos los principios del GDPR para todos los usuarios globalmente.",
      },
      {
        q: lang === "en" ? "How does Kustom handle authentication?" : "¿Cómo maneja Kustom la autenticación?",
        a: lang === "en"
          ? "Authentication is powered by AWS Cognito with email verification required at registration. Passwords are never stored in plain text. We support multi-factor authentication (MFA) and sessions expire after a period of inactivity."
          : "La autenticación está impulsada por AWS Cognito con verificación de email requerida en el registro. Las contraseñas nunca se almacenan en texto plano. Soportamos autenticación multifactor (MFA) y las sesiones expiran después de un período de inactividad.",
      },
      {
        q: lang === "en" ? "Who can see my project details?" : "¿Quién puede ver los detalles de mi proyecto?",
        a: lang === "en"
          ? "Only the client who posted the project and developers who have been specifically invited or matched can see project details. Your financial information (budgets, rates) is never visible to uninvolved third parties."
          : "Solo el cliente que publicó el proyecto y los desarrolladores que fueron específicamente invitados o conectados pueden ver los detalles del proyecto. Tu información financiera (presupuestos, tarifas) nunca es visible para terceros no involucrados.",
      },
      {
        q: lang === "en" ? "Can I delete my account and data?" : "¿Puedo eliminar mi cuenta y mis datos?",
        a: lang === "en"
          ? "Yes. You can request full account deletion from your account settings. We will permanently delete your personal data within 30 days, except where we are legally required to retain records (e.g. billing records for tax purposes, as required by law)."
          : "Sí. Podés solicitar la eliminación completa de tu cuenta desde la configuración de tu cuenta. Eliminaremos permanentemente tus datos personales en 30 días, excepto donde estemos legalmente obligados a conservar registros (por ejemplo, registros de facturación por motivos impositivos, según lo requiere la ley).",
      },
    ],
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

          <div className="text-center mb-12">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="h-px w-6 bg-violet-700" />
              <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600">FAQ</span>
              <div className="h-px w-6 bg-violet-700" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              {lang === "en" ? "Frequently asked" : "Preguntas"}
              <span className="text-violet-400"> {lang === "en" ? "questions" : "frecuentes"}</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              {lang === "en"
                ? "Can't find what you're looking for? Email us at "
                : "¿No encontrás lo que buscás? Escribinos a "}
              <a href="mailto:info@kustomdev.com" className="text-violet-400 hover:text-violet-300 transition-colors">info@kustomdev.com</a>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all border ${
                  active === cat.id
                    ? "border-violet-600/60 bg-violet-950/40 text-violet-300"
                    : "border-violet-900/30 bg-violet-950/10 text-gray-600 hover:text-gray-400 hover:border-violet-800/40"
                }`}
              >
                <span className={active === cat.id ? "text-violet-400" : "text-gray-700"}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-16">
            {faqs[active].map((item, i) => (
              <AccordionItem key={item.q} item={item} defaultOpen={i === 0} />
            ))}
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border border-violet-800/40 rounded-xl bg-violet-950/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/50 to-transparent" />
            <div className="text-center sm:text-left">
              <h3 className="text-base font-black text-white mb-1">
                {lang === "en" ? "Still have questions?" : "¿Todavía tenés dudas?"}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === "en" ? "Our team is happy to help you personally." : "Nuestro equipo está listo para ayudarte personalmente."}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/free-consultation">
                <button className="px-5 py-2.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all whitespace-nowrap">
                  {lang === "en" ? "Free consultation" : "Consulta gratis"}
                </button>
              </Link>
              <a href="mailto:info@kustomdev.com">
                <button className="px-5 py-2.5 border border-violet-700/50 hover:border-violet-500 text-violet-300 font-black text-xs tracking-[0.2em] uppercase rounded transition-all whitespace-nowrap">
                  {lang === "en" ? "Email us" : "Escribinos"}
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;