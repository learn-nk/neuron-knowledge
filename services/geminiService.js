const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const askGemini = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const response = await axios.post(
    `${endpoint}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  return {
    answer: response.data.candidates[0].content.parts[0].text
  };
};

module.exports = { askGemini };