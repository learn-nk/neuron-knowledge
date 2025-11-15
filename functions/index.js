// ✅ Neuron Knowledge Gemini + NEON Agent API (v2 safe version)
const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const GEMINI_KEY = defineSecret("GEMINI_KEY");

const app = express();
app.use(cors({origin:true}));
app.use(express.json());

// 🧠 Gemini Function (Text Generation)
app.post("/agent", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Hello Gemini!";
    const key = GEMINI_KEY.value();
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + key;

    const response = await fetch(url, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        contents:[{parts:[{text:prompt}]}],
      }),
    });

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from Gemini.";

    res.status(200).json({reply});
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    res.status(500).json({reply:"Error calling Gemini API"});
  }
});

// ✅ Export as Firebase Function (with secret reference)
exports.api = onRequest({secrets:[GEMINI_KEY]}, app);
