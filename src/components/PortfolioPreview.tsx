import React, { useState } from "react";
import { PortfolioData } from "../types";
import { 
  Briefcase, 
  GraduationCap, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin,
  Sparkles,
  Download,
  Check,
  Copy,
  ChevronRight
} from "lucide-react";

interface PortfolioPreviewProps {
  data: PortfolioData;
}

type ThemeType = "cosmic" | "swiss" | "warm" | "cyberpunk";

export default function PortfolioPreview({ data }: PortfolioPreviewProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeType>("cosmic");
  const [isCopied, setIsCopied] = useState(false);

  const getThemeStyles = () => {
    switch (activeTheme) {
      case "swiss":
        return {
          bg: "bg-white text-stone-900 selection:bg-stone-200",
          accentColor: "text-red-600",
          accentBg: "bg-red-600 text-white",
          cardBg: "bg-stone-50 border border-stone-200",
          fontClass: "font-sans",
          headerBg: "bg-stone-100 border-b border-stone-200",
          badgeBg: "bg-stone-200 text-stone-800",
          divider: "border-stone-200",
        };
      case "warm":
        return {
          bg: "bg-[#faf8f5] text-amber-950 selection:bg-amber-100",
          accentColor: "text-amber-700",
          accentBg: "bg-amber-700 text-white",
          cardBg: "bg-white border border-amber-100 shadow-sm",
          fontClass: "font-serif",
          headerBg: "bg-amber-50/50 border-b border-amber-100",
          badgeBg: "bg-amber-100/60 text-amber-900",
          divider: "border-amber-100",
        };
      case "cyberpunk":
        return {
          bg: "bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30",
          accentColor: "text-emerald-400",
          accentBg: "bg-emerald-500 text-black font-semibold",
          cardBg: "bg-zinc-900/60 border border-zinc-800",
          fontClass: "font-mono",
          headerBg: "bg-zinc-900 border-b border-zinc-800",
          badgeBg: "bg-zinc-800 text-emerald-400 border border-emerald-500/20",
          divider: "border-zinc-800",
        };
      case "cosmic":
      default:
        return {
          bg: "bg-slate-900 text-slate-100 selection:bg-indigo-500/30",
          accentColor: "text-indigo-400",
          accentBg: "bg-indigo-600 text-white",
          cardBg: "bg-slate-800/60 border border-slate-700/60",
          fontClass: "font-sans",
          headerBg: "bg-slate-950/80 border-b border-slate-800/60 backdrop-blur-sm",
          badgeBg: "bg-indigo-950/60 text-indigo-300 border border-indigo-500/20",
          divider: "border-slate-800",
        };
    }
  };

  const themeThemeStyles = getThemeStyles();

  // Simple copy HTML helper
  const handleCopyHTML = async () => {
    const htmlSnippet = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - ${data.title || 'Portfolio'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
    <header class="border-b border-slate-800 bg-slate-950/80 py-12">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h1 class="text-4xl font-bold tracking-tight text-white mb-2">${data.name}</h1>
            <p class="text-indigo-400 text-lg font-medium mb-4">${data.title}</p>
            <div class="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                ${data.email ? `<span>${data.email}</span>` : ""}
                ${data.phone ? `<span>${data.phone}</span>` : ""}
                ${data.location ? `<span>${data.location}</span>` : ""}
            </div>
        </div>
    </header>
    <main class="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <section>
            <h2 class="text-xl font-semibold border-b border-slate-800 pb-2 mb-4 text-indigo-400">Professional Summary</h2>
            <p class="text-slate-300 leading-relaxed">${data.summary}</p>
        </section>
        <section>
            <h2 class="text-xl font-semibold border-b border-slate-800 pb-2 mb-4 text-indigo-400">Skills</h2>
            <div class="flex flex-wrap gap-2">
                ${data.skills.map(s => `<span class="bg-indigo-950/60 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded text-sm">${s}</span>`).join("")}
            </div>
        </section>
        <section>
            <h2 class="text-xl font-semibold border-b border-slate-800 pb-2 mb-4 text-indigo-400">Experience</h2>
            <div class="space-y-6">
                ${data.experience.map(exp => `
                <div>
                    <div class="flex flex-col sm:flex-row justify-between mb-1">
                        <h3 class="font-semibold text-white">${exp.role}</h3>
                        <span class="text-slate-400 text-sm">${exp.period}</span>
                    </div>
                    <p class="text-slate-400 text-sm font-medium mb-2">${exp.company}</p>
                    <p class="text-slate-300 text-sm leading-relaxed">${exp.description}</p>
                </div>
                `).join("")}
            </div>
        </section>
        <section>
            <h2 class="text-xl font-semibold border-b border-slate-800 pb-2 mb-4 text-indigo-400">Education</h2>
            <div class="space-y-6">
                ${data.education.map(edu => `
                <div>
                    <div class="flex flex-col sm:flex-row justify-between mb-1">
                        <h3 class="font-semibold text-white">${edu.degree}</h3>
                        <span class="text-slate-400 text-sm">${edu.period}</span>
                    </div>
                    <p class="text-slate-400 text-sm font-medium mb-1">${edu.school}</p>
                    <p class="text-slate-300 text-sm">${edu.description}</p>
                </div>
                `).join("")}
            </div>
        </section>
    </main>
</body>
</html>
    `.trim();

    try {
      await navigator.clipboard.writeText(htmlSnippet);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard write failed:", err);
      alert("Could not copy to clipboard. Your browser may have denied clipboard access.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Banner Control Panel */}
      <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3" style={{ height: "12px", borderRadius: "9999px", backgroundColor: "#ef4444" }} />
            <span className="w-3" style={{ height: "12px", borderRadius: "9999px", backgroundColor: "#eab308" }} />
            <span className="w-3" style={{ height: "12px", borderRadius: "9999px", backgroundColor: "#22c55e" }} />
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2">live-portfolio-preview.html</span>
        </div>

        {/* Theme select controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTheme("cosmic")}
            className={`px-2 py-1 text-xs font-medium rounded transition-all ${
              activeTheme === "cosmic" 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cosmic
          </button>
          <button
            onClick={() => setActiveTheme("swiss")}
            className={`px-2 py-1 text-xs font-medium rounded transition-all ${
              activeTheme === "swiss" 
                ? "bg-stone-200 text-stone-900 shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Swiss
          </button>
          <button
            onClick={() => setActiveTheme("warm")}
            className={`px-2 py-1 text-xs font-medium rounded transition-all ${
              activeTheme === "warm" 
                ? "bg-amber-100 text-amber-950 shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Warm
          </button>
          <button
            onClick={() => setActiveTheme("cyberpunk")}
            className={`px-2 py-1 text-xs font-medium rounded transition-all ${
              activeTheme === "cyberpunk" 
                ? "bg-emerald-500 text-zinc-950 font-bold shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Cyber
          </button>
        </div>

        {/* Quick export component */}
        <button
          onClick={handleCopyHTML}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-200 hover:text-white rounded-lg hover:bg-slate-700 text-xs transition duration-150 border border-slate-700 font-medium"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>HTML Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Web Code</span>
            </>
          )}
        </button>
      </div>

      {/* Styled Iframe Canvas mimicking a web page */}
      <div className={`flex-1 overflow-y-auto ${themeThemeStyles.bg} ${themeThemeStyles.fontClass} transition-colors duration-300`}>
        {/* Visual Hero Header */}
        <div className={`py-12 px-6 sm:px-10 text-center relative overflow-hidden ${themeThemeStyles.headerBg}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-pink-500 opacity-60" />
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            {data.name || "Enter Name"}
          </h1>
          <p className={`text-base sm:text-lg font-medium tracking-wide mb-6 ${themeThemeStyles.accentColor}`}>
            {data.title || "Elite Professional Title"}
          </p>

          {/* Social and contact bars */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs opacity-90 max-w-2xl mx-auto border-t pt-5 border-dashed border-current/20">
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-1 hover:underline">
                <Mail className="w-3.5 h-3.5" />
                <span>{data.email}</span>
              </a>
            )}
            {data.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-current/60" />
                <span>{data.phone}</span>
              </span>
            )}
            {data.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-current/60" />
                <span>{data.location}</span>
              </span>
            )}
            {data.website && (
              <a href={data.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                <Globe className="w-3.5 h-3.5" />
                <span>Website</span>
              </a>
            )}
            {data.github && (
              <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {data.linkedin && (
              <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 space-y-10">
          {/* Summary Block */}
          {data.summary && (
            <div className="space-y-3">
              <h2 className={`text-sm tracking-widest uppercase font-bold border-b pb-1 flex items-center gap-2 ${themeThemeStyles.accentColor} ${themeThemeStyles.divider}`}>
                <span>About Me</span>
              </h2>
              <p className="text-sm sm:text-base leading-relaxed opacity-90 whitespace-pre-line">
                {data.summary}
              </p>
            </div>
          )}

          {/* Core Expertise Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="space-y-3">
              <h2 className={`text-sm tracking-widest uppercase font-bold border-b pb-1 flex items-center gap-2 ${themeThemeStyles.accentColor} ${themeThemeStyles.divider}`}>
                <span>Skills & Expertise</span>
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded text-xs font-semibold ${themeThemeStyles.badgeBg}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Professional Work Experience */}
          {data.experience && data.experience.length > 0 && (
            <div className="space-y-5">
              <h2 className={`text-sm tracking-widest uppercase font-bold border-b pb-1 flex items-center gap-2 ${themeThemeStyles.accentColor} ${themeThemeStyles.divider}`}>
                <span>Professional Experience</span>
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="group relative">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                      <h3 className="text-base font-bold tracking-tight">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-semibold opacity-60 bg-current/5 px-2 py-0.5 rounded">
                        {exp.period}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold mb-2 opacity-80 flex items-center gap-1.5 ${themeThemeStyles.accentColor}`}>
                      <Briefcase className="w-3.5 h-3.5 inline-block" />
                      {exp.company}
                    </p>
                    {exp.description && (
                      <p className="text-sm opacity-90 whitespace-pre-line leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Project Showcase */}
          {data.projects && data.projects.length > 0 && (
            <div className="space-y-5">
              <h2 className={`text-sm tracking-widest uppercase font-bold border-b pb-1 flex items-center gap-2 ${themeThemeStyles.accentColor} ${themeThemeStyles.divider}`}>
                <span>Featured Projects</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {data.projects.map((project) => (
                  <div key={project.id} className={`p-4 rounded-xl flex flex-col justify-between ${themeThemeStyles.cardBg}`}>
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-bold text-sm tracking-tight">{project.name}</h4>
                        {project.link && (
                          <a
                            href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-1 rounded hover:bg-current/10 transition duration-150 ${themeThemeStyles.accentColor}`}
                            title="Visit Project Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs opacity-80 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.technologies?.map((tech, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 text-[10px] uppercase font-mono bg-current/5 rounded opacity-70">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Journey Education */}
          {data.education && data.education.length > 0 && (
            <div className="space-y-5 pb-8">
              <h2 className={`text-sm tracking-widest uppercase font-bold border-b pb-1 flex items-center gap-2 ${themeThemeStyles.accentColor} ${themeThemeStyles.divider}`}>
                <span>Education</span>
              </h2>
              <div className="space-y-5">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                      <h3 className="text-base font-bold tracking-tight">
                        {edu.degree}
                      </h3>
                      <span className="text-xs font-semibold opacity-60">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-sm font-semibold opacity-80 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-current/60 inline-block" />
                      {edu.school}
                    </p>
                    {edu.description && (
                      <p className="text-xs opacity-75 mt-1.5 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
