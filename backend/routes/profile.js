// routes/profile.js
// Powers My Profile & Trust page
// Frontend calls:
//   GET  /api/profile/farmer         → full farmer profile + score + badges + timeline
//   GET  /api/profile/score          → just the trust score breakdown
//   POST /api/profile/report         → generate AI bank credit report
//   POST /api/profile/report/send    → send report to bank portal
//   POST /api/profile/download-id    → generate downloadable Kisan ID card
// Add to server.js: app.use('/api/profile', require('./routes/profile'));

const express = require('express');
const router = express.Router();
// const { askAI } = require('../ai');

// ── FARMER PROFILE DATA ──
const FARMER_PROFILE = {
  id: 'farmer_001',
  name: 'Ramesh Kumar Singh',
  kisanId: 'KP-2026-UP-AZM-00847',
  village: 'Khanpur',
  district: 'Azamgarh',
  state: 'Uttar Pradesh',
  acres: 6.2,
  memberSince: 'March 2024',
  crops: ['Wheat', 'Mustard', 'Potato'],
  carbonCoins: 1271,
  aadhaarLinked: true,
  digilockerLinked: true,
};

// ── TRUST SCORE DATA ──
const TRUST_SCORE = {
  total: 847,
  max: 1000,
  label: 'Excellent',
  components: [
    { label: 'Advisory Compliance',    value: 95,  status: 'excellent', detail: 'Followed 19 out of 20 Krishi AI recommendations' },
    { label: 'Weekly Checkups',        value: 88,  status: 'good',      detail: 'Completed 14 out of 16 weekly photo checkups' },
    { label: 'Scheme Compliance',      value: 92,  status: 'excellent', detail: 'PM-KISAN registered, PMFBY enrolled' },
    { label: 'Sustainable Practices',  value: 78,  status: 'good',      detail: 'Stopped stubble burning, drip irrigation installed' },
    { label: 'Repayment History',      value: 100, status: 'perfect',   detail: '2 previous Kisan Credit Card loans repaid on time' },
  ],
  lastUpdated: 'November 12, 2025',
  algorithm: 'Sentinel Risk Algorithm v4.2',
  creditRecommendation: 240000,
  partnerBanks: ['SBI', 'PNB', 'Bank of Baroda', 'NABARD', 'Canara Bank', 'Union Bank']
};

// ── BADGES DATA ──
const BADGES = [
  { id: 'early_adopter',    name: 'Early Adopter',    icon: 'rocket_launch',          status: 'verified',  earnedOn: 'March 2024' },
  { id: 'disease_fighter',  name: 'Disease Fighter',  icon: 'health_and_safety',      status: 'verified',  earnedOn: 'February 2025' },
  { id: 'zero_burn',        name: 'Zero Burn Hero',   icon: 'eco',                    status: 'verified',  earnedOn: 'August 2025' },
  { id: 'carbon_champion',  name: 'Carbon Champion',  icon: 'compost',                status: 'progress',  progress: 847, target: 1000 },
  { id: 'drone_pioneer',    name: 'Drone Pioneer',    icon: 'precision_manufacturing', status: 'locked',   requirement: 'Complete 5 drone spray sessions' },
  { id: 'land_lord',        name: 'Land Lord',        icon: 'landscape',              status: 'locked',   requirement: 'Lease land via Bhu-Sanjal' },
];

// ── TIMELINE DATA ──
const TIMELINE = [
  { date: 'Nov 2025', label: 'Current Status', title: 'Maximum Trust Achieved',
    description: 'Achieved top 2% trust score in Azamgarh district. Carbon credit program eligibility unlocked.', income: null },
  { date: 'Aug 2025', label: 'Governance', title: 'Zero Stubble Burning Verified',
    description: 'Satellite validation confirmed 100% soil-mix strategy. Bonus trust points (+45) added.', income: '₹840 carbon coins earned' },
  { date: 'Jan 2025', label: 'Finance', title: 'First Collateral-Free Loan Approved',
    description: 'Trust Score crossed 800. SBI approved ₹1,20,000 KCC without any land collateral.', income: '₹1,20,000 credit approved' },
  { date: 'Feb 2025', label: 'Crisis Alert', title: 'Yellow Rust Detection',
    description: 'Identified wheat fungus early via AI scan. Rescue Advisory saved 92% of yield.', income: '₹28,000 loss avoided' },
  { date: 'Mar 2024', label: 'Genesis', title: 'Joined Eco Sentinel',
    description: 'Initial profile verification and soil mapping completed for 6.2 acres.', income: null },
];

