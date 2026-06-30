import { describe, it, expect } from "vitest";
import { DEFAULT_PORTFOLIO } from "./defaultPortfolio";

describe("DEFAULT_PORTFOLIO", () => {
  it("has a non-empty name", () => {
    expect(DEFAULT_PORTFOLIO.name).toBeTruthy();
    expect(typeof DEFAULT_PORTFOLIO.name).toBe("string");
  });

  it("has a non-empty title", () => {
    expect(DEFAULT_PORTFOLIO.title).toBeTruthy();
  });

  it("has a valid email", () => {
    expect(DEFAULT_PORTFOLIO.email).toContain("@");
  });

  it("has a phone number", () => {
    expect(DEFAULT_PORTFOLIO.phone).toBeTruthy();
  });

  it("has a location", () => {
    expect(DEFAULT_PORTFOLIO.location).toBeTruthy();
  });

  it("has website, github, and linkedin URLs", () => {
    expect(DEFAULT_PORTFOLIO.website).toContain("https://");
    expect(DEFAULT_PORTFOLIO.github).toContain("github.com");
    expect(DEFAULT_PORTFOLIO.linkedin).toContain("linkedin.com");
  });

  it("has a non-empty summary", () => {
    expect(DEFAULT_PORTFOLIO.summary.length).toBeGreaterThan(50);
  });

  it("has at least one skill", () => {
    expect(DEFAULT_PORTFOLIO.skills.length).toBeGreaterThan(0);
    DEFAULT_PORTFOLIO.skills.forEach((skill) => {
      expect(typeof skill).toBe("string");
      expect(skill.length).toBeGreaterThan(0);
    });
  });

  it("has experience entries with required fields", () => {
    expect(DEFAULT_PORTFOLIO.experience.length).toBeGreaterThan(0);
    DEFAULT_PORTFOLIO.experience.forEach((exp) => {
      expect(exp.id).toBeTruthy();
      expect(exp.role).toBeTruthy();
      expect(exp.company).toBeTruthy();
      expect(exp.period).toBeTruthy();
      expect(exp.description).toBeTruthy();
    });
  });

  it("has unique experience IDs", () => {
    const ids = DEFAULT_PORTFOLIO.experience.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has education entries with required fields", () => {
    expect(DEFAULT_PORTFOLIO.education.length).toBeGreaterThan(0);
    DEFAULT_PORTFOLIO.education.forEach((edu) => {
      expect(edu.id).toBeTruthy();
      expect(edu.degree).toBeTruthy();
      expect(edu.school).toBeTruthy();
      expect(edu.period).toBeTruthy();
    });
  });

  it("has project entries with required fields", () => {
    expect(DEFAULT_PORTFOLIO.projects.length).toBeGreaterThan(0);
    DEFAULT_PORTFOLIO.projects.forEach((proj) => {
      expect(proj.id).toBeTruthy();
      expect(proj.name).toBeTruthy();
      expect(proj.description).toBeTruthy();
      expect(Array.isArray(proj.technologies)).toBe(true);
      expect(proj.technologies.length).toBeGreaterThan(0);
    });
  });

  it("has unique project IDs", () => {
    const ids = DEFAULT_PORTFOLIO.projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("conforms to PortfolioData shape", () => {
    const requiredKeys: string[] = [
      "name", "title", "email", "phone", "location",
      "website", "github", "linkedin", "summary",
      "skills", "experience", "education", "projects",
    ];
    requiredKeys.forEach((key) => {
      expect(DEFAULT_PORTFOLIO).toHaveProperty(key);
    });
  });
});
