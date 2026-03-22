const express = require('express');
const router = express.Router();
const { askAI } = require('../ai');

// ── POST /api/agritrend/feed ──────────────────────────
// Called when farmer clicks "Get My Feed" button
// Sends: { crop, state, acres, language }
router.post('/feed', async (req, res) => {
  try {
    const { crop, state, acres, language } = req.body;

    if (!crop || !state) {
      return res.status(400).json({ error: 'crop and state are required' });
    }

    const prompt = `Generate 5 latest agri-tech updates for a farmer with these details:
    - Crop: ${crop}
    - State: ${state}
    - Farm Size: ${acres || '5'} acres

    For each update give:
    1. Technology or scheme name (bold heading)
    2. What it is in 2 simple sentences
    3. Exact rupee benefit for ${acres || '5'} acres farm
    4. How to get it or apply (1 step)

    Topics to cover (pick most relevant for ${crop} in ${state}):
    - Nano-DAP or Nano Urea updates
    - Drone spraying subsidies
    - New seed varieties for ${crop}
    - Solar irrigation PM-KUSUM scheme
    - MSP updates or export opportunities

    Keep it practical, specific, and exciting for the farmer.`;

    const feed = await askAI(prompt, language || 'Hindi');

    res.json({
      success: true,
      feed,
      crop,
      state,
      acres,
      language: language || 'Hindi'
    });

  } catch (error) {
    console.error('AgriTrend feed error:', error.message);
    res.status(500).json({
      error: 'Feed generation failed',
      message: error.message
    });
  }
});

// ── POST /api/agritrend/quick-byte ───────────────────
// Called when farmer clicks "Quick Byte" on any card
// Sends: { technology, crop, acres, language }
router.post('/quick-byte', async (req, res) => {
  try {
    const { technology, crop, acres, language } = req.body;

    if (!technology) {
      return res.status(400).json({ error: 'technology is required' });
    }

    const prompt = `Explain "${technology}" to a farmer growing ${crop || 'crops'} on ${acres || '5'} acres.

    Reply in EXACTLY 3 sentences:
    Sentence 1: What is ${technology} in the simplest possible words (use a farming metaphor).
    Sentence 2: Exact rupee benefit or saving for a ${acres || '5'} acre farm.
    Sentence 3: One specific action the farmer can take THIS WEEK to use or apply for it.

    Be direct, specific, and practical. No extra text.`;

    const quickByte = await askAI(prompt, language || 'Hindi');

    res.json({
      success: true,
      quickByte,
      technology,
      language: language || 'Hindi'
    });

  } catch (error) {
    console.error('QuickByte error:', error.message);
    res.status(500).json({
      error: 'QuickByte generation failed',
      message: error.message
    });
  }
});

module.exports = router;