const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { askAIWithImage } = require('../ai');

// ── MULTER SETUP ──────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads/')) fs.mkdirSync('uploads/');
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── POST /api/scan ────────────────────────────────────
// Called when farmer uploads crop photo for diagnosis
// Frontend sends: FormData { image, language }
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { language } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Read image as base64
    const base64Image = fs.readFileSync(req.file.path).toString('base64');

    const prompt = `You are an expert agricultural scientist and plant pathologist working in India.
    Carefully analyse this crop image and provide a complete diagnosis report:

    1. DISEASE/PEST NAME — Common name + Scientific name
    2. SEVERITY — Mild / Moderate / Severe / Critical
    3. CONFIDENCE — How sure you are in percentage
    4. WHAT YOU SEE — Exactly what symptoms in the image confirm your diagnosis
    5. CAUSE — What caused this (fungal/bacterial/pest/nutrient deficiency etc.)

    TREATMENT PLAN (3 clear steps):
    Step 1: Immediate action (today)
    Step 2: Medicine name + exact dose per acre + mixing instructions
    Step 3: Follow-up action after 7-10 days

    6. MEDICINE COST — Approximate cost per acre in rupees (Indian market)
    7. TIMELINE — Days to see improvement if treated correctly
    8. PREVENTION — One tip to prevent this next season
    9. KVK ADVICE — When to contact local Krishi Vigyan Kendra

    If the image is NOT a crop or plant, say clearly: "This does not appear to be a crop image."
    Be specific, practical, and helpful for an Indian farmer.`;

    const diagnosis = await askAIWithImage(prompt, base64Image, language || 'Hindi');

    // Delete uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      diagnosis,
      language: language || 'Hindi'
    });

  } catch (error) {
    // Clean up file if error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Scan error:', error.message);
    res.status(500).json({
      error: 'Scan failed',
      message: error.message
    });
  }
});

module.exports = router;