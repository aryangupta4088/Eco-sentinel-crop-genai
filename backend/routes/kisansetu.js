const express = require('express');
const router = express.Router();
const { askAI } = require('../ai');

const workers = [
  { id: 1, name: 'Ramesh Kumar', skills: ['wheat harvesting', 'paddy transplanting'], district: 'Ghaziabad', rating: 4.8, dailyRate: 600 },
  { id: 2, name: 'Suresh Yadav', skills: ['drone spraying', 'cotton picking'], district: 'Ghaziabad', rating: 4.5, dailyRate: 800 },
  { id: 3, name: 'Mohan Singh', skills: ['tractor operation', 'irrigation setup'], district: 'Meerut', rating: 4.9, dailyRate: 1000 },
  { id: 4, name: 'Priya Devi', skills: ['vegetable harvesting', 'grading'], district: 'Ghaziabad', rating: 4.7, dailyRate: 500 },
];

router.post('/find', async (req, res) => {
  try {
    const { task, crop, days, district, language } = req.body;

    const matched = workers.filter(w =>
      w.district === district &&
      w.skills.some(s => s.includes(task.toLowerCase()) || s.includes(crop.toLowerCase()))
    );

    const recommendation = await askAI(
      `Farmer needs ${task} for ${crop} for ${days} days in ${district}. Available workers: ${JSON.stringify(matched.length > 0 ? matched : workers.slice(0, 3))}. Recommend best workers, total cost, and what to check when they arrive.`,
      language || 'Hindi'
    );

    res.json({ success: true, workers: matched.length > 0 ? matched : workers.slice(0, 3), recommendation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
