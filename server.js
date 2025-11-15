require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const multer = require('multer');

const askRoute = require('./routes/ask');
const speakRoute = require('./routes/speak');
const voiceRoute = require('./routes/voice');

const app = express();

// CORS setup
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: false
}));

app.use(bodyParser.json());

// Multer setup
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = [
      "audio/wav", "audio/mpeg", "audio/mp3", "audio/mp4",
      "audio/x-m4a", "audio/webm", "audio/ogg", "audio/flac", "audio/mpga"
    ];
    if (ok.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Unsupported audio type"));
  }
});

// Existing routes
app.use('/api/ask', askRoute);
app.use('/api/speak', speakRoute);
app.use('/api/voice', voiceRoute);

// Transcription route
app.post("/transcribe/upload", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), req.file.originalname || "audio.wav");
    form.append("model", "whisper-1");
    
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, 
        ...form.getHeaders() 
      },
      body: form
    });
    
    const data = await r.json();
    
    if (!r.ok) {
      throw new Error(data.error?.message || "Transcription failed");
    }
    
    res.json(data);
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: err.message || "Transcription failed" });
  } finally {
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
  }
});

// Error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large (max 20MB)" });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.message === "Unsupported audio type") {
    return res.status(415).json({ error: "Unsupported audio format" });
  }
  next(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Neuron backend is running on port ${PORT}`);
});