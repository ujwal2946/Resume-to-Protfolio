export interface FileTypeResult {
  isPDF: boolean;
  isDocx: boolean;
  isDoc: boolean;
  isSupported: boolean;
}

export function detectFileType(fileName: string, fileData: string): FileTypeResult {
  const lowerName = (fileName || "").toLowerCase();
  const startsWithPDF = fileData.startsWith("JVBERi"); // %PDF-
  const startsWithZip = fileData.startsWith("UEsDB"); // PK.. zip format of docx

  const isPDF = lowerName.endsWith(".pdf") || startsWithPDF;
  const isDocx = lowerName.endsWith(".docx") || (!isPDF && startsWithZip);
  const isDoc = lowerName.endsWith(".doc") && !isDocx;

  return {
    isPDF,
    isDocx,
    isDoc,
    isSupported: isPDF || isDocx || isDoc,
  };
}

export function buildEditPrompt(
  command: "shorten" | "professionalize" | "bullet-points" | "expand" | string,
  fieldName?: string
): string {
  let templatePrompt = "";
  if (command === "shorten") {
    templatePrompt = `Condense and shorten the following resume content while keeping the essence. Make it ultra-concise but packed with impact.`;
  } else if (command === "professionalize") {
    templatePrompt = `Rewrite the following text to sound incredibly modern, professional, high-impact, and premium. Use action verbs and highlight accomplishments.`;
  } else if (command === "bullet-points") {
    templatePrompt = `Transform the following paragraph into 2-4 clean, bite-sized high-impact professional accomplishments or responsibilities formatted with bullet points ("- ").`;
  } else if (command === "expand") {
    templatePrompt = `Elaborate on the following bullet/text to add metric-driven results, depth of responsibility, and premium professional polish.`;
  } else {
    templatePrompt = `Refine and polish the following text to make it read perfectly for a professional web portfolio.`;
  }

  if (fieldName) {
    templatePrompt += ` Context: This content belongs to the "${fieldName}" field of the career portfolio.`;
  }

  return templatePrompt;
}
