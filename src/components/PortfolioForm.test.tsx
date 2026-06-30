import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import PortfolioForm from "./PortfolioForm";
import { PortfolioData } from "../types";

const createMockData = (): PortfolioData => ({
  name: "Jane Doe",
  title: "Engineer",
  email: "jane@test.com",
  phone: "555-0000",
  location: "NYC",
  website: "https://jane.dev",
  github: "https://github.com/jane",
  linkedin: "https://linkedin.com/in/jane",
  summary: "A talented engineer.",
  skills: ["React", "TypeScript"],
  experience: [
    {
      id: "exp-1",
      role: "Dev Lead",
      company: "Acme Inc",
      period: "2020 - Present",
      description: "Led the frontend team.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "BS CS",
      school: "State U",
      period: "2016 - 2020",
      description: "Honors student.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Widget",
      description: "A useful widget.",
      technologies: ["React", "Node"],
      link: "https://widget.dev",
    },
  ],
});

describe("PortfolioForm", () => {
  let onChange: ReturnType<typeof vi.fn>;
  let mockData: PortfolioData;

  beforeEach(() => {
    onChange = vi.fn();
    mockData = createMockData();
  });

  it("renders identity fields with correct values", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const nameInput = screen.getByPlaceholderText("e.g. John Doe") as HTMLInputElement;
    expect(nameInput.value).toBe("Jane Doe");
  });

  it("calls onChange when name is updated", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const nameInput = screen.getByPlaceholderText("e.g. John Doe");
    fireEvent.change(nameInput, { target: { value: "John Smith" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: "John Smith" })
    );
  });

  it("calls onChange when email is updated", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const emailInput = screen.getByPlaceholderText("e.g. name@domain.com");
    fireEvent.change(emailInput, { target: { value: "new@email.com" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ email: "new@email.com" })
    );
  });

  it("calls onChange when summary is updated", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const summaryInput = screen.getByPlaceholderText(
      "Introduce your signature value proposition..."
    );
    fireEvent.change(summaryInput, { target: { value: "New summary." } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ summary: "New summary." })
    );
  });

  it("parses skills from comma-separated input", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const skillsInput = screen.getByPlaceholderText(
      "React, TypeScript, GraphQL, Docker..."
    );
    fireEvent.change(skillsInput, {
      target: { value: "Go, Rust, Python" },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ skills: ["Go", "Rust", "Python"] })
    );
  });

  it("filters empty skills from comma-separated input", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const skillsInput = screen.getByPlaceholderText(
      "React, TypeScript, GraphQL, Docker..."
    );
    fireEvent.change(skillsInput, {
      target: { value: "Go, , Rust, , " },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ skills: ["Go", "Rust"] })
    );
  });

  it("adds a new experience entry when 'Add Role' is clicked", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const addButton = screen.getByText("Add Role");
    fireEvent.click(addButton);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        experience: expect.arrayContaining([
          expect.objectContaining({ id: "exp-1" }),
          expect.objectContaining({ role: "", company: "" }),
        ]),
      })
    );
  });

  it("removes an experience entry when trash icon is clicked", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const removeButton = screen.getByTitle("Remove role entry");
    fireEvent.click(removeButton);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ experience: [] })
    );
  });

  it("updates an experience field", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const roleInputs = screen.getAllByDisplayValue("Dev Lead");
    fireEvent.change(roleInputs[0], { target: { value: "CTO" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        experience: [expect.objectContaining({ role: "CTO" })],
      })
    );
  });

  it("adds a new project entry when 'Add Project' is clicked", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const addButton = screen.getByText("Add Project");
    fireEvent.click(addButton);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        projects: expect.arrayContaining([
          expect.objectContaining({ id: "proj-1" }),
          expect.objectContaining({ name: "", description: "" }),
        ]),
      })
    );
  });

  it("removes a project entry when trash icon is clicked", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const removeButton = screen.getByTitle("Remove project entry");
    fireEvent.click(removeButton);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ projects: [] })
    );
  });

  it("shows empty state text when no experience exists", () => {
    const dataNoExp = { ...mockData, experience: [] };
    render(<PortfolioForm data={dataNoExp} onChange={onChange} />);
    expect(
      screen.getByText(/No experience entries defined/)
    ).toBeInTheDocument();
  });

  it("shows empty state text when no projects exist", () => {
    const dataNoProj = { ...mockData, projects: [] };
    render(<PortfolioForm data={dataNoProj} onChange={onChange} />);
    expect(
      screen.getByText(/No project entries defined/)
    ).toBeInTheDocument();
  });

  it("renders section headers", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    expect(screen.getByText("Identity & Contacts")).toBeInTheDocument();
    expect(screen.getByText("Professional Summary")).toBeInTheDocument();
    expect(
      screen.getByText("Core Capabilities & Core Skills")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Professional Work Experience")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Featured Case Studies & Projects")
    ).toBeInTheDocument();
  });

  it("renders location input with current value", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const locationInput = screen.getByPlaceholderText("e.g. Seattle, WA") as HTMLInputElement;
    expect(locationInput.value).toBe("NYC");
  });

  it("calls onChange when location is updated", () => {
    render(<PortfolioForm data={mockData} onChange={onChange} />);
    const locationInput = screen.getByPlaceholderText("e.g. Seattle, WA");
    fireEvent.change(locationInput, { target: { value: "Boston, MA" } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ location: "Boston, MA" })
    );
  });
});
