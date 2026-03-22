const express = require('express');
const router = express.Router();
const { askAI } = require('../ai');

let listings = [];

router.post('/list', (req, res) => {
  const listing = { ...req.body, id: Date.now(), status: 'available' };
  listings.push(listing);
  res.json({ success: true, listingId: listing.id });
});

router.get('/listings', (req, res) => res.json({ listings }));

router.post('/generate-agreement', async (req, res) => {
  try {
    const { ownerName, farmerName, acres, district, crop, rentAmount, duration, language } = req.body;

    const agreement = await askAI(
      `Generate legally-sound land lease agreement. Owner: ${ownerName}, Farmer: ${farmerName}, ${acres} acres in ${district}, Crop: ${crop}, Rent: ₹${rentAmount}/season, Duration: ${duration}. Include tenant protection, owner rights, payment schedule, dispute resolution. Date: ${new Date().toLocaleDateString('en-IN')}`,
      language || 'Hindi'
    );

    res.json({ success: true, agreement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/fair-rent', async (req, res) => {
  try {
    const { acres, district, soilType, waterAccess, crop, language } = req.body;

    const rentAnalysis = await askAI(
      `Calculate fair land rent for ${acres} acres in ${district}. Soil: ${soilType}, Water: ${waterAccess}, Crop: ${crop}. Give rent range, crop-share split option, current going rate, and weather failure clause.`,
      language || 'Hindi'
    );

    res.json({ success: true, rentAnalysis });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
