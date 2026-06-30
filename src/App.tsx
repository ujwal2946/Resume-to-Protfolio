import React, { useState, useEffect } from "react";
import { PortfolioData } from "./types";
import { DEFAULT_PORTFOLIO } from "./data/defaultPortfolio";
import ResumeDropzone from "./components/ResumeDropzone";
import PortfolioForm from "./components/PortfolioForm";
import PortfolioPreview from "./components/PortfolioPreview";
import { 
  Sparkles, 
  Cpu, 
  FileCheck2,
  Undo2,
} from "lucide-react";

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(DEFAULT_PORTFOLIO);
  const [backendActive, setBackendActive] = useState<boolean | null>(null);

  // Check backend server connection on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === "ok") {
          setBackendActive(true);
        } else {
          setBackendActive(false);
        }
      })
      .catch((err) => {
        console.warn("Backend connectivity check failed:", err);
        setBackendActive(false);
      });
  }, []);

  const handleParseComplete = (newData: PortfolioData) => {
    setPortfolio(newData);
  };

  const resetToDemo = () => {
    setPortfolio(DEFAULT_PORTFOLIO);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Dynamic Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/10 border border-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>AI Resume to Portfolio Builder</span>
              <span className="hidden sm:inline-block text-[10px] bg-indigo-950 font-mono text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                v1.0 (Gemini 3.5-Flash Active)
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Convert PDF resumes into flawless, interactive web portfolios instantly
            </p>
          </div>
        </div>

        {/* Server check or quick actions */}
        <div className="flex items-center gap-3">
          {backendActive === true ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Pipeline Connected</span>
            </span>
          ) : backendActive === false ? (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
              <span>Local Dev Proxy mode</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full animate-pulse">
              Initializing...
            </span>
          )}

          <button
            onClick={resetToDemo}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800/80 transition duration-150"
            title="Reload default workspace content"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Load Demo Resume</span>
          </button>
        </div>
      </header>

      {/* Main SaaS Interface Workspace split */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6 lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-80px)] overflow-hidden">
        
        {/* Left Side: Control panel, raw PDF uploader and instant form editor */}
        <div className="lg:col-span-5 h-full flex flex-col overflow-hidden space-y-5">
          {/* Section: Upload banner */}
          <div className="shrink-0 bg-slate-900/40 border border-slate-900 rounded-2xl p-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Step 1: Upload Existing PDF Resume</span>
            </h2>
            <ResumeDropzone onParseComplete={handleParseComplete} />
          </div>

          {/* Section: Interactive content form */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="bg-slate-950 sticky top-0 z-10 pb-2 border-b border-slate-900 mb-4 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-indigo-400" />
                <span>Step 2: Customize Structured Portfolio & Polish</span>
              </h2>
              <button
                onClick={resetToDemo}
                className="sm:hidden flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                <Undo2 className="w-3 h-3" />
                <span>Reset Demo</span>
              </button>
            </div>

            <PortfolioForm data={portfolio} onChange={setPortfolio} />
          </div>
        </div>

        {/* Right Side: High fidelity mock/live interactive preview wrapper */}
        <div className="lg:col-span-7 h-full flex flex-col overflow-hidden mt-6 lg:mt-0">
          <PortfolioPreview data={portfolio} />
        </div>

      </main>
    </div>
  );
}
