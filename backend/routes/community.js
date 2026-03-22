const express = require('express');
const router = express.Router();
const { askAI } = require('../ai');

// ── IN-MEMORY PEST REPORTS ────────────────────────────
// In production replace with MongoDB or PostgreSQL
let pestReports = [];

// ── POST /api/community/report ────────────────────────
// Called when farmer clicks "Submit Report" on the map
// Frontend sends: { pest, crop, district, language }
router.post('/report', async (req, res) => {
  try {
    const { pest, crop, district, language } = req.body;

    if (!pest || !crop || !district) {
      return res.status(400).json({ error: 'pest, crop and district are required' });
    }

    // Save report
    pestReports.push({
      pest,
      crop,
      district,
      timestamp: new Date(),
      id: Date.now()
    });

    // Check how many similar reports in same district in last 7 days
    const nearbyReports = pestReports.filter(r =>
      r.district.toLowerCase() === district.toLowerCase() &&
      r.pest.toLowerCase() === pest.toLowerCase() &&
      (new Date() - new Date(r.timestamp)) < 7 * 24 * 60 * 60 * 1000
    );

    // Generate zone alert if 3 or more reports
    let zoneAlert = null;
    if (nearbyReports.length >= 3) {
      zoneAlert = await askAI(
        `URGENT: ${nearbyReports.length} farmers in ${district} reported ${pest} on ${crop} in the last 7 days.
        Generate a brief Zone Alert (max 3 sentences) with:
        1. Severity level
        2. Which crops are most at risk
        3. ONE immediate preventive action all farmers should take today`,
        language || 'Hindi'
      );
    }

    res.json({
      success: true,
      reported: true,
      nearbyCount: nearbyReports.length,
      zoneAlert,
      isAlert: nearbyReports.length >= 3,
      district,
      pest,
      message: nearbyReports.length >= 3
        ? `⚠️ Zone Alert! ${nearbyReports.length} reports of ${pest} in ${district}`
        : `✅ Report submitted. ${nearbyReports.length} total reports of ${pest} in ${district} this week.`
    });

  } catch (error) {
    console.error('Community report error:', error.message);
    res.status(500).json({
      error: 'Report failed',
      message: error.message
    });
  }
});

// ── GET /api/community/reports/:district ──────────────
// Returns all pest reports for a district in last 7 days
// Used to show markers on the map
router.get('/reports/:district', (req, res) => {
  const { district } = req.params;

  const reports = pestReports.filter(r =>
    r.district.toLowerCase() === district.toLowerCase() &&
    (new Date() - new Date(r.timestamp)) < 7 * 24 * 60 * 60 * 1000
  );

  // Group by pest type for map display
  const grouped = {};
  reports.forEach(r => {
    if (!grouped[r.pest]) grouped[r.pest] = 0;
    grouped[r.pest]++;
  });

  res.json({
    success: true,
    reports,
    grouped,
    totalReports: reports.length,
    district
  });
});

// ── GET /api/community/reports ────────────────────────
// Returns all reports (for admin/dashboard use)
router.get('/reports', (req, res) => {
  res.json({
    success: true,
    reports: pestReports,
    total: pestReports.length
  });
});

module.exports = router;