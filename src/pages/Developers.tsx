
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "react-intersection-observer";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Skill = string;

interface DevProfile {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviews: number;
  rate: string;
  skills: Skill[];
  available: boolean;
  location: string;
  projects: number;
}

// Placeholder dev profiles — swap with API data
const DEVS: DevProfile[] = [
  { id: 1, name: "Esteban M.",      role: "Full-stack Developer",    avatar: "A", rating: 5.0, reviews: 34, rate: "$65/hr",  skills: ["React", "Node.js", "TypeScript", "AWS"],        available: true,  location: "Buenos Aires", projects: 28 },
  { id: 2, name: "Sofía R.",     role: "Frontend Specialist",     avatar: "S", rating: 4.9, reviews: 21, rate: "$50/hr",  skills: ["React", "Next.js", "Tailwind", "Figma"],         available: true,  location: "Montevideo",   projects: 19 },
  { id: 3, name: "Matías G.",    role: "Backend Engineer",        avatar: "M", rating: 4.8, reviews: 47, rate: "$70/hr",  skills: ["Python", "Django", "PostgreSQL", "Docker"],      available: false, location: "Córdoba",      projects: 41 },
  { id: 4, name: "Laura V.",     role: "E-commerce Developer",    avatar: "L", rating: 5.0, reviews: 18, rate: "$55/hr",  skills: ["WooCommerce", "Shopify", "React", "PHP"],        available: true,  location: "Santiago",     projects: 15 },
  { id: 5, name: "Tomás F.",     role: "Mobile Developer",        avatar: "T", rating: 4.7, reviews: 29, rate: "$60/hr",  skills: ["React Native", "Swift", "Firebase", "GraphQL"], available: true,  location: "Bogotá",       projects: 23 },
  { id: 6, name: "Valentina C.", role: "Full-stack Developer",    avatar: "V", rating: 4.9, reviews: 52, rate: "$75/hr",  skills: ["Vue.js", "Laravel", "MySQL", "Docker"],          available: false, location: "Lima",         projects: 44 },
];

const ALL_SKILLS = Array.from(new Set(DEVS.flatMap((d) => d.skills))).sort();