// ── GET /api/profile/farmer ──
// Returns complete farmer profile
router.get('/farmer', async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      farmer: FARMER_PROFILE,
      trustScore: TRUST_SCORE,
      badges: BADGES,
      timeline: TIMELINE,
      earnedBadges: BADGES.filter(b => b.status === 'verified').length,
      totalBadges: BADGES.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load profile' });
  }
});

// ── GET /api/profile/score ──
// Returns just the trust score
router.get('/score', async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      ...TRUST_SCORE
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load score' });
  }
});

// ── POST /api/profile/report ──
// Generates AI bank credit assessment report
// Body: { language }
router.post('/report', async (req, res) => {
  try {
    const { language = 'English' } = req.body;

    const prompt = `Generate a formal bank credit assessment report for farmer ${FARMER_PROFILE.name}.
    Kisan ID: ${FARMER_PROFILE.kisanId}
    Advisory compliance: ${TRUST_SCORE.components[0].value}%
    Trust score: ${TRUST_SCORE.total}/1000
    Land: ${FARMER_PROFILE.acres} acres in ${FARMER_PROFILE.district}
    Crops: ${FARMER_PROFILE.crops.join(', ')}
    Repayment history: ${TRUST_SCORE.components[4].value}%
    Sustainable practices: ${TRUST_SCORE.components[3].value}%
    Member since: ${FARMER_PROFILE.memberSince}
    Write a 3-paragraph formal bank report recommending collateral-free KCC loan.`;

    let reportText = `CREDIT ASSESSMENT REPORT — Eco Sentinel Platform\n\nFarmer: ${FARMER_PROFILE.name} | ID: ${FARMER_PROFILE.kisanId}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nThis farmer has demonstrated exceptional compliance (95%) with AI-generated agronomic advisories over 18 months. Soil health metrics show consistent improvement — nitrogen levels restored from 68% to 88% following prescribed interventions. Advisory compliance rate of 95% significantly reduces crop failure risk.\n\nRisk Assessment: LOW\nRecommended Credit Limit: ₹${TRUST_SCORE.creditRecommendation.toLocaleString('en-IN')} (Collateral-free KCC)\nRepayment Probability: 96.3%\n\nBased on Eco Sentinel Agri-Credit Scorecard v4.2. This report is accepted by ${TRUST_SCORE.partnerBanks.length} partner banks for instant digital loan application.`;

    // ── AI INTEGRATION (uncomment at end) ──
    // reportText = await askAI(prompt, language);

    return res.status(200).json({
      success: true,
      reportText,
      reportId: `RPT-${Date.now()}`,
      farmer: FARMER_PROFILE.name,
      kisanId: FARMER_PROFILE.kisanId,
      creditRecommendation: TRUST_SCORE.creditRecommendation,
      generatedAt: new Date().toISOString(),
      partnerBanks: TRUST_SCORE.partnerBanks
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Report generation failed' });
  }
});

// ── POST /api/profile/report/send ──
// Sends report to bank portal
// Body: { bankName, reportId }
router.post('/report/send', async (req, res) => {
  try {
    const { bankName = 'SBI', reportId } = req.body;
    const referenceNumber = Math.floor(Math.random() * 900000 + 100000);
    return res.status(200).json({
      success: true,
      message: `Report sent to ${bankName} Kisan Portal successfully`,
      referenceNumber: `KCC-2026-${referenceNumber}`,
      bank: bankName,
      reportId,
      expectedResponse: '2-3 working days',
      submittedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send report to bank' });
  }
});

// ── POST /api/profile/download-id ──
// Generates downloadable Kisan ID card
router.post('/download-id', async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Kisan ID card generated',
      farmer: FARMER_PROFILE.name,
      kisanId: FARMER_PROFILE.kisanId,
      downloadUrl: `/api/profile/id-card/${FARMER_PROFILE.kisanId}.pdf`,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'ID generation failed' });
  }
});

module.exports = router;