import React, { useState, useEffect } from 'react';
import CyberGrid from './CyberGrid';
import Typewriter from './Typewritter';
import { useLanguage } from '@/context/LanguageContext';
import StatPill from './StatPill';

const Hero: React.FC = () => {
    const { lang } = useLanguage();
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
    <section className="relative min-h-screen bg-black flex flex-col justify-center items-center overflow-hidden">
      <CyberGrid />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-violet-600 opacity-[0.07] blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 pt-24">

        {/* Badge */}
        <div className={`transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-700/60 bg-violet-950/40 backdrop-blur-sm text-[10px] font-bold tracking-[0.15em] uppercase text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
            <span className="leading-tight">
              {lang === "en" ? "Platform now live — connect & build" : "Plataforma en vivo — conectate y construí"}
            </span>
          </span>
        </div>

        {/* Headline — fluid sizing so Spanish never overflows */}
        <div className={`w-full transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h1
            className="font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(1.8rem, 7vw, 5rem)" }}
          >
            <span className="block text-white">
              {lang === "en" ? "Where" : "Donde los"}
            </span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #a78bfa 0%, #38bdf8 60%, #a78bfa 100%)",
                backgroundSize: "200% auto",
                animation: "shimmer 4s linear infinite",
              }}
            >
              {lang === "en" ? "Developers" : "Desarrolladores"}
            </span>
            <span className="block text-white">
              {lang === "en" ? "Meet Demand" : "Generan Impacto"}
            </span>
          </h1>
        </div>

        {/* Typewriter */}
        <div className={`w-full transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-sm md:text-base font-mono text-gray-400 tracking-wide min-h-[1.75rem] flex items-center justify-center">
            <Typewriter
              lines={[
                lang === "en" ? "Find vetted developers for your project_"          : "Encontrá desarrolladores verificados_",
                lang === "en" ? "List your skills. Get hired by real businesses_"   : "Mostrá tus habilidades. Conseguí clientes_",
                lang === "en" ? "From MVP to full platform — Kustom delivers_"      : "Del MVP a la plataforma completa — Kustom_",
                lang === "en" ? "Digital solutions. No middlemen. Just results_"    : "Sin intermediarios. Solo resultados_",
              ]}
            />
          </p>
        </div>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row gap-4 items-center w-full justify-center transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <a href="/services" className="w-full sm:w-auto">
            <button className="group relative w-full sm:w-auto px-8 py-3.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all duration-200 overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                {lang === "en" ? "Browse Services" : "Explorar Servicios"}
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512">
                  <path fill="currentColor" d="m359.873 121.377-22.627 22.627 95.997 95.997H16v32.001h417.24l-95.994 95.994 22.627 22.627L494.498 256z" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </a>

          <a href="/free-consultation" className="w-full sm:w-auto">
            <button className="group relative w-full sm:w-auto px-8 py-3.5 bg-transparent border border-violet-600/70 hover:border-violet-400 text-violet-300 hover:text-violet-200 font-black text-xs tracking-[0.2em] uppercase rounded transition-all duration-200 overflow-hidden backdrop-blur-sm">
              <span className="relative z-10 flex items-center justify-center gap-3 whitespace-nowrap">
                {lang === "en" ? "Free consultation" : "Consulta gratis"}
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-violet-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </a>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 gap-3 sm:gap-4 mt-4 w-full max-w-lg transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <StatPill value="200+" label={lang === "en" ? "Developers" : "Devs"} delay={900} />
          <StatPill value="500+" label={lang === "en" ? "Projects"   : "Proyectos"} delay={1050} />
          <StatPill value="98%"  label={lang === "en" ? "Satisfaction" : "Satisfacción"} delay={1200} />
        </div>

        {/* Scroll hint */}
        <div className={`mt-6 flex flex-col items-center gap-2 transition-all duration-700 delay-[900ms] ${loaded ? "opacity-100" : "opacity-0"}`}>
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-600">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-transparent" style={{ animation: "pulse 2s ease-in-out infinite" }} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;