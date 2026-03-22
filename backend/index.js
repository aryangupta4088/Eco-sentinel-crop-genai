const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

// ── Middleware ───────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Session (needed for language persistence) ────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'ecosentinel-secret-2026',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// ── Routes ──────────────────────────────────────────
app.use('/api/language',   require('./routes/language')); 
app.use('/api/dashboard', require('./routes/dashboard'));   // ← NEW: Language entry page
app.use('/api/chat',       require('./routes/chat'));        // ← Ask Krishi AI page
app.use('/api/scan',       require('./routes/scan')); 
app.use('/api/profile', require('./routes/profile'));       // ← Diagnose & Protect (Agri-Lens)
app.use('/api/chronicles', require('./routes/chronicles')); 
app.use('/api/chronicle', require('./routes/chronicle'));// ← Grow Smart (Crop Chronicles)
app.use('/api/mandi',      require('./routes/mandi'));       // ← Earn More (Smart-Mandi)
app.use('/api/w2w',        require('./routes/w2w'));         // ← Earn More (Waste-to-Wealth)
app.use('/api/carboncoin', require('./routes/carboncoin')); // ← Earn More (Carbon Coin)
app.use('/api/subsidy',    require('./routes/subsidy'));     // ← Scheme Radar
app.use('/api/community',  require('./routes/community'));  // ← Diagnose & Protect (Community Pulse)
app.use('/api/soil',       require('./routes/soil'));        // ← Grow Smart (Soil Vitals)
app.use('/api/agricart',   require('./routes/agricart'));    // ← Earn More (Agri-Cart)
app.use('/api/bhusanjal',  require('./routes/bhusanjal'));  // ← Earn More (Bhu-Sanjal)
app.use('/api/kisansetu',  require('./routes/kisansetu'));  // ← Diagnose & Protect (Labor Exchange)
app.use('/api/climate',    require('./routes/climate'));     // ← Grow Smart (Crop Swap)
app.use('/api/agritrend',  require('./routes/agritrend'));  // ← AgriTrend page

// ── Remove duplicate: chronicle.js same as chronicles.js ──
// app.use('/api/chronicle', require('./routes/chronicle')); // ← DISABLED — duplicate of chronicles

// ── Health check ────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status:   '🌱 Eco Sentinel backend running',
    version:  '2.0.0',
    pillars:  17,
    routes: {
      language:   '/api/language',
      chat:       '/api/chat',
      scan:       '/api/scan',
      chronicles: '/api/chronicles',
      mandi:      '/api/mandi',
      w2w:        '/api/w2w',
      carboncoin: '/api/carboncoin',
      subsidy:    '/api/subsidy',
      community:  '/api/community',
      soil:       '/api/soil',
      agricart:   '/api/agricart',
      bhusanjal:  '/api/bhusanjal',
      kisansetu:  '/api/kisansetu',
      climate:    '/api/climate',
      agritrend:  '/api/agritrend',
    }
  });
});

// ── Global error handler ─────────────────────────────
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ── Start ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🌱 Eco Sentinel GenAI Backend v2.0     ║
  ║   Port     : ${PORT}                        ║
  ║   Pillars  : 17 active                   ║
  ║   Session  : enabled                     ║
  ║   Language : /api/language               ║
  ╚══════════════════════════════════════════╝
  `);
});