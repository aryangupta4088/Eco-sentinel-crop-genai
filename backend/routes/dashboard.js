// routes/dashboard.js
// Powers the Farmer Dashboard page
// Frontend calls:
//   GET /api/dashboard/farmer       → farmer profile + stats + notifications
//   GET /api/dashboard/notifications → just notifications
// Add to server.js: app.use('/api/dashboard', require('./routes/dashboard'));

const express = require('express');
const router = express.Router();

// ── Mock farmer data (replace with real DB later) ──
const FARMER_DATA = {
  id: 'farmer_001',
  name: 'Arjun Singh',
  kisanId: 'KP-2026-UP-AZM-00847',
  village: 'Khanpur',
  district: 'Azamgarh',
  state: 'Uttar Pradesh',
  photo: null, // replace with real photo URL or DB field
  acres: 6,
  trustScore: 847,
  carbonCoins: 1271,
  language: 'hi',
  crops: ['Wheat', 'Mustard', 'Potato'],
  fieldConditions: {
    temperature: '28',
    moisture: '42',
    healthIndex: 8,
    healthLabel: 'Good',
    nitrogen: 68,
    phosphorus: 82,
    potassium: 91,
    pH: 5.2
  }
};

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'weather',
    icon: 'rainy',
    title: 'Weather Alert: Rain in 2 hours',
    message: 'Heavy precipitation expected. Ensure open drains are clear before 6 PM.',
    time: 'Just now',
    priority: 'high',
    actionLabel: 'Review Details',
    actionUrl: '/diagnose'
  },
  {
    id: 2,
    type: 'subsidy',
    icon: 'payments',
    title: 'New Subsidy Available',
    message: 'PM-Kisan 14th installment updated. Auto-apply now via Scheme Radar.',
    time: '2h ago',
    priority: 'medium',
    actionLabel: 'Auto Apply',
    actionUrl: '/schemes'
  },
  {
    id: 3,
    type: 'pest',
    icon: 'warning',
    title: 'Locust Swarm Warning — 5km',
    message: 'Migratory swarms detected nearby. Community Pulse triggered zone alert.',
    time: '5h ago',
    priority: 'high',
    actionLabel: 'See Zone Alert',
    actionUrl: '/diagnose'
  }
];

// ── GET /api/dashboard/farmer ──
// Returns complete farmer dashboard data
router.get('/farmer', async (req, res) => {
  try {
    // get language from session if available
    const lang = req.session?.language?.code || 'en';

    return res.status(200).json({
      success: true,
      farmer: {
        name: FARMER_DATA.name,
        kisanId: FARMER_DATA.kisanId,
        village: FARMER_DATA.village,
        district: FARMER_DATA.district,
        state: FARMER_DATA.state,
        photo: FARMER_DATA.photo,
        acres: FARMER_DATA.acres,
        trustScore: FARMER_DATA.trustScore,
        carbonCoins: FARMER_DATA.carbonCoins,
        crops: FARMER_DATA.crops,
        language: lang
      },
      fieldConditions: FARMER_DATA.fieldConditions,
      notifications: NOTIFICATIONS,
      unreadCount: NOTIFICATIONS.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load dashboard' });
  }
});

// ── GET /api/dashboard/notifications ──
// Returns only notifications — for real-time polling
router.get('/notifications', async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      notifications: NOTIFICATIONS,
      unreadCount: NOTIFICATIONS.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load notifications' });
  }
});

// ── POST /api/dashboard/notifications/:id/read ──
// Mark a notification as read
router.post('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    return res.status(200).json({
      success: true,
      message: `Notification ${id} marked as read`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});

module.exports = router;