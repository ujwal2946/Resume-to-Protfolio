import { PortfolioData } from "../types";

export const DEFAULT_PORTFOLIO: PortfolioData = {
  name: "Alexander Vance",
  title: "Senior Product Engineering Lead",
  email: "alexander.vance@techcorp.io",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  website: "https://vance.dev",
  github: "https://github.com/vancedev",
  linkedin: "https://linkedin.com/in/alexandervance",
  summary: "Dynamic product engineering leader with 7+ years of expertise in constructing scalable React architectures, high-performance Node systems, and cloud-native infrastructure. Proven track record of spearheading distributed engineering teams to ship responsive, reliable solutions that delight millions of users globally.",
  skills: [
    "React", "TypeScript", "Node.js", "Generative AI", "Tailwind CSS", "AWS", "Performance Tuning", "System Architecture"
  ],
  experience: [
    {
      id: "exp-1",
      role: "Lead Systems Architect & Product Developer",
      company: "Innovate Labs",
      period: "2021 - Present",
      description: "Led a diverse cross-functional group of 6 developers to architect and distribute a high-frequency telemetry dashboard, shrinking client-side loading latency by 45%. Oversaw migration of front-end infrastructure to React 19 and Tailwind CSS, standardizing token system design."
    },
    {
      id: "exp-2",
      role: "Senior Software Engineer",
      company: "CloudCore Systems",
      period: "2018 - 2021",
      description: "Crafted core microservices responsible for parsing extensive CSV & JSON streaming data. Streamlined API responses reducing latency by 120ms. Pioneered strict type-safety conventions and introduced Jest and Playwright testing, boosting code coverage to 92%."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science & Engineering",
      school: "University of California, Berkeley",
      period: "2014 - 2018",
      description: "Graduated with Honors. Specialized in Distributed Database Systems and Interactive User Interface Engineering Design."
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Symphony AI Playground",
      description: "An elegant interactive low-code visual playground where users compile structured LLM chains visually and export code packages natively.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Gemini API", "Zustand"],
      link: "https://symphony.playground.dev"
    },
    {
      id: "proj-2",
      name: "Quasar API Gateway",
      description: "An ultra-fast, lightweight developer gateway designed to capture, parse, and route high-throughput WebSocket events with millisecond-grade routing schemas.",
      technologies: ["TypeScript", "Node.js", "Redis", "Docker"],
      link: "https://github.com/vancedev/quasar"
    }
  ]
};
