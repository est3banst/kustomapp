import React, { useState, useEffect } from "react";

interface TypewriterProps {
    lines: string[];
    className? : string;
}

const Typewriter: React.FC<TypewriterProps> = ({ lines, className = "" }) => {
  const [displayed, setDisplayed] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[lineIdx];
    let timeout: any;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), 60);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), 30);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setLineIdx((l) => (l + 1) % lines.length);
    }
    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx, lines]);

  return (
    <span className={className}>
      {displayed}
      <span className="inline-block w-0.5 h-[1em] bg-violet-400 ml-1 align-middle" style={{ animation: "blink 1s step-end infinite" }} />
    </span>
  );
};

export default Typewriter;