import React, {useState, useEffect} from 'react';
import CyberGrid from './CyberGrid';
import Typewriter from './Typewritter';
import StatPill from './StatPill';

const Hero: React.FC = () => {
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-8 pt-24">

        <div
          className={`transition-all duration-700 delay-100 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-700/60 bg-violet-950/40 backdrop-blur-sm text-[10px] font-bold tracking-[0.25em] uppercase text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Platform now live — connect & build
          </span>
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight">
            <span className="block text-white">Where</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #a78bfa 0%, #38bdf8 60%, #a78bfa 100%)",
                backgroundSize: "200% auto",
                animation: "shimmer 4s linear infinite",
              }}
            >
              Developers
            </span>
            <span className="block text-white">Meet Demand</span>
          </h1>
        </div>

        <div
          className={`transition-all duration-700 delay-300 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-sm md:text-base font-mono text-gray-400 tracking-wide h-6">
            <Typewriter
              lines={[
                "Find vetted developers for your project_",
                "List your skills. Get hired by real businesses_",
                "From MVP to full platform — Kustom delivers_",
                "Digital solutions. No middlemen. Just results_",
              ]}
            />
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-4 items-center transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
         
          <a href="/services">
            <button className="group relative px-8 py-3.5 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all duration-200 overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                Browse Services
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 512 512">
                  <path fill="currentColor" d="m359.873 121.377-22.627 22.627 95.997 95.997H16v32.001h417.24l-95.994 95.994 22.627 22.627L494.498 256z" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </a>

          <a href="/free-consultation">
            <button className="group relative px-8 py-3.5 bg-transparent border border-violet-600/70 hover:border-violet-400 text-violet-300 hover:text-violet-200 font-black text-xs tracking-[0.2em] uppercase rounded transition-all duration-200 overflow-hidden backdrop-blur-sm">
              <span className="relative z-10 flex items-center gap-3">
                Free consultation
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-violet-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </a>
        </div>

        <div
          className={`grid grid-cols-3 gap-4 mt-4 w-full max-w-lg transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <StatPill value="200+" label="Developers" delay={900} />
          <StatPill value="500+" label="Projects" delay={1050} />
          <StatPill value="98%" label="Satisfaction" delay={1200} />
        </div>

        <div
          className={`mt-6 flex flex-col items-center gap-2 transition-all duration-700 delay-[900ms] ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-600">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-transparent" style={{ animation: "pulse 2s ease-in-out infinite" }} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;