const express = require('express');
const router = express.Router();
const { askAI } = require('../ai');

router.post('/calculate', async (req, res) => {
  try {
    const { crop, acres, soilData, language } = req.body;

    const prompt = `Calculate exact inputs for ${crop} on ${acres} acres. Soil: ${JSON.stringify(soilData)}.
    Give shopping list with: Real price, Subsidized price, Money saved, Where to get from PMKSK.
    Include fertilizers, seeds, pesticides. Total cost with and without subsidy.`;

    const inputList = await askAI(prompt, language || 'Hindi');
    res.json({ success: true, inputList, orderId: 'CW' + Date.now() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/credit-score', async (req, res) => {
  try {
    const { farmerName, scanCount, chronicleFollowRate, pestResponseTime, seasonsCompleted, language } = req.body;

    const score = Math.min(100, Math.round(
      (scanCount * 5) + (chronicleFollowRate * 0.4) +
      (Math.max(0, 10 - pestResponseTime) * 3) + (seasonsCompleted * 10)
    ));

    const report = await askAI(
      `Write a formal bank report for farmer ${farmerName}. Score: ${score}/100. Scans: ${scanCount}. Chronicle rate: ${chronicleFollowRate}%. Pest response: ${pestResponseTime}hrs. Seasons: ${seasonsCompleted}. Certify farming practices and recommend KCC loan eligibility.`,
      'English'
    );

    res.json({ success: true, score, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
