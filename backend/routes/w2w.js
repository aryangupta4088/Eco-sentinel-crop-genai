const express = require('express');
const router = express.Router();
const { askAI } = require('../ai');

// ── INCOME CALCULATOR ─────────────────────────────────
function calculateIncome(wasteType, quantity) {
  const rates = {
    'Paddy straw (Parali)': {
      bioEnergy: 3800, mushroom: 8200, vermicompost: 4500
    },
    'Wheat stubble': {
      bioEnergy: 3200, paper: 5500, fodder: 2800
    },
    'Sugarcane bagasse': {
      bioethanol: 6000, packaging: 7200, cogeneration: 4000
    },
    'Cotton stalks': {
      particleboard: 2500, biochar: 3800, briquettes: 2200
    },
    'Maize cobs': {
      furfural: 12000, activatedCarbon: 8500, mushroom: 5000
    }
  };

  const rate = rates[wasteType] || rates['Paddy straw (Parali)'];
  return {
    option1: { name: 'Bio-energy / Pellets', incomePerTonne: rate.bioEnergy, totalIncome: rate.bioEnergy * quantity },
    option2: { name: 'Mushroom Cultivation', incomePerTonne: rate.mushroom, totalIncome: rate.mushroom * quantity },
    option3: { name: 'Vermicompost / Biochar', incomePerTonne: rate.vermicompost, totalIncome: rate.vermicompost * quantity }
  };
}

// ── POST /api/w2w ──────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { wasteType, quantity, district, language } = req.body;

    const income = calculateIncome(wasteType, parseFloat(quantity));

    const prompt = `A farmer in ${district} has ${quantity} tonnes of ${wasteType} after harvest.
    
    Pre-calculated income estimates:
    - Bio-energy pellets: ₹${income.option1.totalIncome.toLocaleString()} total
    - Mushroom cultivation: ₹${income.option2.totalIncome.toLocaleString()} total  
    - Vermicompost/Biochar: ₹${income.option3.totalIncome.toLocaleString()} total

    Rank these 3 options and for each provide:
    1. Step-by-step setup process (3 steps)
    2. Equipment or materials needed with approximate cost
    3. Nearest buyer type in ${district} area
    4. Time to first income
    5. Effort level: Low / Medium / High
    
    Also calculate:
    - Carbon Coin earning if composted instead of burned
    - Government scheme available for this waste management
    
    End with: The BEST option for this specific farmer and why.`;

    const recommendations = await askAI(prompt, language || 'Hindi');

    res.json({
      success: true,
      income,
      recommendations,
      wasteType,
      quantity,
      language: language || 'Hindi'
    });

  } catch (error) {
    console.error('W2W error:', error.message);
    res.status(500).json({ error: 'W2W calculation failed', message: error.message });
  }
});

module.exports = router;
