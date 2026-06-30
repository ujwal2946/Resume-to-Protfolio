import { describe, it, expect } from "vitest";
import { detectFileType, buildEditPrompt } from "./fileDetection";

describe("detectFileType", () => {
  it("detects PDF by file extension", () => {
    const result = detectFileType("resume.pdf", "someRandomData");
    expect(result.isPDF).toBe(true);
    expect(result.isDocx).toBe(false);
    expect(result.isDoc).toBe(false);
    expect(result.isSupported).toBe(true);
  });

  it("detects PDF by base64 magic bytes", () => {
    const result = detectFileType("unknown_file", "JVBERi0xLjQgMSAwIG9iago=");
    expect(result.isPDF).toBe(true);
    expect(result.isDocx).toBe(false);
    expect(result.isSupported).toBe(true);
  });

  it("detects DOCX by file extension", () => {
    const result = detectFileType("resume.docx", "someRandomData");
    expect(result.isPDF).toBe(false);
    expect(result.isDocx).toBe(true);
    expect(result.isDoc).toBe(false);
    expect(result.isSupported).toBe(true);
  });

  it("detects DOCX by zip magic bytes when not PDF", () => {
    const result = detectFileType("resume_file", "UEsDBBQAAAAIAA==");
    expect(result.isPDF).toBe(false);
    expect(result.isDocx).toBe(true);
    expect(result.isSupported).toBe(true);
  });

  it("prefers PDF detection over zip magic bytes", () => {
    const result = detectFileType("resume.pdf", "UEsDBBQAAAAIAA==");
    expect(result.isPDF).toBe(true);
    expect(result.isDocx).toBe(false);
  });

  it("detects old DOC format", () => {
    const result = detectFileType("resume.doc", "someOldData");
    expect(result.isPDF).toBe(false);
    expect(result.isDocx).toBe(false);
    expect(result.isDoc).toBe(true);
    expect(result.isSupported).toBe(true);
  });

  it("does not treat .doc as isDoc if it's actually a .docx", () => {
    const result = detectFileType("resume.docx", "someData");
    expect(result.isDoc).toBe(false);
    expect(result.isDocx).toBe(true);
  });

  it("returns unsupported for unknown file types", () => {
    const result = detectFileType("resume.txt", "plainTextData");
    expect(result.isPDF).toBe(false);
    expect(result.isDocx).toBe(false);
    expect(result.isDoc).toBe(false);
    expect(result.isSupported).toBe(false);
  });

  it("returns unsupported for image files", () => {
    const result = detectFileType("photo.png", "iVBORw0KGgo=");
    expect(result.isSupported).toBe(false);
  });

  it("handles empty fileName gracefully", () => {
    const result = detectFileType("", "someData");
    expect(result.isPDF).toBe(false);
    expect(result.isDocx).toBe(false);
    expect(result.isDoc).toBe(false);
    expect(result.isSupported).toBe(false);
  });

  it("handles empty fileData gracefully", () => {
    const result = detectFileType("resume.pdf", "");
    expect(result.isPDF).toBe(true);
    expect(result.isSupported).toBe(true);
  });

  it("is case-insensitive for file extensions", () => {
    const result = detectFileType("Resume.PDF", "someData");
    expect(result.isPDF).toBe(true);
  });
});

describe("buildEditPrompt", () => {
  it("returns shorten prompt for 'shorten' command", () => {
    const prompt = buildEditPrompt("shorten");
    expect(prompt).toContain("Condense");
    expect(prompt).toContain("shorten");
  });

  it("returns professionalize prompt", () => {
    const prompt = buildEditPrompt("professionalize");
    expect(prompt).toContain("professional");
    expect(prompt).toContain("action verbs");
  });

  it("returns bullet-points prompt", () => {
    const prompt = buildEditPrompt("bullet-points");
    expect(prompt).toContain("bullet points");
  });

  it("returns expand prompt", () => {
    const prompt = buildEditPrompt("expand");
    expect(prompt).toContain("Elaborate");
    expect(prompt).toContain("metric-driven");
  });

  it("returns default polish prompt for unknown commands", () => {
    const prompt = buildEditPrompt("unknown-cmd");
    expect(prompt).toContain("Refine and polish");
  });

  it("appends fieldName context when provided", () => {
    const prompt = buildEditPrompt("shorten", "Professional Summary");
    expect(prompt).toContain('belongs to the "Professional Summary" field');
  });

  it("does not append fieldName context when omitted", () => {
    const prompt = buildEditPrompt("shorten");
    expect(prompt).not.toContain("belongs to the");
  });
});
