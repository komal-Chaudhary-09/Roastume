import { useState } from "react";
import axios from "axios";
import ModeToggle from "./components/ModeToggle";
import UploadZone from "./components/UploadZone";
import ResultCard from "./components/ResultCard";

export default function App() {
  const [mode, setMode] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async ({ file, text, mode }) => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      if (file) formData.append("resume", file);
      else formData.append("text", text);
      formData.append("mode", mode);

      const res = await axios.post(`https://roastume-backend.onrender.com/api/review`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>

      <header className="w-full px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <span className="text-xl font-black tracking-tight">Roastume</span>
        </div>
        {!result && <ModeToggle mode={mode} setMode={setMode} />}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-10">
        {!result ? (
          <>
            <div className="text-center flex flex-col gap-4 max-w-xl">
              <h1 className="text-5xl font-black leading-tight tracking-tight">
                {mode === "roast" ? (
                  <>Get <span style={{ color: "var(--accent)" }}>Roasted.</span></>
                ) : (
                  <>Know Your <span style={{ color: "var(--green)" }}>Weaknesses.</span></>
                )}
              </h1>
              <p className="mono text-sm" style={{ color: "var(--muted)" }}>
                {mode === "roast"
                  ? "Brutally honest AI feedback. Your resume won't know what hit it."
                  : "AI-powered review from a senior engineer's perspective. No fluff."}
              </p>
            </div>

            {error && (
              <div
                className="w-full max-w-2xl px-4 py-3 rounded-lg mono text-sm"
                style={{ background: "#ff17441a", border: "1px solid var(--red)", color: "var(--red)" }}
              >
                ⚠ {error}
              </div>
            )}

            <UploadZone onSubmit={handleSubmit} loading={loading} mode={mode} />
          </>
        ) : (
          <ResultCard result={result} mode={mode} onReset={() => { setResult(null); setError(""); }} />
        )}
      </main>

      <footer className="px-6 py-4 text-center mono text-xs" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        Built with Groq + LLaMA · Free & Open Source
      </footer>
    </div>
  );
}
