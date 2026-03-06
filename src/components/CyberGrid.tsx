import React from "react";

const CyberGrid: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
   
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
   
    <div
      className="absolute bottom-0 left-0 right-0 h-2/3 opacity-[0.06]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        transform: "perspective(600px) rotateX(60deg)",
        transformOrigin: "bottom center",
      }}
    />
   
    <div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-30"
      style={{ animation: "scanline 6s linear infinite" }}
    />
   
    {["top-8 left-8", "top-8 right-8", "bottom-8 left-8", "bottom-8 right-8"].map((pos, i) => (
      <div key={i} className={`absolute ${pos} w-8 h-8 opacity-40`}>
        <div
          className="absolute inset-0 border-violet-400"
          style={{
            borderTopWidth: i < 2 ? "1px" : 0,
            borderBottomWidth: i >= 2 ? "1px" : 0,
            borderLeftWidth: i % 2 === 0 ? "1px" : 0,
            borderRightWidth: i % 2 === 1 ? "1px" : 0,
          }}
        />
      </div>
    ))}
   
    <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-violet-600 opacity-[0.06] blur-3xl" style={{ animation: "float1 8s ease-in-out infinite" }} />
    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-cyan-500 opacity-[0.04] blur-3xl" style={{ animation: "float2 10s ease-in-out infinite" }} />
  </div>
);

export default CyberGrid;