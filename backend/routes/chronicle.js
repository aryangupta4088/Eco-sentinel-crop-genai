// routes/chronicle.js
const express = require('express');
const router = express.Router();
// const { askAI, askAIWithImage } = require('../ai');

// ── POST /api/chronicle/booklet ──
router.post('/booklet', async (req, res) => {
  try {
    const { crop, language = 'Hindi' } = req.body;
    if (!crop) return res.status(400).json({ success: false, message: 'Crop name required' });

    let bookletContent = `Complete 110-day farming roadmap for ${crop}. Includes daily care instructions, fertiliser schedule, pest monitoring calendar and harvest guide.`;

    // ── AI INTEGRATION (uncomment at end) ──
    // bookletContent = await askAI(
    //   `Generate a complete day-by-day farming booklet for: ${crop}. Include Day 1, Day 15, Day 30, Day 60, Day 90, Day 110 milestones with specific actions, quantities and timings.`,
    //   language
    // );

    return res.status(200).json({
      success: true,
      crop,
      bookletContent,
      pages: 12,
      downloadUrl: `/api/chronicle/booklet/download/${encodeURIComponent(crop)}`,
      message: `Booklet generated for ${crop}`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Booklet generation failed' });
  }
});

module.exports = router;