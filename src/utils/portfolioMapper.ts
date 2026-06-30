/**
 * Maps raw parsed resume API response into a fully-typed PortfolioData object with generated IDs.
 */

import { PortfolioData } from "../types";
import { generateId } from "./idGenerator";

interface RawResumeData {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  summary?: string;
  skills?: string[];
  experience?: { role?: string; company?: string; period?: string; description?: string }[];
  education?: { degree?: string; school?: string; period?: string; description?: string }[];
  projects?: { name?: string; description?: string; technologies?: string[]; link?: string }[];
}

export function mapRawToPortfolio(raw: RawResumeData): PortfolioData {
  return {
    name: raw.name || "",
    title: raw.title || "",
    email: raw.email || "",
    phone: raw.phone || "",
    location: raw.location || "",
    website: raw.website || "",
    github: raw.github || "",
    linkedin: raw.linkedin || "",
    summary: raw.summary || "",
    skills: raw.skills || [],
    experience: (raw.experience || []).map((exp, i) => ({
      id: generateId("exp", i),
      role: exp.role || "",
      company: exp.company || "",
      period: exp.period || "",
      description: exp.description || "",
    })),
    education: (raw.education || []).map((edu, i) => ({
      id: generateId("edu", i),
      degree: edu.degree || "",
      school: edu.school || "",
      period: edu.period || "",
      description: edu.description || "",
    })),
    projects: (raw.projects || []).map((proj, i) => ({
      id: generateId("proj", i),
      name: proj.name || "",
      description: proj.description || "",
      technologies: proj.technologies || [],
      link: proj.link || "",
    })),
  };
}
