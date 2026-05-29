import express from "express";
import upload from "../middleware/upload.js";
import { extractTextFromPdf } from "../utils/parsePdf.js";
import { getReview } from "../utils/groqClient.js";

const router = express.Router();

router.post("/review", upload.single("resume"), async (req, res) => {
  try {
    let resumeText = "";

    if (req.file) {
      resumeText = await extractTextFromPdf(req.file.buffer);
    } else if (req.body.text?.trim()) {
      resumeText = req.body.text.trim();
    } else {
      return res.status(400).json({ error: "Please upload a PDF or paste your resume text." });
    }

    if (resumeText.length < 100) {
      return res.status(400).json({ error: "Resume is too short. Please provide more content." });
    }

    if (resumeText.length > 15000) {
      resumeText = resumeText.substring(0, 15000);
    }

    const mode = req.body.mode === "roast" ? "roast" : "professional";
    const review = await getReview(resumeText, mode);

    res.json({ success: true, mode, review });

  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({ error: err.message || "Review failed. Please try again." });
  }
});

export default router;