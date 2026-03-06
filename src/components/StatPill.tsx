import React, {useState, useEffect} from "react";


interface StatPillProps {
    value: string;
    label: string;
    delay: number;

}
const StatPill: React.FC<StatPillProps> = ({ value, label, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <div className="relative px-5 py-3 border border-violet-800/50 bg-violet-950/30 backdrop-blur-sm rounded overflow-hidden group hover:border-violet-500/60 transition-colors">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="text-2xl font-black text-white tracking-tight">{value}</div>
        <div className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );
};

export default StatPill;