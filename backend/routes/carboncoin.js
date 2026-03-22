const express = require('express');
const router = express.Router();

// ── CO2 FACTORS PER TONNE OF WASTE ───────────────────
const CO2_FACTORS = {
  'Paddy straw (Parali)':   1.47,
  'Wheat stubble':           1.30,
  'Sugarcane bagasse':       0.90,
  'Cotton stalks':           1.20,
  'Maize cobs':              1.10,
  'default':                 1.20
};

// ── CARBON CREDIT RATES ───────────────────────────────
const CARBON_CREDIT_RATE = 3;      // ₹ per kg of CO2 saved
const COIN_TO_RUPEE_RATE = 1;      // 1 Carbon Coin = ₹1

// ── POST /api/carboncoin ──────────────────────────────
// Pure calculation — no AI needed
// Take stubble weight → multiply by CO2 factor → convert to coins
// Formula: CO2_saved_kg = waste_tonnes × CO2_factor × 1000
//          Carbon_coins  = CO2_saved_kg × COIN_RATE

router.post('/calculate', (req, res) => {
  try {
    const { wasteType, weightTonnes, action } = req.body;
    const weight = parseFloat(weightTonnes) || 0;

    if (weight <= 0) {
      return res.status(400).json({ error: 'Weight must be greater than 0' });
    }

    const co2Factor = CO2_FACTORS[wasteType] || CO2_FACTORS['default'];

    // ── BURNING SCENARIO (baseline) ──────────────────
    const co2EmittedIfBurned = weight * co2Factor * 1000;      // kg of CO2
    const particulatesIfBurned = weight * 3.2 * 1000;          // grams of PM2.5

    // ── COMPOSTING SCENARIO (action) ─────────────────
    const co2SavedByComposting = co2EmittedIfBurned * 0.85;    // 85% reduction
    const carbonCoinsEarned = co2SavedByComposting * COIN_TO_RUPEE_RATE;
    const rupeeValue = carbonCoinsEarned * COIN_TO_RUPEE_RATE;

    // ── MUSHROOM SCENARIO ─────────────────────────────
    const co2SavedByMushroom = co2EmittedIfBurned * 0.90;
    const coinsFromMushroom = co2SavedByMushroom * COIN_TO_RUPEE_RATE;

    // ── PELLETS SCENARIO ──────────────────────────────
    const co2SavedByPellets = co2EmittedIfBurned * 0.70;
    const coinsFromPellets = co2SavedByPellets * COIN_TO_RUPEE_RATE;

    res.json({
      success: true,
      input: { wasteType, weightTonnes: weight },

      burningScenario: {
        co2EmittedKg: Math.round(co2EmittedIfBurned),
        pm25Grams: Math.round(particulatesIfBurned),
        carbonCoins: 0,
        rupeeValue: 0,
        message: 'Burning creates pollution and earns nothing'
      },

      bestOptions: {
        composting: {
          co2SavedKg: Math.round(co2SavedByComposting),
          carbonCoins: Math.round(carbonCoinsEarned),
          rupeeValue: Math.round(rupeeValue),
          percentage: '85% CO2 reduction'
        },
        mushroom: {
          co2SavedKg: Math.round(co2SavedByMushroom),
          carbonCoins: Math.round(coinsFromMushroom),
          rupeeValue: Math.round(coinsFromMushroom),
          percentage: '90% CO2 reduction'
        },
        pellets: {
          co2SavedKg: Math.round(co2SavedByPellets),
          carbonCoins: Math.round(coinsFromPellets),
          rupeeValue: Math.round(coinsFromPellets),
          percentage: '70% CO2 reduction'
        }
      },

      recommendation: {
        bestOption: 'Mushroom Cultivation',
        totalEarning: Math.round(coinsFromMushroom),
        summary: `By composting ${weight} tonnes of ${wasteType} instead of burning, you save ${Math.round(co2SavedByComposting)} kg of CO2 and earn ₹${Math.round(rupeeValue)} in carbon credits`
      }
    });

  } catch (error) {
    console.error('Carbon coin error:', error.message);
    res.status(500).json({ error: 'Calculation failed', message: error.message });
  }
});

module.exports = router;
