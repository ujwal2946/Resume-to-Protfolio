import React, { useState } from "react";
import { Sparkles, Scissors, List, Maximize, Loader2, RefreshCw } from "lucide-react";

interface AIPolishButtonProps {
  currentText: string;
  onUpdate: (newText: string) => void;
  fieldName?: string;
}

export default function AIPolishButton({ currentText, onUpdate, fieldName }: AIPolishButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePolish = async (command: "shorten" | "professionalize" | "bullet-points" | "expand") => {
    if (!currentText || currentText.trim().length === 0) return;
    setLoading(true);
    setError(null);
    try {
      let response: Response;
      try {
        response = await fetch("/api/edit-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: currentText,
            command,
            fieldName,
          }),
        });
      } catch (networkErr) {
        setError("Network error: could not reach the server.");
        return;
      }

      let json;
      try {
        json = await response.json();
      } catch (jsonErr) {
        setError(`Server returned an invalid response (HTTP ${response.status}).`);
        return;
      }

      if (json.success && json.enhancedText) {
        onUpdate(json.enhancedText);
      } else {
        setError(json.error || "Enhancement failed.");
      }
    } catch (err: any) {
      console.error("AI polish error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
          <span>AI rewrite:</span>
        </span>

        {loading ? (
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 px-2 py-0.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Polishing...</span>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handlePolish("professionalize")}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded text-indigo-400 bg-indigo-950/40 hover:bg-indigo-950 border border-indigo-500/20 hover:border-indigo-500/40 transition duration-150"
              title="Make the wording sound high-end and premium."
            >
              <Sparkles className="w-3 h-3" />
              <span>Professionalize</span>
            </button>

            <button
              type="button"
              onClick={() => handlePolish("shorten")}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded text-rose-400 bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 hover:border-rose-500/40 transition duration-150"
              title="Condense details to be tight and punchy."
            >
              <Scissors className="w-3 h-3" />
              <span>Shorten</span>
            </button>

            <button
              type="button"
              onClick={() => handlePolish("bullet-points")}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded text-amber-400 bg-amber-950/40 hover:bg-amber-950 border border-amber-500/20 hover:border-amber-500/40 transition duration-150"
              title="Convert content into bullet points."
            >
              <List className="w-3 h-3" />
              <span>Bullet points</span>
            </button>

            <button
              type="button"
              onClick={() => handlePolish("expand")}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded text-teal-400 bg-teal-950/40 hover:bg-teal-950 border border-teal-500/20 hover:border-teal-500/40 transition duration-150"
              title="Expand with performance metrics & details."
            >
              <Maximize className="w-3 h-3" />
              <span>Expand</span>
            </button>
          </>
        )}
      </div>
      {error && (
        <span className="text-[10px] text-rose-400 font-medium px-1">
          {error}
        </span>
      )}
    </div>
  );
}
