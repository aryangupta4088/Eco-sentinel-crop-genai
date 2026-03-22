// routes/climate.js
// Powers Grow Smart — Climate Crop Swap + Booklet generation
// Frontend calls:
//   GET  /api/climate/swap          → crop swap recommendation
//   POST /api/chronicles/booklet    → generate full crop booklet
// Uncomment AI lines at end for integration

const express = require('express');
const router = express.Router();
// const { askAI } = require('../ai');

// ── GET /api/climate/swap ──
router.get('/swap', async (req, res) => {
  try {
    const swapData = {
      district: 'Azamgarh',
      alert: 'Drought Warning',
      rainfallDrop: 22,
      currentCrop: {
        name: 'Wheat',
        waterNeeded: 'High (4-6 irrigations)',
        climateRisk: 'High',
        inputCost: 12000,
        estimatedProfit: 38000
      },
      suggestedCrop: {
        name: 'Barley',
        variety: 'RD-2552',
        waterNeeded: 'Low (1-2 irrigations)',
        climateRisk: 'Low',
        inputCost: 9500,
        estimatedProfit: 44200,
        waterSaving: 40,
        profitIncrease: 18
      },
      switchSteps: [
        'Stop wheat irrigation immediately to save water costs',
        'Source RD-2552 Barley seeds from nearest IFFCO outlet',
        'Sow within next 8 days for optimal season alignment'
      ]
    };

    // ── AI INTEGRATION (uncomment at end) ──
    // const advice = await askAI(
    //   `District: Azamgarh UP. Rainfall dropped 22%. Current crop: Wheat. Suggest best alternative crop with profit comparison and 3 switch steps.`,
    //   'Hindi'
    // );
    // swapData.aiAdvice = advice;

    return res.status(200).json({ success: true, ...swapData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load climate data' });
  }
});

module.exports = router;