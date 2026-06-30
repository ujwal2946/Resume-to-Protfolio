import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import PortfolioPreview from "./PortfolioPreview";
import { PortfolioData } from "../types";

const mockData: PortfolioData = {
  name: "Jane Doe",
  title: "Senior Engineer",
  email: "jane@example.com",
  phone: "+1 555-1234",
  location: "New York, NY",
  website: "https://jane.dev",
  github: "https://github.com/janedoe",
  linkedin: "https://linkedin.com/in/janedoe",
  summary: "Experienced engineer with 10+ years of expertise.",
  skills: ["React", "TypeScript", "Node.js"],
  experience: [
    {
      id: "exp-1",
      role: "Lead Developer",
      company: "TechCorp",
      period: "2020 - Present",
      description: "Led a team of 5 engineers.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. Computer Science",
      school: "MIT",
      period: "2010 - 2014",
      description: "Graduated with honors.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Cool Project",
      description: "A project that does cool things.",
      technologies: ["React", "Go"],
      link: "https://github.com/janedoe/cool",
    },
  ],
};

describe("PortfolioPreview", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders the user's name", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders the user's title", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
  });

  it("renders the professional summary", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(
      screen.getByText("Experienced engineer with 10+ years of expertise.")
    ).toBeInTheDocument();
  });

  it("renders all skills as badges", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("renders experience entries", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(screen.getByText("Lead Developer")).toBeInTheDocument();
    expect(screen.getByText("TechCorp")).toBeInTheDocument();
    expect(screen.getByText("2020 - Present")).toBeInTheDocument();
  });

  it("renders education entries", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(screen.getByText("B.S. Computer Science")).toBeInTheDocument();
    expect(screen.getByText("MIT")).toBeInTheDocument();
  });

  it("renders project entries", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(screen.getByText("Cool Project")).toBeInTheDocument();
    expect(
      screen.getByText("A project that does cool things.")
    ).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1 555-1234")).toBeInTheDocument();
    expect(screen.getByText("New York, NY")).toBeInTheDocument();
  });

  it("renders theme selector buttons", () => {
    render(<PortfolioPreview data={mockData} />);
    expect(screen.getByText("Cosmic")).toBeInTheDocument();
    expect(screen.getByText("Swiss")).toBeInTheDocument();
    expect(screen.getByText("Warm")).toBeInTheDocument();
    expect(screen.getByText("Cyber")).toBeInTheDocument();
  });

  it("switches theme when clicking a theme button", () => {
    const { container } = render(<PortfolioPreview data={mockData} />);
    const swissButton = screen.getByText("Swiss");
    fireEvent.click(swissButton);
    const previewArea = container.querySelector(".flex-1.overflow-y-auto");
    expect(previewArea?.className).toContain("bg-white");
  });

  it("applies cyberpunk theme styles", () => {
    const { container } = render(<PortfolioPreview data={mockData} />);
    fireEvent.click(screen.getByText("Cyber"));
    const previewArea = container.querySelector(".flex-1.overflow-y-auto");
    expect(previewArea?.className).toContain("bg-zinc-950");
    expect(previewArea?.className).toContain("font-mono");
  });

  it("applies warm theme styles", () => {
    const { container } = render(<PortfolioPreview data={mockData} />);
    fireEvent.click(screen.getByText("Warm"));
    const previewArea = container.querySelector(".flex-1.overflow-y-auto");
    expect(previewArea?.className).toContain("font-serif");
  });

  it("copies HTML when clicking Copy Web Code", () => {
    render(<PortfolioPreview data={mockData} />);
    const copyButton = screen.getByText("Copy Web Code");
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    const copiedHTML = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(copiedHTML).toContain("Jane Doe");
    expect(copiedHTML).toContain("Senior Engineer");
    expect(copiedHTML).toContain("<!DOCTYPE html>");
  });

  it("shows 'HTML Copied!' after clicking copy", () => {
    render(<PortfolioPreview data={mockData} />);
    fireEvent.click(screen.getByText("Copy Web Code"));
    expect(screen.getByText("HTML Copied!")).toBeInTheDocument();
  });

  it("renders fallback text when name is empty", () => {
    const emptyData = { ...mockData, name: "" };
    render(<PortfolioPreview data={emptyData} />);
    expect(screen.getByText("Enter Name")).toBeInTheDocument();
  });

  it("renders fallback text when title is empty", () => {
    const emptyData = { ...mockData, title: "" };
    render(<PortfolioPreview data={emptyData} />);
    expect(screen.getByText("Elite Professional Title")).toBeInTheDocument();
  });

  it("hides summary section when summary is empty", () => {
    const emptyData = { ...mockData, summary: "" };
    render(<PortfolioPreview data={emptyData} />);
    expect(screen.queryByText("About Me")).not.toBeInTheDocument();
  });

  it("hides skills section when skills array is empty", () => {
    const emptyData = { ...mockData, skills: [] };
    render(<PortfolioPreview data={emptyData} />);
    expect(screen.queryByText("Skills & Expertise")).not.toBeInTheDocument();
  });

  it("hides experience section when experience array is empty", () => {
    const emptyData = { ...mockData, experience: [] };
    render(<PortfolioPreview data={emptyData} />);
    expect(
      screen.queryByText("Professional Experience")
    ).not.toBeInTheDocument();
  });

  it("hides education section when education array is empty", () => {
    const emptyData = { ...mockData, education: [] };
    render(<PortfolioPreview data={emptyData} />);
    expect(screen.queryByText("Education")).not.toBeInTheDocument();
  });

  it("hides projects section when projects array is empty", () => {
    const emptyData = { ...mockData, projects: [] };
    render(<PortfolioPreview data={emptyData} />);
    expect(screen.queryByText("Featured Projects")).not.toBeInTheDocument();
  });

  it("renders GitHub link with correct href", () => {
    render(<PortfolioPreview data={mockData} />);
    const githubLink = screen.getByText("GitHub").closest("a");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/janedoe"
    );
  });

  it("prepends https:// to github URL without scheme", () => {
    const dataNoScheme = {
      ...mockData,
      github: "github.com/janedoe",
    };
    render(<PortfolioPreview data={dataNoScheme} />);
    const githubLink = screen.getByText("GitHub").closest("a");
    expect(githubLink).toHaveAttribute("href", "https://github.com/janedoe");
  });
});
