// backend/routes/parse-photo.js
const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const { OpenAI } = require("openai");
require("dotenv").config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Step 1: OCR - Extract text from image
    const {
      data: { text },
    } = await Tesseract.recognize(req.file.buffer, "eng", {
      logger: (m) => console.log(m), // optional for debugging
    });

    console.log("Extracted text from image:", text);

    // Step 2: Send to OpenAI for transaction extraction
    const prompt = `
You are a smart receipt parser. From the text below, extract a single transaction and return it ONLY in JSON format like this:
{
  "type": "income" or "expense",
  "amount": number,
  "description": "short description"
}

Do NOT include any explanation or extra text.

Text:
"""
${text}
"""
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const aiMessage = response.choices[0].message.content;
    console.log("AI Response:", aiMessage);

    // Extract JSON from AI response
    const jsonMatch = aiMessage.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response.");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (err) {
    console.error("Photo parsing error:", err.message);
    res.status(500).json({ error: "Failed to extract data from image" });
  }
});

module.exports = router;
