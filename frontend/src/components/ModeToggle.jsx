export default function ModeToggle({ mode, setMode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="mono text-sm" style={{ color: mode === "professional" ? "var(--text)" : "var(--muted)" }}>
        Professional
      </span>

      <button
        onClick={() => setMode(mode === "professional" ? "roast" : "professional")}
        className="relative w-14 h-7 rounded-full transition-all duration-300 border"
        style={{
          background: mode === "roast" ? "var(--accent)" : "var(--surface)",
          borderColor: mode === "roast" ? "var(--accent)" : "var(--border)",
        }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full transition-all duration-300"
          style={{
            background: "var(--text)",
            left: mode === "roast" ? "calc(100% - 24px)" : "4px",
          }}
        />
      </button>

      <span className="mono text-sm" style={{ color: mode === "roast" ? "var(--accent)" : "var(--muted)" }}>
        🔥 Roast Me
      </span>
    </div>
  );
}