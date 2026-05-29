import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractTextFromPdf(buffer) {
  try {
    const data = await pdfParse(buffer);
    const text = data.text?.trim();
    if (!text || text.length < 50) {
      throw new Error("PDF appears empty or unreadable. Try pasting your resume text instead.");
    }
    return text;
  } catch (err) {
    if (err.message.includes("empty")) throw err;
    throw new Error("Failed to parse PDF. Make sure it's a valid text-based PDF.");
  }
}