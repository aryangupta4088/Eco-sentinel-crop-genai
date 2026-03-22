// routes/soil.js
// Powers Grow Smart — Soil Vitals section + RLHF feedback
// Frontend calls:
//   GET  /api/soil/current    → live NPK + pH readings
//   POST /api/soil/feedback   → RLHF feedback from farmer
// Uncomment AI lines at the end for integration

const express = require('express');
const router = express.Router();
// const { askAI } = require('../ai');

// ── GET /api/soil/current ──
router.get('/current', async (req, res) => {
  try {
    // Replace with real IoT sensor data when available
    const soilData = {
      nitrogen:   68,
      phosphorus: 82,
      potassium:  91,
      pH:         5.2,
      moisture:   42,
      temperature: 28,
      lastUpdated: new Date().toISOString(),
      advice: 'Your soil nitrogen is <span class="text-tertiary font-bold">30% below optimal</span>. Add 2kg urea per acre before Thursday. Your soil is like chai that is too bitter — add lime at 25kg per acre this weekend to sweeten it.',
      status: {
        nitrogen:   'low',
        phosphorus: 'good',
        potassium:  'good',
        pH:         'acidic'
      }
    };

    // ── AI INTEGRATION (uncomment at end) ──
    // const advice = await askAI(
    //   `My soil data: Nitrogen ${soilData.nitrogen}%, Phosphorus ${soilData.phosphorus}%, Potassium ${soilData.potassium}%, pH ${soilData.pH}. Give 2 specific actions in simple language.`,
    //   'Hindi'
    // );
    // soilData.advice = advice;

    return res.status(200).json({ success: true, ...soilData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load soil data' });
  }
});

// ── POST /api/soil/feedback ──
// RLHF — farmer feedback on AI recommendations
router.post('/feedback', async (req, res) => {
  try {
    const { feedback, detail, recommendation } = req.body;
    console.log(`RLHF Feedback: ${feedback} for "${recommendation}" — ${detail || 'no detail'}`);
    return res.status(200).json({
      success: true,
      message: 'Feedback recorded. Thank you for improving Krishi AI!',
      farmersHelped: 1240
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save feedback' });
  }
});

module.exports = router;

// ─────────────────────────────────────────────────────────────────────────────

// routes/climate.js
// Powers Grow Smart — Climate-Resilient Crop Swap section
// Frontend calls: GET /api/climate/swap → crop swap recommendation

// NOTE: This file exports only the climate router
// To use both soil and climate, Member 3 should keep them as separate files
// and register both in server.js (already done)