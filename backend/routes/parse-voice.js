// backend/routes/parse-voice.js
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { text } = req.body;

  const prompt = `
You are an intelligent receipt parser. Extract a transaction from the sentence below and respond ONLY with JSON.
Do NOT include any explanation, markdown, or extra text.

Sentence: "${text}"

Return JSON in this format:
{
  "type": "income" or "expense",
  "amount": number,
  "description": "short description"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // use "gpt-3.5-turbo" if not on GPT-4 plan
      messages: [{ role: "user", content: prompt }],
    });

    const aiMessage = response.choices[0].message.content;
    console.log("AI Response:", aiMessage); // Debug output

    const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Raw AI response:", aiMessage);
      throw new Error("No valid JSON found in AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    res.json(parsed);
  } catch (err) {
    console.error("Failed to parse voice input:", err.message);
    res.status(500).json({ error: "Failed to parse voice input" });
  }
});

module.exports = router;
