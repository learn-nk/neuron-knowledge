
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/openai', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: question }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      answer: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'OpenAI failed', 
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

module.exports = router;