import { useState } from "react";

const ScoreRing = ({ score }) => {
  const color = score >= 7 ? "var(--green)" : score >= 4 ? "var(--amber)" : "var(--red)";
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black" style={{ color }}>{score}</span>
        <span className="mono text-xs" style={{ color: "var(--muted)" }}>/10</span>
      </div>
    </div>
  );
};

const Section = ({ title, items, color, icon }) => (
  <div className="flex flex-col gap-3">
    <h3 className="mono text-xs font-medium tracking-widest uppercase" style={{ color: "var(--muted)" }}>
      {icon} {title}
    </h3>
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 items-start p-3 rounded-lg text-sm"
          style={{ background: `${color}10`, borderLeft: `3px solid ${color}` }}
        >
          <span className="mt-0.5 shrink-0" style={{ color }}>
            {title === "Strengths" ? "✓" : title === "Weaknesses" ? "✗" : "→"}
          </span>
          <span style={{ color: "var(--text)", lineHeight: 1.6 }}>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function ResultCard({ result, mode, onReset }) {
  const [copied, setCopied] = useState(false);
  const { review } = result;

  const copyResults = () => {
    const text = `Roastume Review (${mode === "roast" ? "Roast Mode" : "Professional"})
Score: ${review.score}/10
Summary: ${review.summary}
Strengths: ${review.strengths.join(", ")}
Weaknesses: ${review.weaknesses.join(", ")}
Suggestions: ${review.suggestions.join(", ")}
Verdict: ${review.verdict}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">

      <div
        className="rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <ScoreRing score={review.score} />
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <span
            className="mono text-xs tracking-widest uppercase"
            style={{ color: mode === "roast" ? "var(--accent)" : "var(--green)" }}
          >
            {mode === "roast" ? "🔥 Roast Mode" : "✦ Professional Review"}
          </span>
          <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>{review.summary}</p>
        </div>
      </div>

      <div
        className="rounded-xl p-6 flex flex-col gap-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <Section title="Strengths" items={review.strengths} color="var(--green)" icon="✦" />
        <div style={{ height: 1, background: "var(--border)" }} />
        <Section title="Weaknesses" items={review.weaknesses} color="var(--red)" icon="✦" />
        <div style={{ height: 1, background: "var(--border)" }} />
        <Section title="Suggestions" items={review.suggestions} color="var(--amber)" icon="✦" />
      </div>

      <div
        className="rounded-xl p-5 text-center"
        style={{
          background: mode === "roast" ? "#ff4d0010" : "#00e67610",
          border: `1px solid ${mode === "roast" ? "var(--accent)" : "var(--green)"}`,
        }}
      >
        <p className="mono text-xs mb-2 tracking-widest uppercase" style={{ color: "var(--muted)" }}>Final Verdict</p>
        <p className="font-bold text-lg" style={{ color: mode === "roast" ? "var(--accent)" : "var(--green)" }}>
          "{review.verdict}"
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mono"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          ← Review Another
        </button>
        <button
          onClick={copyResults}
          className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mono"
          style={{
            background: copied ? "var(--green)" : "var(--surface)",
            border: `1px solid ${copied ? "var(--green)" : "var(--border)"}`,
            color: copied ? "#000" : "var(--text)",
          }}
        >
          {copied ? "✓ Copied!" : "⎘ Copy Results"}
        </button>
      </div>
    </div>
  );
}