import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import ResumeDropzone from "./ResumeDropzone";

describe("ResumeDropzone", () => {
  let onParseComplete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onParseComplete = vi.fn();
    vi.restoreAllMocks();
  });

  it("renders the upload prompt", () => {
    render(<ResumeDropzone onParseComplete={onParseComplete} />);
    expect(
      screen.getByText("Drag & drop your PDF or Word resume")
    ).toBeInTheDocument();
    expect(screen.getByText("or click to browse your files")).toBeInTheDocument();
  });

  it("renders supported format text", () => {
    render(<ResumeDropzone onParseComplete={onParseComplete} />);
    expect(
      screen.getByText("PDF or Word (.pdf, .docx, .doc)")
    ).toBeInTheDocument();
  });

  it("has a hidden file input that accepts correct formats", () => {
    const { container } = render(
      <ResumeDropzone onParseComplete={onParseComplete} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    expect(fileInput).toBeTruthy();
    expect(fileInput.accept).toBe(".pdf,.docx,.doc");
    expect(fileInput.className).toContain("hidden");
  });

  it("shows error for unsupported file type", async () => {
    render(<ResumeDropzone onParseComplete={onParseComplete} />);
    const { container } = render(
      <ResumeDropzone onParseComplete={onParseComplete} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const unsupportedFile = new File(["hello"], "notes.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, { target: { files: [unsupportedFile] } });

    await waitFor(() => {
      expect(screen.getByText(/Supported formats/)).toBeInTheDocument();
    });
  });

  it("shows loading state when a PDF is being processed", async () => {
    vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve(
                new Response(
                  JSON.stringify({
                    success: true,
                    data: {
                      name: "Test",
                      title: "Dev",
                      email: "",
                      phone: "",
                      location: "",
                      website: "",
                      github: "",
                      linkedin: "",
                      summary: "",
                      skills: [],
                      experience: [],
                      education: [],
                      projects: [],
                    },
                  }),
                  { status: 200, headers: { "Content-Type": "application/json" } }
                )
              ),
            500
          )
        )
    );

    const { container } = render(
      <ResumeDropzone onParseComplete={onParseComplete} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const pdfFile = new File(["fake-pdf"], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    await waitFor(() => {
      expect(screen.getByText("AI COMPILING ACTIVE")).toBeInTheDocument();
    });
  });

  it("applies drag-active styling on dragEnter", () => {
    const { container } = render(
      <ResumeDropzone onParseComplete={onParseComplete} />
    );
    const dropzone = container.querySelector(".border-dashed") as HTMLElement;

    fireEvent.dragEnter(dropzone, {
      dataTransfer: { files: [] },
    });

    expect(dropzone.className).toContain("border-indigo-500");
  });

  it("removes drag-active styling on dragLeave", () => {
    const { container } = render(
      <ResumeDropzone onParseComplete={onParseComplete} />
    );
    const dropzone = container.querySelector(".border-dashed") as HTMLElement;

    fireEvent.dragEnter(dropzone, { dataTransfer: { files: [] } });
    fireEvent.dragLeave(dropzone, { dataTransfer: { files: [] } });

    expect(dropzone.className).toContain("border-slate-800");
  });

  it("calls onParseComplete after successful parse", async () => {
    const mockResponse = {
      success: true,
      data: {
        name: "Parsed Name",
        title: "Parsed Title",
        email: "p@test.com",
        phone: "123",
        location: "Anywhere",
        website: "",
        github: "",
        linkedin: "",
        summary: "A summary",
        skills: ["JS"],
        experience: [
          { role: "Dev", company: "Co", period: "2020", description: "Worked." },
        ],
        education: [
          { degree: "BS", school: "U", period: "2016", description: "Studied." },
        ],
        projects: [
          {
            name: "Proj",
            description: "Desc",
            technologies: ["React"],
            link: "",
          },
        ],
      },
    };

    vi.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    // Mock FileReader as a class so it can be used with `new`
    let capturedOnload: (() => void) | null = null;
    const mockReadAsDataURL = vi.fn();

    class MockFileReader {
      result = "data:application/pdf;base64,JVBERi0xLjQ=";
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL(_file: Blob) {
        mockReadAsDataURL(_file);
        // Capture onload for later triggering
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    const { container } = render(
      <ResumeDropzone onParseComplete={onParseComplete} />
    );
    const fileInput = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    const pdfFile = new File(["fake-pdf"], "resume.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    await waitFor(
      () => {
        expect(onParseComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 }
    );

    const calledWith = onParseComplete.mock.calls[0][0];
    expect(calledWith.name).toBe("Parsed Name");
    expect(calledWith.experience).toHaveLength(1);
    expect(calledWith.experience[0].id).toBeTruthy();
  });
});