const DevCard: React.FC<{ dev: DevProfile; delay: number; lang: string }> = ({ dev, delay, lang }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`relative flex flex-col border border-violet-900/40 bg-violet-950/10 rounded-xl overflow-hidden transition-all duration-700 ease-out group hover:border-violet-600/50 hover:bg-violet-950/20 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 flex flex-col gap-4 flex-1">
  
        <div className="flex items-start justify-between">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-violet-900/50 border border-violet-700/40 flex items-center justify-center text-lg font-black text-violet-300">
              {dev.avatar}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${dev.available ? "bg-emerald-500" : "bg-gray-600"}`} />
          </div>
          <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${dev.available ? "border-emerald-800/50 bg-emerald-950/20 text-emerald-400" : "border-gray-700/50 bg-gray-900/20 text-gray-600"}`}>
            {dev.available ? (lang === "en" ? "Available" : "Disponible") : (lang === "en" ? "Busy" : "Ocupado")}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-black text-white mb-0.5">{dev.name}</h3>
          <p className="text-xs text-gray-500">{dev.role}</p>
          <p className="text-[10px] text-gray-600 mt-0.5">{dev.location}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill={i < Math.floor(dev.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="text-violet-400">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="text-xs font-bold text-white">{dev.rating.toFixed(1)}</span>
          <span className="text-[10px] text-gray-600">({dev.reviews})</span>
          <span className="text-[10px] text-gray-600 ml-auto">{dev.projects} {lang === "en" ? "projects" : "proyectos"}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {dev.skills.slice(0, 4).map((s) => (
            <span key={s} className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded border border-violet-900/50 bg-violet-950/30 text-gray-400">
              {s}
            </span>
          ))}
          {dev.skills.length > 4 && (
            <span className="px-2 py-0.5 text-[9px] font-bold text-gray-600">+{dev.skills.length - 4}</span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 flex items-center justify-between">
        <span className="text-sm font-black text-violet-300">{dev.rate}</span>
        <Link to={`/developers/${dev.id}`}>
          <button className={`px-4 py-2 text-xs font-black tracking-widest uppercase rounded transition-all ${dev.available ? "bg-violet-500 hover:bg-violet-400 text-black" : "border border-violet-900/50 text-gray-500 cursor-default"}`} disabled={!dev.available}>
            {lang === "en" ? "View profile" : "Ver perfil"}
          </button>
        </Link>
      </div>
    </div>
  );
};

const Developers: React.FC = () => {
  const { lang } = useLanguage();
  const [search, setSearch]           = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = DEVS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.role.toLowerCase().includes(search.toLowerCase());
    const matchSkill  = !selectedSkill || d.skills.includes(selectedSkill);
    const matchAvail  = !availableOnly || d.available;
    return matchSearch && matchSkill && matchAvail;
  });

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-700 opacity-[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">

          <div className="text-center mb-12">
            <div className="flex items-center gap-3 justify-center mb-5">
              <div className="h-px w-6 bg-violet-700" />
              <span className="text-[10px] font-black tracking-[0.35em] uppercase text-gray-600">
                {lang === "en" ? "Our developers" : "Nuestros desarrolladores"}
              </span>
              <div className="h-px w-6 bg-violet-700" />
            </div>
            <h1 className="font-black text-white tracking-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {lang === "en" ? "Find your " : "Encontrá tu "}
              <span className="text-violet-400">{lang === "en" ? "developer" : "desarrollador"}</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              {lang === "en"
                ? "Every developer here is vetted, reviewed, and ready to build."
                : "Cada desarrollador aquí está verificado, evaluado y listo para construir."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
  
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                <circle cx={11} cy={11} r={8}/><line x1={21} y1={21} x2={16.65} y2={16.65}/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === "en" ? "Search by name or role..." : "Buscar por nombre o rol..."}
                className="w-full pl-9 pr-4 py-2.5 bg-violet-950/20 border border-violet-900/50 rounded text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-violet-500/70 transition-colors"
              />
            </div>

            <select
              value={selectedSkill ?? ""}
              onChange={(e) => setSelectedSkill(e.target.value || null)}
              className="px-4 py-2.5 bg-violet-950/20 border border-violet-900/50 rounded text-xs text-gray-400 focus:outline-none focus:border-violet-500/70 transition-colors"
            >
              <option value="">{lang === "en" ? "All skills" : "Todas las habilidades"}</option>
              {ALL_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
       
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`px-4 py-2.5 text-xs font-black tracking-widest uppercase rounded border transition-all whitespace-nowrap ${availableOnly ? "border-emerald-700/60 bg-emerald-950/20 text-emerald-400" : "border-violet-900/50 text-gray-500 hover:border-violet-700/50"}`}
            >
              {lang === "en" ? "Available only" : "Solo disponibles"}
            </button>
          </div>

          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-600 mb-6">
            {filtered.length} {lang === "en" ? "developers found" : "desarrolladores encontrados"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-16">
            {filtered.map((dev, i) => <DevCard key={dev.id} dev={dev} delay={i * 80} lang={lang} />)}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-600 text-sm">
                {lang === "en" ? "No developers match your filters." : "Ningún desarrollador coincide con tus filtros."}
              </div>
            )}
          </div>

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-8 border border-violet-800/40 rounded-xl bg-violet-950/10 overflow-hidden mb-0">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/50 to-transparent" />
            <div className="text-center sm:text-left">
              <h3 className="text-base font-black text-white mb-1">
                {lang === "en" ? "Are you a developer?" : "¿Sos desarrollador?"}
              </h3>
              <p className="text-xs text-gray-500">
                {lang === "en" ? "Join our network and get access to real projects." : "Unite a nuestra red y accedé a proyectos reales."}
              </p>
            </div>
            <Link to="/registro" className="shrink-0">
              <button className="px-6 py-2.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all whitespace-nowrap">
                {lang === "en" ? "Apply as developer" : "Aplicar como dev"}
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Developers;