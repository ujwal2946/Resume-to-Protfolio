/**
 * Complete types for the AI Resume to Portfolio Builder
 */

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  period: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
}

export interface ParseResumeResponse {
  success: boolean;
  data?: Omit<PortfolioData, 'experience' | 'education' | 'projects'> & {
    experience: Omit<ExperienceItem, 'id'>[];
    education: Omit<EducationItem, 'id'>[];
    projects: Omit<ProjectItem, 'id'>[];
  };
  error?: string;
}

export interface EditContentRequest {
  text: string;
  command: 'shorten' | 'professionalize' | 'bullet-points' | 'expand';
  fieldName?: string;
}

export interface EditContentResponse {
  success: boolean;
  enhancedText?: string;
  error?: string;
}
