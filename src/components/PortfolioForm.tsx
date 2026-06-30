import React from "react";
import { PortfolioData, ExperienceItem, EducationItem, ProjectItem } from "../types";
import AIPolishButton from "./AIPolishButton";
import { addItem, updateItem, removeItem } from "../utils/listHelpers";
import { generateId } from "../utils/idGenerator";
import { parseCommaSeparated } from "../utils/parseUtils";
import { 
  Plus, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Code,
  Globe,
  Github,
  Linkedin
} from "lucide-react";

interface PortfolioFormProps {
  data: PortfolioData;
  onChange: (newData: PortfolioData) => void;
}

export default function PortfolioForm({ data, onChange }: PortfolioFormProps) {
  const [skillsRaw, setSkillsRaw] = React.useState<string>(() => data.skills ? data.skills.join(", ") : "");
  const [techsRaw, setTechsRaw] = React.useState<Record<string, string>>(() => {
    const raw: Record<string, string> = {};
    if (data.projects) {
      data.projects.forEach((proj) => {
        raw[proj.id] = proj.technologies ? proj.technologies.join(", ") : "";
      });
    }
    return raw;
  });

  // Keep raw buffers in sync when data updates externally (e.g. on demo reset, or parse complete)
  React.useEffect(() => {
    setSkillsRaw(data.skills ? data.skills.join(", ") : "");
  }, [data.skills]);

  React.useEffect(() => {
    const raw: Record<string, string> = {};
    if (data.projects) {
      data.projects.forEach((proj) => {
        raw[proj.id] = proj.technologies ? proj.technologies.join(", ") : "";
      });
    }
    setTechsRaw(raw);
  }, [data.projects]);

  const updateField = (field: keyof PortfolioData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: generateId("exp"),
      role: "",
      company: "",
      period: "",
      description: "",
    };
    updateField("experience", addItem(data.experience, newExp));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    updateField("experience", updateItem(data.experience, id, field, value));
  };

  const removeExperience = (id: string) => {
    updateField("experience", removeItem(data.experience, id));
  };

  const addEducation = () => {
    const newEdu: EducationItem = {
      id: generateId("edu"),
      degree: "",
      school: "",
      period: "",
      description: "",
    };
    updateField("education", addItem(data.education, newEdu));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    updateField("education", updateItem(data.education, id, field, value));
  };

  const removeEducation = (id: string) => {
    updateField("education", removeItem(data.education, id));
  };

  const addProject = () => {
    const newProject: ProjectItem = {
      id: generateId("proj"),
      name: "",
      description: "",
      technologies: [],
      link: "",
    };
    updateField("projects", addItem(data.projects, newProject));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: ProjectItem[keyof ProjectItem]) => {
    updateField("projects", updateItem(data.projects, id, field, value));
  };

  const removeProject = (id: string) => {
    updateField("projects", removeItem(data.projects, id));
  };

  const handleSkillsChange = (text: string) => {
    setSkillsRaw(text);
    updateField("skills", parseCommaSeparated(text));
  };

  const handleTechsChange = (id: string, text: string) => {
    setTechsRaw(prev => ({ ...prev, [id]: text }));
    updateField("projects", updateItem(data.projects, id, "technologies", parseCommaSeparated(text)));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Personal Identity */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-slate-800 pb-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Identity & Contacts</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
              placeholder="e.g. John Doe"
              value={data.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Title</label>
            <input
              type="text"
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
              placeholder="e.g. Senior Frontend Engineer"
              value={data.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                placeholder="e.g. name@domain.com"
                value={data.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                placeholder="e.g. +1 (555) 0192"
                value={data.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                placeholder="e.g. Seattle, WA"
                value={data.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Personal Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                placeholder="e.g. name.dev"
                value={data.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Profile</label>
            <div className="relative">
              <Github className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                placeholder="e.g. github.com/username"
                value={data.github || ""}
                onChange={(e) => updateField("github", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn Profile</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
                value={data.linkedin || ""}
                onChange={(e) => updateField("linkedin", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Professional Summary with AI assistance */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-slate-800 pb-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Professional Summary</span>
        </h3>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">Elevator pitch</label>
          <textarea
            rows={4}
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700 leading-relaxed font-sans"
            placeholder="Introduce your signature value proposition..."
            value={data.summary || ""}
            onChange={(e) => updateField("summary", e.target.value)}
          />
          <AIPolishButton
            currentText={data.summary || ""}
            onUpdate={(val) => updateField("summary", val)}
            fieldName="Professional Summary"
          />
        </div>
      </section>

      {/* 3. Skills with tag manager */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-slate-800 pb-2">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>Core Capabilities & Core Skills</span>
        </h3>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Skills (comma-separated)</label>
          <input
            type="text"
            className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-700"
            placeholder="React, TypeScript, GraphQL, Docker..."
            value={skillsRaw}
            onChange={(e) => handleSkillsChange(e.target.value)}
          />
          <span className="text-[10px] text-slate-500 block mt-1">Changes are saved instantly. Type comma to create discrete tags.</span>
        </div>
      </section>

      {/* 4. Professional Work Experience entries */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Professional Work Experience</span>
          </h3>
          <button
            type="button"
            onClick={addExperience}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition duration-150"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Role</span>
          </button>
        </div>

        {data.experience.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">No experience entries defined. Add one using the button above.</p>
        ) : (
          <div className="space-y-6 divide-y divide-slate-800/80">
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className={`space-y-3 pt-4 ${idx === 0 ? "pt-0" : ""}`}>
                <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded-lg">
                  <span className="text-xs font-bold text-indigo-400">#Role {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition duration-150"
                    title="Remove role entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Role Job Title</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Company/Institution</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Period/Dates</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. June 2021 - Present"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Work Description & Key Outcomes</label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                  />
                  <AIPolishButton
                    currentText={exp.description}
                    onUpdate={(val) => updateExperience(exp.id, "description", val)}
                    fieldName={`Work Experience at ${exp.company || "Company"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Custom Project Showcase */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <span>Featured Case Studies & Projects</span>
          </h3>
          <button
            type="button"
            onClick={addProject}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition duration-150"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        {data.projects.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">No project entries defined. Add one using the button above.</p>
        ) : (
          <div className="space-y-6 divide-y divide-slate-800/80">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className={`space-y-3 pt-4 ${idx === 0 ? "pt-0" : ""}`}>
                <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded-lg">
                  <span className="text-xs font-bold text-indigo-400">#Project {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition duration-150"
                    title="Remove project entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Project Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Project Web Link</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. github.com/user/project"
                      value={proj.link || ""}
                      onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Technologies (comma-separated)</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      value={techsRaw[proj.id] || ""}
                      onChange={(e) => handleTechsChange(proj.id, e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brief Description</label>
                  <textarea
                    rows={2}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                  />
                  <AIPolishButton
                    currentText={proj.description}
                    onUpdate={(val) => updateProject(proj.id, "description", val)}
                    fieldName={`Project: ${proj.name || "My Project"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Education entries */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Academic Qualifications</span>
          </h3>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition duration-150"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        </div>

        {data.education.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">No education entries defined. Add one using the button above.</p>
        ) : (
          <div className="space-y-6 divide-y divide-slate-800/80">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className={`space-y-3 pt-4 ${idx === 0 ? "pt-0" : ""}`}>
                <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded-lg">
                  <span className="text-xs font-bold text-indigo-400">#Institution {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition duration-150"
                    title="Remove education degree"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Degree/Certificate</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">School/University</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Period/Dates</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 2018 - 2022"
                      value={edu.period}
                      onChange={(e) => updateEducation(edu.id, "period", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Honors / Field details</label>
                  <textarea
                    rows={2}
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500"
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
