/**
 * Shared parsing utilities for comma-separated strings and file type detection.
 */

export function parseCommaSeparated(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export interface FileTypeResult {
  isPDF: boolean;
  isDocx: boolean;
  isDoc: boolean;
}

/**
 * Detect file type from filename and optional base64 prefix or MIME type.
 */
export function detectFileType(
  fileName: string,
  options?: { base64Data?: string; mimeType?: string }
): FileTypeResult {
  const lowerName = (fileName || "").toLowerCase();
  const base64Data = options?.base64Data || "";
  const mimeType = (options?.mimeType || "").toLowerCase();

  const startsWithPDF = base64Data.startsWith("JVBERi");
  const startsWithZip = base64Data.startsWith("UEsDB");

  const isPDF =
    lowerName.endsWith(".pdf") ||
    startsWithPDF ||
    mimeType.includes("pdf");

  const isDocx =
    lowerName.endsWith(".docx") ||
    (!isPDF && startsWithZip) ||
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("officedocument") ||
    mimeType.includes("docx");

  const isDoc =
    (lowerName.endsWith(".doc") && !isDocx) ||
    mimeType.includes("msword");

  return { isPDF, isDocx, isDoc };
}
