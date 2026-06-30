import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Loader2, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { PortfolioData } from "../types";
import { detectFileType } from "../utils/parseUtils";
import { mapRawToPortfolio } from "../utils/portfolioMapper";
import { apiPost } from "../utils/apiClient";

interface ResumeDropzoneProps {
  onParseComplete: (data: PortfolioData) => void;
}

const LOADING_STEPS = [
  "Reading local resume file buffer...",
  "Running secure document text parsing...",
  "Transmitting structured token stream to Gemini...",
  "Gemini 3.5-Flash organizing structured Schema JSON...",
  "Assembling dynamic resume components...",
];

export default function ResumeDropzone({ onParseComplete }: ResumeDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate loading instructions to simulate natural progression
  const stepIntervalRef = useRef<any>(null);

  const startLoadingPipeline = (fName: string) => {
    setFileName(fName);
    setLoading(true);
    setError(null);
    setCurrentStepIdx(0);

    stepIntervalRef.current = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);
  };

  const stopLoadingPipeline = () => {
    setLoading(false);
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    const { isPDF, isDocx, isDoc } = detectFileType(file.name, { mimeType: file.type });

    if (!isPDF && !isDocx && !isDoc) {
      setError(`Supported formats: PDF (.pdf) and Word (.docx, .doc). Received: ${file.name || "Unknown"} (${file.type || "unknown type"})`);
      return;
    }

    startLoadingPipeline(file.name);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64String = (reader.result as string).split(",")[1];

          const result = await apiPost<{ data: Record<string, unknown> }>("/api/parse-resume", {
            fileData: base64String,
            fileName: file.name,
          });

          if (result.success === false) {
            setError(result.error || "Failed parsing the document. Text extraction empty.");
          } else {
            const json = result.data as any;
            const rawData = json.data || json;
            onParseComplete(mapRawToPortfolio(rawData));
          }
        } catch (err: any) {
          console.error(err);
          setError("An unexpected network or server error occurred.");
        } finally {
          stopLoadingPipeline();
        }
      };

      reader.onerror = () => {
        setError("Error occurred reading local file bytes.");
        stopLoadingPipeline();
      };
    } catch (err: any) {
      console.error(err);
      setError("An unexpected network or server error occurred.");
      stopLoadingPipeline();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="bg-slate-900 border-2 border-dashed border-indigo-500 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <Sparkles className="w-5 h-5 text-indigo-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span>AI COMPILING ACTIVE</span>
            </h4>
            <p className="text-xs text-indigo-400 font-mono italic animate-pulse">
              {LOADING_STEPS[currentStepIdx]}
            </p>
          </div>
          <div className="w-full max-w-xs bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${((currentStepIdx + 1) / LOADING_STEPS.length) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 max-w-xs">
            Processing file: <strong className="text-slate-300 font-mono">{fileName}</strong>. This takes roughly 5-10 seconds.
          </p>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-3 ${
            dragActive
              ? "border-indigo-500 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              : "border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="p-3 bg-slate-900 text-slate-400 rounded-xl border border-slate-800 shadow-sm transition group-hover:bg-slate-800/80 group-hover:scale-105">
            <UploadCloud className="w-7 h-7 text-indigo-400" />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-200">
              Drag & drop your PDF or Word resume
            </h4>
            <p className="text-xs text-slate-500">
              or click to browse your files
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800/60 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>PDF or Word (.pdf, .docx, .doc)</span>
            </span>
          </div>

          {error && (
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-950/30 border border-rose-500/20 px-3 py-2 rounded-xl text-left max-w-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
