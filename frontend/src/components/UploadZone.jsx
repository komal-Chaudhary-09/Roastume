import { useDropzone } from "react-dropzone";
import { useState } from "react";

export default function UploadZone({ onSubmit, loading, mode }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [inputMode, setInputMode] = useState("upload");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: (accepted) => { if (accepted[0]) setFile(accepted[0]); },
  });

  const handleSubmit = () => {
    if (inputMode === "upload" && file) onSubmit({ file, mode });
    else if (inputMode === "paste" && text.trim()) onSubmit({ text, mode });
  };

  const canSubmit = (inputMode === "upload" && file) || (inputMode === "paste" && text.trim().length > 100);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">

      <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {["upload", "paste"].map((m) => (
          <button
            key={m}
            onClick={() => setInputMode(m)}
            className="px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 mono"
            style={{
              background: inputMode === m ? "var(--accent)" : "transparent",
              color: inputMode === m ? "#fff" : "var(--muted)",
            }}
          >
            {m === "upload" ? "📄 Upload PDF" : "✏️ Paste Text"}
          </button>
        ))}
      </div>

      {inputMode === "upload" && (
        <div
          {...getRootProps()}
          className="relative rounded-xl p-12 text-center cursor-pointer transition-all duration-300"
          style={{
            border: `2px dashed ${isDragActive ? "var(--accent)" : file ? "var(--green)" : "var(--border)"}`,
            background: isDragActive ? "var(--accent-soft)" : "var(--surface)",
          }}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">✅</span>
              <p className="mono text-sm" style={{ color: "var(--green)" }}>{file.name}</p>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {(file.size / 1024).toFixed(1)} KB · Click to replace
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">📄</span>
              <p className="text-lg font-semibold">Drop your resume here</p>
              <p className="mono text-sm" style={{ color: "var(--muted)" }}>PDF only · Max 5MB</p>
            </div>
          )}
        </div>
      )}

      {inputMode === "paste" && (
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={12}
            className="w-full rounded-xl p-5 mono text-sm resize-none outline-none transition-all duration-200"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          <span
            className="absolute bottom-3 right-4 mono text-xs"
            style={{ color: text.length < 100 ? "var(--red)" : "var(--muted)" }}
          >
            {text.length} chars {text.length < 100 ? `(need ${100 - text.length} more)` : "✓"}
          </span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300"
        style={{
          background: canSubmit && !loading ? (mode === "roast" ? "var(--accent)" : "var(--green)") : "var(--surface)",
          color: canSubmit && !loading ? "#000" : "var(--muted)",
          border: `1px solid ${canSubmit && !loading ? "transparent" : "var(--border)"}`,
          cursor: canSubmit && !loading ? "pointer" : "not-allowed",
        }}
      >
        {loading ? "⏳ Analyzing..." : mode === "roast" ? "🔥 Roast My Resume" : "🔍 Review My Resume"}
      </button>
    </div>
  );
}