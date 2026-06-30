import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import fs from "fs";
import mammoth from "mammoth";
import rateLimit from "express-rate-limit";

dotenv.config();

let resolvedDirname: string;
try {
  const resolvedFilename = fileURLToPath(import.meta.url);
  resolvedDirname = path.dirname(resolvedFilename);
} catch {
  resolvedDirname = process.cwd();
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // Increase body size limit to support PDF base64 payloads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // Initialize Gemini Client
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features might fail.");
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // API Route: Check Health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: "Too many requests. Please wait a moment before trying again." },
  });

  // API Route: Parse Resume PDF Text and Structure using Gemini
  app.post("/api/parse-resume", aiLimiter, async (req, res) => {
    try {
      const { fileData, fileName } = req.body;

      if (!fileData) {
        return res.status(400).json({ success: false, error: "Missing fileData (base64 string)" });
      }

      console.log(`Received document for direct parser. Filename: ${fileName}`);

      // Structure PDF or Word Doc using Gemini's structured response schema
      const prompt = `You are an elite talent engineer and executive resume parser.
Analyze this raw resume document carefully.

Extract and clean all fields. Make sure to structure it perfectly into the provided JSON schema.
If any contact details (email, phone, linkedin, github) are absent, leave them as empty strings. 
Ensure the "summary" is a highly professional, captivating summary paragraph (approx 50-80 words).
Ensure experience description is summarized as clean bullet points or professional sentences.
Convert the extracted details into a flawless resume profile JSON structure.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Full legal name" },
          title: { type: Type.STRING, description: "Target profession, e.g., Senior Frontend Architect" },
          email: { type: Type.STRING, description: "Email address or blank" },
          phone: { type: Type.STRING, description: "Phone number or blank" },
          location: { type: Type.STRING, description: "City, State/Country" },
          website: { type: Type.STRING, description: "Personal URL or blank" },
          github: { type: Type.STRING, description: "GitHub profile URL" },
          linkedin: { type: Type.STRING, description: "LinkedIn profile URL" },
          summary: { type: Type.STRING, description: "Captivating professional summary" },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Array of clean list of skills (e.g. React, Docker)"
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING, description: "Role/Title" },
                company: { type: Type.STRING, description: "Company or Organization" },
                period: { type: Type.STRING, description: "Time range (e.g., May 2021 - Present)" },
                description: { type: Type.STRING, description: "Clean summary of responsibilities with bullet points if necessary" }
              },
              required: ["role", "company", "period", "description"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING, description: "Degree/Certificate (e.g., B.S. in Computer Science)" },
                school: { type: Type.STRING, description: "University/School name" },
                period: { type: Type.STRING, description: "Degree duration (e.g., 2017 - 2021)" },
                description: { type: Type.STRING, description: "Grade details or brief studies details" }
              },
              required: ["degree", "school", "period", "description"]
            }
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Project title" },
                description: { type: Type.STRING, description: "Clear pitch of what the project does" },
                technologies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of tech used"
                },
                link: { type: Type.STRING, description: "Link to repo or live URL" }
              },
              required: ["name", "description", "technologies"]
            }
          }
        },
        required: ["name", "title", "email", "phone", "location", "summary", "skills", "experience", "education", "projects"]
      };

      const lowerName = (fileName || "").toLowerCase();
      const startsWithPDF = fileData.startsWith("JVBERi"); // %PDF-
      const startsWithZip = fileData.startsWith("UEsDB"); // PK.. zip format of docx
      
      const isPDF = lowerName.endsWith(".pdf") || startsWithPDF;
      const isDocx = lowerName.endsWith(".docx") || (!isPDF && startsWithZip);
      const isDoc = lowerName.endsWith(".doc") && !isDocx;

      let response;

      if (isPDF) {
        const pdfPart = {
          inlineData: {
            mimeType: "application/pdf",
            data: fileData,
          },
        };
        const textPart = {
          text: prompt,
        };
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts: [pdfPart, textPart] },
          config: {
            systemInstruction: "You are an automated resume-to-portfolio compiler. You extract and translate professional details from unstructured raw resume text into flawless, highly styled Web CV JSON content.",
            responseMimeType: "application/json",
            responseSchema: schema
          }
        });
      } else if (isDocx) {
        console.log(`Extracting plain text from docx via mammoth...`);
        const buffer = Buffer.from(fileData, "base64");
        const mammothResult = await mammoth.extractRawText({ buffer });
        const extractedText = mammothResult.value || "";

        if (!extractedText.trim()) {
          return res.status(422).json({
            success: false,
            error: "The Word document is empty or contains no extractable text.",
          });
        }

        const docxPrompt = `${prompt}\n\nHere is the extracted resume Word Document text:\n\n${extractedText}`;
        const textPart = {
          text: docxPrompt,
        };
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: { parts: [textPart] },
          config: {
            systemInstruction: "You are an automated resume-to-portfolio compiler. You extract and translate professional details from unstructured raw resume text into flawless, highly styled Web CV JSON content.",
            responseMimeType: "application/json",
            responseSchema: schema
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          error: "Unsupported file format. Please upload a PDF (.pdf) or standard Word Document (.docx).",
        });
      }

      const responseText = response.text;
      if (!responseText || !responseText.trim()) {
        return res.status(502).json({
          success: false,
          error: "AI returned an empty response. Please try again.",
        });
      }

      let structuredData;
      try {
        structuredData = JSON.parse(responseText.trim());
      } catch {
        return res.status(502).json({
          success: false,
          error: "AI returned malformed data. Please try again.",
        });
      }

      if (!structuredData.name && !structuredData.title && !structuredData.summary) {
        return res.status(422).json({
          success: false,
          error: "Could not extract meaningful data from the document. Please ensure it is a valid resume.",
        });
      }

      return res.json({
        success: true,
        data: structuredData,
      });

    } catch (error: any) {
      console.error("Parse-Resume Route Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "An error occurred while compiling resume document.",
      });
    }
  });

  // API Route: Tailor or Enhance individual fields with custom prompt (shorten, professionalize, bullet-points, expand)
  app.post("/api/edit-content", aiLimiter, async (req, res) => {
    try {
      const { text, command, fieldName } = req.body;

      if (!text) {
        return res.status(400).json({ success: false, error: "Missing required text input" });
      }

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

      const prompt = `${templatePrompt}
Original Text:
"""
${text}
"""

Output rules:
1. Preserve all factual timelines, names, projects, and actual skills.
2. Return ONLY the edited/enhanced text. Do not add intros (e.g., "Here is the refined text:"), explanation text, or wrapping quotes.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an AI resume copywriter. You edit text inputs to perfect grammar, and maximize visual and semantic punch without inventing fake events.",
        }
      });

      const enhancedText = response.text?.trim() || text;

      return res.json({
        success: true,
        enhancedText: enhancedText,
      });

    } catch (error: any) {
      console.error("Edit-Content Route Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "An error occurred during text generation.",
      });
    }
  });

  // Vite integration / Static Asset Delivery (robust build-aware routing fallback)
  const isProd = process.env.NODE_ENV === "production";
  const distPath = path.join(process.cwd(), "dist");
  const hasBuildOutput = fs.existsSync(path.join(distPath, "index.html"));

  if (!isProd || !hasBuildOutput) {
    console.log("Serving application using Vite dynamic compilation middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving compiled static production assets from:", distPath);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Resume to Portfolio Builder running at http://localhost:${PORT}`);
  });
}

startServer();
