const express = require('express');
const router = express.Router();
const { askAI } = require('../ai');

// ── POST /api/subsidy/check ───────────────────────────
// Called when farmer clicks "Check My Eligibility"
// Frontend sends: { farmerName, landAcres, state, income, language }
router.post('/check', async (req, res) => {
  try {
    const { farmerName, landAcres, state, income, language } = req.body;

    if (!farmerName || !landAcres || !state) {
      return res.status(400).json({ error: 'farmerName, landAcres and state are required' });
    }

    const prompt = `Check government scheme eligibility for this farmer and give a detailed report:

    Farmer Details:
    - Name: ${farmerName}
    - State: ${state}
    - Land: ${landAcres} acres
    - Annual Income: ₹${income || 'Not provided'}

    Check eligibility for ALL these schemes and for each give:
    ✅ or ❌ Eligible YES/NO
    💰 Exact benefit amount
    📋 Documents needed (max 3)
    🚀 3 clear steps to apply right now

    Schemes to check:
    1. PM-KISAN Samman Nidhi (₹6000/year)
    2. PMFBY Crop Insurance (₹40,000/acre coverage)
    3. PM-KUSUM Solar Pump (60% subsidy)
    4. Kisan Credit Card — KCC (4% interest, up to ₹3 lakh)
    5. Soil Health Card Scheme (free soil testing)

    End with: TOP PRIORITY scheme this farmer should apply for FIRST and why.`;

    const schemes = await askAI(prompt, language || 'Hindi');

    res.json({
      success: true,
      schemes,
      farmerName,
      state,
      landAcres,
      language: language || 'Hindi'
    });

  } catch (error) {
    console.error('Subsidy check error:', error.message);
    res.status(500).json({
      error: 'Eligibility check failed',
      message: error.message
    });
  }
});

// ── POST /api/subsidy/disaster ────────────────────────
// Called when farmer clicks "Get Weather Alert"
// Frontend sends: { crop, stage, district, language }
router.post('/disaster', async (req, res) => {
  try {
    const { crop, stage, district, language } = req.body;

    if (!crop || !district) {
      return res.status(400).json({ error: 'crop and district are required' });
    }

    // Fetch real 7-day weather from Open-Meteo (free, no API key needed)
    let weatherData = null;
    try {
      const axios = require('axios');

      // Get coordinates for the district using a simple lookup
      // Default to central India coordinates if not found
      const coordsMap = {
        'delhi': { lat: 28.6, lon: 77.2 },
        'punjab': { lat: 31.1, lon: 75.3 },
        'haryana': { lat: 29.0, lon: 76.0 },
        'up': { lat: 26.8, lon: 80.9 },
        'maharashtra': { lat: 19.7, lon: 75.7 },
        'gujarat': { lat: 22.2, lon: 71.6 },
        'rajasthan': { lat: 27.0, lon: 74.2 },
        'mp': { lat: 23.4, lon: 77.7 },
        'bihar': { lat: 25.0, lon: 85.3 },
        'west bengal': { lat: 22.9, lon: 87.8 }
      };

      const key = district.toLowerCase();
      const coords = Object.entries(coordsMap).find(([k]) => key.includes(k));
      const lat = coords ? coords[1].lat : 22.5;
      const lon = coords ? coords[1].lon : 78.5;

      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min,windspeed_10m_max&timezone=Asia/Kolkata&forecast_days=7`,
        { timeout: 5000 }
      );
      weatherData = weatherRes.data.daily;
    } catch (weatherErr) {
      console.log('Weather API failed, using general forecast:', weatherErr.message);
    }

    const weatherContext = weatherData
      ? `7-day weather forecast for ${district}:
         Dates: ${weatherData.time?.join(', ')}
         Max Temp (°C): ${weatherData.temperature_2m_max?.join(', ')}
         Min Temp (°C): ${weatherData.temperature_2m_min?.join(', ')}
         Rainfall (mm): ${weatherData.precipitation_sum?.join(', ')}
         Max Wind (km/h): ${weatherData.windspeed_10m_max?.join(', ')}`
      : `No live weather data available. Give general seasonal advice for ${district}.`;

    const prompt = `You are an agricultural weather expert. Analyze this for a farmer:

    Farmer's Details:
    - Crop: ${crop}
    - Growth Stage: ${stage || 'Growing'}
    - Location: ${district}

    ${weatherContext}

    Give a detailed weather impact report with:

    🌡️ WEATHER IMPACT ON ${crop.toUpperCase()}
    - How will this specific weather affect ${crop} at ${stage || 'growing'} stage?
    - Risk level: Low / Medium / High / Critical

    ⚡ NEXT 24 HOURS — Urgent Actions
    - What must the farmer do TODAY?

    📅 NEXT 7 DAYS — Action Plan
    - Day by day guidance (group similar days)

    🛡️ INSURANCE CLAIM GUIDE
    - If crop damage occurs, exact steps to claim PMFBY insurance
    - Documents needed for claim
    - Helpline number to call

    💡 ONE PRO TIP to protect the crop right now`;

    const alert = await askAI(prompt, language || 'Hindi');

    res.json({
      success: true,
      alert,
      crop,
      stage,
      district,
      weather: weatherData,
      language: language || 'Hindi'
    });

  } catch (error) {
    console.error('Disaster alert error:', error.message);
    res.status(500).json({
      error: 'Weather alert failed',
      message: error.message
    });
  }
});

module.exports = router;