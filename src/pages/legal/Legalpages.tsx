
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Section { heading: string; body: string | string[] }

const LegalPage: React.FC<{
  badge: string;
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}> = ({ badge, title, updated, intro, sections }) => (
  <>
    <Nav />
    <div className="min-h-screen bg-black pt-24 pb-0 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-violet-700 opacity-[0.04] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 rounded-full text-[9px] font-black tracking-[0.3em] uppercase border border-violet-700/50 bg-violet-950/30 text-violet-400">
              {badge}
            </span>
            <span className="text-[10px] text-gray-600">{updated}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">{title}</h1>
          <p className="text-sm text-gray-500 leading-relaxed">{intro}</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-violet-900/60 to-transparent mb-10" />

        <div className="flex flex-col gap-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-base font-black text-white mb-3 flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-700 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                {s.heading}
              </h2>
              {Array.isArray(s.body) ? (
                <ul className="flex flex-col gap-2 pl-9">
                  {s.body.map((item, j) => (
                    <li key={j} className="text-xs text-gray-500 leading-relaxed flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 leading-relaxed pl-9">{s.body}</p>
              )}
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-violet-900/60 to-transparent my-12" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-600">
          <span>
        
            {`Questions? `}
            <a href="mailto:info@kustomdev.com" className="text-violet-400 hover:text-violet-300 transition-colors">info@kustomdev.com</a>
          </span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link to="/terms"   className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-gray-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
);


export const PrivacyPolicy: React.FC = () => {
  const { lang } = useLanguage();
  const en = lang === "en";

  return (
    <LegalPage
      badge={en ? "Legal" : "Legal"}
      title={en ? "Privacy Policy" : "Política de Privacidad"}
      updated={en ? "Last updated: January 2025" : "Última actualización: enero 2025"}
      intro={en
        ? "Kustom ('we', 'us', 'our') is committed to protecting your personal data. This policy explains what information we collect, how we use it, and your rights regarding your data."
        : "Kustom ('nosotros') está comprometido con la protección de tus datos personales. Esta política explica qué información recopilamos, cómo la usamos y tus derechos sobre tus datos."}
      sections={[
        {
          heading: en ? "Information we collect" : "Información que recopilamos",
          body: en
            ? ["Account data: name, email address, and password (hashed) when you register.",
               "Profile data: username, display name, skills, portfolio links, hourly rates, and role (business or developer).",
               "Usage data: pages visited, features used, session duration, and browser/device information.",
               "Transaction data: payment amounts, project milestones, and payout records (we do not store full card numbers — this is handled by Stripe/PayPal).",
               "Communications: messages sent through the platform between clients and developers."]
            : ["Datos de cuenta: nombre, dirección de email y contraseña (hasheada) al registrarte.",
               "Datos de perfil: nombre de usuario, nombre para mostrar, habilidades, links de portfolio, tarifas por hora y rol (negocio o desarrollador).",
               "Datos de uso: páginas visitadas, funciones usadas, duración de sesión e información del navegador/dispositivo.",
               "Datos de transacciones: montos de pago, hitos de proyectos y registros de pagos (no almacenamos números de tarjeta completos — esto lo gestiona Stripe/PayPal).",
               "Comunicaciones: mensajes enviados a través de la plataforma entre clientes y desarrolladores."],
        },
        {
          heading: en ? "How we use your information" : "Cómo usamos tu información",
          body: en
            ? ["To create and manage your account and authenticate your identity via AWS Cognito.",
               "To match businesses with suitable developers based on project requirements and skills.",
               "To process payments and manage escrow transactions securely.",
               "To send transactional emails (account verification, password reset, project updates).",
               "To improve the platform through anonymised usage analytics.",
               "To resolve disputes between clients and developers.",
               "To comply with legal obligations, including financial record-keeping requirements."]
            : ["Para crear y gestionar tu cuenta y autenticar tu identidad a través de AWS Cognito.",
               "Para conectar negocios con desarrolladores adecuados según los requisitos del proyecto y habilidades.",
               "Para procesar pagos y gestionar transacciones en custodia de forma segura.",
               "Para enviar emails transaccionales (verificación de cuenta, restablecimiento de contraseña, actualizaciones de proyectos).",
               "Para mejorar la plataforma mediante análisis de uso anonimizados.",
               "Para resolver disputas entre clientes y desarrolladores.",
               "Para cumplir con obligaciones legales, incluidos los requisitos de registro financiero."],
        },
        {
          heading: en ? "Data sharing" : "Compartición de datos",
          body: en
            ? "We do not sell your personal data. We share data only with: (a) payment processors (Stripe, PayPal, MercadoPago) to handle transactions; (b) AWS for hosting, authentication, and infrastructure; (c) law enforcement where legally required. Developers see only the project and contact information you choose to share."
            : "No vendemos tus datos personales. Compartimos datos solo con: (a) procesadores de pago (Stripe, PayPal, MercadoPago) para gestionar transacciones; (b) AWS para alojamiento, autenticación e infraestructura; (c) autoridades legales cuando sea legalmente requerido. Los desarrolladores solo ven la información del proyecto y de contacto que elegís compartir.",
        },
        {
          heading: en ? "Data retention" : "Retención de datos",
          body: en
            ? "We retain your account data for as long as your account is active. If you delete your account, personal data is removed within 30 days. Transaction and billing records are retained for 7 years as required by applicable tax law. Anonymised usage analytics are retained indefinitely."
            : "Conservamos tus datos de cuenta mientras tu cuenta esté activa. Si eliminás tu cuenta, los datos personales se eliminan en 30 días. Los registros de transacciones y facturación se conservan durante 7 años según lo exige la legislación fiscal aplicable. Los análisis de uso anonimizados se conservan indefinidamente.",
        },
        {
          heading: en ? "Your rights" : "Tus derechos",
          body: en
            ? ["Access: request a copy of the personal data we hold about you.",
               "Rectification: ask us to correct inaccurate or incomplete data.",
               "Erasure: request deletion of your account and personal data.",
               "Portability: receive your data in a structured, machine-readable format.",
               "Objection: object to processing based on legitimate interests.",
               "To exercise any of these rights, email us at info@kustomdev.com."]
            : ["Acceso: solicitá una copia de los datos personales que tenemos sobre vos.",
               "Rectificación: pedinos que corrijamos datos inexactos o incompletos.",
               "Eliminación: solicitá la eliminación de tu cuenta y datos personales.",
               "Portabilidad: recibí tus datos en un formato estructurado y legible por máquina.",
               "Objeción: oponete al procesamiento basado en intereses legítimos.",
               "Para ejercer cualquiera de estos derechos, escribinos a info@kustomdev.com."],
        },
        {
          heading: en ? "Security" : "Seguridad",
          body: en
            ? "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Access to production systems is restricted to authorised personnel only. We conduct periodic security reviews and follow AWS security best practices."
            : "Todos los datos están cifrados en tránsito usando TLS 1.3 y en reposo usando cifrado AES-256. El acceso a los sistemas de producción está restringido solo al personal autorizado. Realizamos revisiones de seguridad periódicas y seguimos las mejores prácticas de seguridad de AWS.",
        },
        {
          heading: en ? "Contact" : "Contacto",
          body: en
            ? "For any questions regarding this policy or your personal data, contact us at info@kustomdev.com. We aim to respond within 5 business days."
            : "Para cualquier pregunta sobre esta política o tus datos personales, contactanos en info@kustomdev.com. Apuntamos a responder en 5 días hábiles.",
        },
      ]}
    />
  );
};


export const TermsOfService: React.FC = () => {
  const { lang } = useLanguage();
  const en = lang === "en";

  return (
    <LegalPage
      badge={en ? "Legal" : "Legal"}
      title={en ? "Terms of Service" : "Términos del Servicio"}
      updated={en ? "Last updated: January 2025" : "Última actualización: enero 2025"}
      intro={en
        ? "By creating an account or using Kustom, you agree to these Terms of Service. Please read them carefully. If you do not agree, do not use the platform."
        : "Al crear una cuenta o usar Kustom, aceptás estos Términos del Servicio. Por favor leélos detenidamente. Si no estás de acuerdo, no uses la plataforma."}
      sections={[
        {
          heading: en ? "The platform" : "La plataforma",
          body: en
            ? "Kustom provides a marketplace that connects businesses ('Clients') with independent software developers ('Developers'). Kustom is not a party to any contract between Clients and Developers — we provide the infrastructure, matching tools, and payment escrow."
            : "Kustom provee un mercado que conecta negocios ('Clientes') con desarrolladores de software independientes ('Desarrolladores'). Kustom no es parte de ningún contrato entre Clientes y Desarrolladores — proveemos la infraestructura, las herramientas de conexión y la custodia de pagos.",
        },
        {
          heading: en ? "Account eligibility" : "Elegibilidad de cuenta",
          body: en
            ? ["You must be at least 18 years old to create an account.",
               "You must provide accurate, current, and complete information at registration.",
               "You are responsible for keeping your login credentials confidential.",
               "You may not create more than one account per person or entity.",
               "Kustom reserves the right to suspend or terminate accounts that violate these terms."]
            : ["Debés tener al menos 18 años para crear una cuenta.",
               "Debés proporcionar información precisa, actualizada y completa en el registro.",
               "Sos responsable de mantener tus credenciales de acceso en confidencialidad.",
               "No podés crear más de una cuenta por persona o entidad.",
               "Kustom se reserva el derecho de suspender o terminar cuentas que violen estos términos."],
        },
        {
          heading: en ? "Client responsibilities" : "Responsabilidades del Cliente",
          body: en
            ? ["Provide clear, accurate project descriptions and requirements.",
               "Fund project milestones before work begins.",
               "Review and approve (or request revisions to) deliverables within 7 days of submission. Failure to respond will result in automatic approval.",
               "Communicate professionally with developers at all times.",
               "Not circumvent the platform by hiring developers found on Kustom through other channels for 12 months after initial contact."]
            : ["Proporcionar descripciones y requisitos de proyecto claros y precisos.",
               "Financiar los hitos del proyecto antes de que comience el trabajo.",
               "Revisar y aprobar (o solicitar revisiones de) entregables dentro de los 7 días de entrega. La falta de respuesta resultará en aprobación automática.",
               "Comunicarse profesionalmente con los desarrolladores en todo momento.",
               "No eludir la plataforma contratando desarrolladores encontrados en Kustom a través de otros canales durante 12 meses después del contacto inicial."],
        },
        {
          heading: en ? "Developer responsibilities" : "Responsabilidades del Desarrollador",
          body: en
            ? ["Complete the verification process accurately and honestly.",
               "Only apply to projects for which you have the required skills.",
               "Deliver work on time and to the standard described in the agreed scope.",
               "Communicate proactively with clients — notify them immediately of delays or blockers.",
               "Not use client data, code, or intellectual property outside the scope of the agreed project.",
               "Maintain an accurate availability status on your profile."]
            : ["Completar el proceso de verificación de forma precisa y honesta.",
               "Solo postularse a proyectos para los que tenés las habilidades requeridas.",
               "Entregar trabajo a tiempo y con el estándar descrito en el alcance acordado.",
               "Comunicarse proactivamente con los clientes — notificarlos inmediatamente de demoras o bloqueos.",
               "No usar datos, código o propiedad intelectual del cliente fuera del alcance del proyecto acordado.",
               "Mantener un estado de disponibilidad preciso en tu perfil."],
        },
        {
          heading: en ? "Intellectual property" : "Propiedad intelectual",
          body: en
            ? "Upon full payment of a completed project milestone, the Client receives full ownership of all custom code and assets delivered specifically for that project. Developers retain ownership of pre-existing tools, frameworks, libraries, and general-purpose code. Kustom retains no rights to project deliverables."
            : "Tras el pago completo de un hito de proyecto completado, el Cliente recibe la propiedad total de todo el código personalizado y los activos entregados específicamente para ese proyecto. Los Desarrolladores retienen la propiedad de herramientas, frameworks, bibliotecas y código de propósito general preexistentes. Kustom no retiene ningún derecho sobre los entregables del proyecto.",
        },
        {
          heading: en ? "Prohibited conduct" : "Conducta prohibida",
          body: en
            ? ["Posting false, misleading, or fraudulent project listings or profiles.",
               "Harassing, threatening, or abusing any user of the platform.",
               "Attempting to manipulate ratings or reviews.",
               "Using the platform for any illegal activity.",
               "Attempting to bypass the escrow or payment system.",
               "Scraping or automated access to the platform without written permission."]
            : ["Publicar proyectos o perfiles falsos, engañosos o fraudulentos.",
               "Acosar, amenazar o abusar de cualquier usuario de la plataforma.",
               "Intentar manipular calificaciones o reseñas.",
               "Usar la plataforma para cualquier actividad ilegal.",
               "Intentar eludir el sistema de custodia o pago.",
               "Scraping o acceso automatizado a la plataforma sin permiso escrito."],
        },
        {
          heading: en ? "Limitation of liability" : "Limitación de responsabilidad",
          body: en
            ? "Kustom is a marketplace platform and is not liable for the quality, timeliness, legality, or any other aspect of services provided by Developers. To the maximum extent permitted by law, Kustom's total liability for any claim arising from use of the platform is limited to the fees paid by you to Kustom in the 3 months preceding the claim."
            : "Kustom es una plataforma de mercado y no es responsable por la calidad, puntualidad, legalidad o cualquier otro aspecto de los servicios proporcionados por los Desarrolladores. En la medida máxima permitida por la ley, la responsabilidad total de Kustom por cualquier reclamo derivado del uso de la plataforma se limita a las tarifas pagadas por vos a Kustom en los 3 meses anteriores al reclamo.",
        },
        {
          heading: en ? "Changes to these terms" : "Cambios en estos términos",
          body: en
            ? "We may update these terms from time to time. We will notify you of material changes via email or a prominent notice on the platform at least 14 days before they take effect. Continued use of Kustom after changes take effect constitutes acceptance of the new terms."
            : "Podemos actualizar estos términos de vez en cuando. Te notificaremos de cambios materiales por email o con un aviso destacado en la plataforma al menos 14 días antes de que entren en vigencia. El uso continuado de Kustom después de que los cambios entren en vigencia constituye la aceptación de los nuevos términos.",
        },
      ]}
    />
  );
};


export const CookiePolicy: React.FC = () => {
  const { lang } = useLanguage();
  const en = lang === "en";

  return (
    <LegalPage
      badge={en ? "Legal" : "Legal"}
      title={en ? "Cookie Policy" : "Política de Cookies"}
      updated={en ? "Last updated: January 2025" : "Última actualización: enero 2025"}
      intro={en
        ? "Kustom uses cookies and similar technologies to keep the platform working, remember your preferences, and understand how people use our site. This policy explains what we use and why."
        : "Kustom usa cookies y tecnologías similares para mantener la plataforma funcionando, recordar tus preferencias y entender cómo las personas usan nuestro sitio. Esta política explica qué usamos y por qué."}
      sections={[
        {
          heading: en ? "What are cookies?" : "¿Qué son las cookies?",
          body: en
            ? "Cookies are small text files stored in your browser when you visit a website. They allow the site to remember information about your visit — such as your login session or language preference — so you don't have to re-enter it every time."
            : "Las cookies son pequeños archivos de texto almacenados en tu navegador cuando visitás un sitio web. Permiten que el sitio recuerde información sobre tu visita — como tu sesión de inicio de sesión o preferencia de idioma — para que no tengas que ingresarla cada vez.",
        },
        {
          heading: en ? "Essential cookies" : "Cookies esenciales",
          body: en
            ? ["Authentication session: keeps you logged in securely across pages. Set by AWS Cognito. Cannot be disabled.",
               "CSRF protection: prevents cross-site request forgery attacks. Required for security. Cannot be disabled.",
               "Language preference: remembers your chosen language (EN/ES). Cannot be disabled."]
            : ["Sesión de autenticación: te mantiene conectado de forma segura entre páginas. Establecida por AWS Cognito. No se puede deshabilitar.",
               "Protección CSRF: previene ataques de falsificación de solicitudes entre sitios. Requerida por seguridad. No se puede deshabilitar.",
               "Preferencia de idioma: recuerda tu idioma elegido (ES/EN). No se puede deshabilitar."],
        },
        {
          heading: en ? "Analytics cookies" : "Cookies analíticas",
          body: en
            ? "We use anonymised analytics to understand how users navigate Kustom — which pages are most visited, where users drop off, and how features are used. This data does not identify you personally. You can opt out of analytics cookies in your account settings."
            : "Usamos análisis anonimizados para entender cómo los usuarios navegan Kustom — qué páginas son más visitadas, dónde los usuarios abandonan y cómo se usan las funciones. Estos datos no te identifican personalmente. Podés optar por no recibir cookies analíticas en la configuración de tu cuenta.",
        },
        {
          heading: en ? "Functional cookies" : "Cookies funcionales",
          body: en
            ? ["Dashboard layout preferences: remembers how you've arranged your dashboard.",
               "Filter and sort preferences: remembers your last-used filters on the developer browse and project pages.",
               "Notification dismissals: remembers which in-app banners you've dismissed."]
            : ["Preferencias de diseño del panel: recuerda cómo ordenaste tu panel.",
               "Preferencias de filtro y orden: recuerda tus últimos filtros usados en las páginas de exploración de desarrolladores y proyectos.",
               "Descartado de notificaciones: recuerda qué banners en la app descartaste."],
        },
        {
          heading: en ? "Third-party cookies" : "Cookies de terceros",
          body: en
            ? "Stripe and PayPal set their own cookies when you use the payment flow. These are strictly necessary for processing payments and are governed by Stripe's and PayPal's own privacy policies. We do not use advertising or social media tracking cookies."
            : "Stripe y PayPal establecen sus propias cookies cuando usás el flujo de pago. Estas son estrictamente necesarias para procesar pagos y se rigen por las propias políticas de privacidad de Stripe y PayPal. No usamos cookies de publicidad ni de seguimiento en redes sociales.",
        },
        {
          heading: en ? "Managing cookies" : "Gestión de cookies",
          body: en
            ? "You can control cookies through your browser settings. Disabling essential cookies will prevent you from logging in. To opt out of analytics cookies specifically, go to Account Settings → Privacy. Most modern browsers allow you to block third-party cookies — this will not affect core platform functionality."
            : "Podés controlar las cookies a través de la configuración de tu navegador. Deshabilitar las cookies esenciales te impedirá iniciar sesión. Para desactivar específicamente las cookies analíticas, andá a Configuración de Cuenta → Privacidad. La mayoría de los navegadores modernos permiten bloquear cookies de terceros — esto no afectará la funcionalidad central de la plataforma.",
        },
        {
          heading: en ? "Contact" : "Contacto",
          body: en
            ? "Questions about our use of cookies? Email us at info@kustomdev.com."
            : "¿Preguntas sobre nuestro uso de cookies? Escribinos a info@kustomdev.com.",
        },
      ]}
    />
  );
};