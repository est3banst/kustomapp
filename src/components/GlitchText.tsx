import React, { useState, useEffect } from "react";

interface GlitchTextProps {
    text:string;
    className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "" }) => {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        className={`relative z-10 transition-all duration-75 ${glitching ? "text-violet-300" : ""}`}
        style={
          glitching
            ? { textShadow: "2px 0 #ff00ff, -2px 0 #00ffff", transform: "skewX(-2deg)" }
            : {}
        }
      >
        {text}
      </span>
      {glitching && (
        <>
          <span
            className="absolute inset-0 text-cyan-400 z-0 pointer-events-none"
            style={{ transform: "translate(3px, 1px)", opacity: 0.5, clipPath: "inset(30% 0 50% 0)" }}
            aria-hidden
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-fuchsia-500 z-0 pointer-events-none"
            style={{ transform: "translate(-3px, -1px)", opacity: 0.5, clipPath: "inset(60% 0 10% 0)" }}
            aria-hidden
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;