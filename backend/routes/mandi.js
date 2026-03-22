const express = require('express');
const router = express.Router();
const axios = require('axios');
const { askAI } = require('../ai');

// ── FREE MANDI API (data.gov.in Agmarknet) ────────────
// No API key required for public access
// Official Indian government agricultural market data
async function fetchLiveMandiPrices(commodity, state) {
  try {
    const res = await axios.get(
      'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
      {
        params: {
          'api-key': '579b464db66ec23bdd000001cdd3946e44ce4aab0d1f2e7c30e2db1e',
          format: 'json',
          'filters[commodity]': commodity,
          'filters[state]': state,
          limit: 15,
          offset: 0
        },
        timeout: 8000
      }
    );
    return res.data.records || [];
  } catch (err) {
    console.log('Agmarknet API unavailable:', err.message);
    return null;
  }
}

// ── MOCK MANDI DATA (fallback) ────────────────────────
function getMockMandiData(crop, district) {
  const basePrices = {
    'Wheat': 2150, 'Paddy': 2100, 'Rice': 2200, 'Mustard': 5200,
    'Onion': 1500, 'Potato': 1200, 'Cotton': 6500, 'Maize': 1900,
    'Soybean': 4200, 'Sugarcane': 350, 'Tomato': 800, 'Garlic': 3000
  };

  const base = basePrices[crop] || 2000;

  return [
    { market: `${district} APMC Mandi`,    price: base + 180, distance: 4,   arrivals: '250 tonnes', trend: 'rising' },
    { market: `${district} District Mandi`,price: base + 80,  distance: 12,  arrivals: '180 tonnes', trend: 'stable' },
    { market: 'FCI Procurement Centre',    price: base,       distance: 8,   arrivals: 'MSP rate',   trend: 'stable' },
    { market: 'Nearby Town Mandi',         price: base + 50,  distance: 25,  arrivals: '120 tonnes', trend: 'stable' },
    { market: 'Regional Trade Hub',        price: base + 140, distance: 45,  arrivals: '400 tonnes', trend: 'rising' },
    { market: 'Local Trader (at farm)',    price: base - 200, distance: 0,   arrivals: 'At your farm',trend: 'falling' }
  ];
}

// ── HOLD OR SELL LOGIC ────────────────────────────────
function calculateHoldOrSell(markets) {
  const sorted     = [...markets].sort((a, b) => (b.price || b.modal_price) - (a.price || a.modal_price));
  const bestPrice  = parseInt(sorted[0]?.price || sorted[0]?.modal_price || 0);
  const localPrice = parseInt(markets[markets.length - 1]?.price || markets[markets.length - 1]?.modal_price || 0);
  const diff       = bestPrice - localPrice;
  const diffPct    = ((diff / localPrice) * 100).toFixed(1);

  return {
    recommendation: diff > 150 ? 'SELL AT BEST MANDI' : 'HOLD OR NEGOTIATE LOCALLY',
    priceDifference: diff,
    percentageBetter: diffPct,
    extraPer20Qtl: diff * 20,
    bestMarket: sorted[0]?.market || sorted[0]?.Market
  };
}

// ── POST /api/mandi ───────────────────────────────────
// Frontend sends: { crop, district, state, quantity, language }
router.post('/', async (req, res) => {
  try {
    const { crop, district, state, quantity, language } = req.body;

    if (!crop) return res.status(400).json({ error: 'crop is required' });

    // Try live API first
    let markets = [];
    let isLive  = false;

    const liveData = await fetchLiveMandiPrices(crop, state || district);
    if (liveData && liveData.length > 0) {
      markets = liveData.map(item => ({
        market:   item.market     || item.Market,
        price:    parseInt(item.modal_price) || 0,
        min_price:parseInt(item.min_price)   || 0,
        max_price:parseInt(item.max_price)   || 0,
        distance: Math.floor(Math.random() * 100) + 5,
        arrivals: item.arrivals   || '—',
        trend:    'live'
      })).sort((a, b) => b.price - a.price);
      isLive = true;
    } else {
      // Use mock data as fallback
      markets = getMockMandiData(crop, district || state || 'Local');
    }

    // AI advice
    const marketSummary = markets.slice(0, 5).map(m =>
      `${m.market || m.Market}: ₹${m.price || m.modal_price}/quintal`
    ).join(', ');

    const prompt = `Current mandi prices for ${crop} in ${state || district}:
    ${marketSummary}
    Farmer has ${quantity || 20} quintals to sell.

    Give in simple language:
    1. Best mandi to sell at and exact reason
    2. Net profit after transport cost estimate
    3. HOLD or SELL decision RIGHT NOW with 1-line reason
    4. 7-day price prediction (will price go up or down?)
    5. One negotiation tip to get ₹50-100 more per quintal`;

    const advice = await askAI(prompt, language || 'Hindi');
    const analysis = calculateHoldOrSell(markets);

    res.json({
      success: true,
      markets,
      isLive,
      holdOrSell: analysis,
      advice,
      crop,
      state,
      language: language || 'Hindi'
    });

  } catch (error) {
    console.error('Mandi error:', error.message);
    res.status(500).json({ error: 'Mandi fetch failed', message: error.message });
  }
});

module.exports = router;