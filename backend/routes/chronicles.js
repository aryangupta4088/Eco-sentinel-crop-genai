// routes/chronicles.js
// Powers Crop Tracker page
// Frontend calls:
//   GET  /api/chronicles/crop/:cropKey   → crop detail data
//   POST /api/chronicles/checkup         → save weekly photo + AI analysis
//   POST /api/chronicles/claim           → generate insurance claim
// Uncomment AI lines at the end when doing AI integration

const express = require('express');
const router = express.Router();
// const { askAI, askAIWithImage } = require('../ai');

const CROP_DATA = {
  wheat: {
    name: 'Wheat', variety: 'HD-2967', field: 'Field A', acres: 3,
    status: 'Healthy', stage: 'Flowering', progress: 68,
    weekCount: 8, harvest: '15 Apr 2026',
    aiInsight: 'Early yellowing spotted — possible nitrogen deficiency. Apply urea 2kg/acre before Thursday.',
  },
  mustard: {
    name: 'Mustard', variety: 'Pusa Bold', field: 'Field B', acres: 2,
    status: 'Watch', stage: 'Maturity', progress: 89,
    weekCount: 12, harvest: '10 Mar 2026',
    aiInsight: 'Mustard at 89% maturity. Harvest in 12-15 days. Stop irrigation now to prevent pod shattering.',
  },
  potato: {
    name: 'Potato', variety: 'Kufri Jyoti', field: 'Field C', acres: 1,
    status: 'Critical', stage: 'Vegetative', progress: 45,
    weekCount: 6, harvest: '28 Feb 2026',
    aiInsight: 'Late blight confirmed. Apply Mancozeb 75% WP at 2.5g/litre IMMEDIATELY. Do not delay.',
  }
};

// ── GET /api/chronicles/crop/:cropKey ──
router.get('/crop/:cropKey', async (req, res) => {
  try {
    const { cropKey } = req.params;
    const crop = CROP_DATA[cropKey];
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    return res.status(200).json({ success: true, ...crop });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load crop data' });
  }
});

// ── POST /api/chronicles/checkup ──
// Body: { cropKey, image (base64), weekNumber }
router.post('/checkup', async (req, res) => {
  try {
    const { cropKey, image, weekNumber } = req.body;
    if (!cropKey) return res.status(400).json({ success: false, message: 'Crop key required' });

    let analysis = `Weekly checkup for ${cropKey} completed. No major changes detected from last week.`;

    // ── AI INTEGRATION (uncomment at end) ──
    // if (image) {
    //   analysis = await askAIWithImage(
    //     `Analyse this ${cropKey} crop photo. Compare with typical ${CROP_DATA[cropKey]?.stage} stage. Report any disease, pest or nutrient issues.`,
    //     image, 'Hindi'
    //   );
    // }

    return res.status(200).json({
      success: true,
      analysis,
      weekNumber: weekNumber || 1,
      timestamp: new Date().toISOString(),
      claimReady: true
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Checkup failed' });
  }
});

// ── POST /api/chronicles/claim ──
// Body: { crop, weeks, field }
router.post('/claim', async (req, res) => {
  try {
    const { crop, weeks, field } = req.body;
    const claimId = `PMFBY-2026-${Math.floor(Math.random() * 90000 + 10000)}`;
    return res.status(200).json({
      success: true,
      claimId,
      crop, weeks, field,
      message: `Insurance claim ${claimId} generated successfully`,
      submittedTo: 'PMFBY Portal',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Claim generation failed' });
  }
});

module.exports = router;