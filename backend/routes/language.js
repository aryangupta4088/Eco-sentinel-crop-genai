// routes/language.js
// Handles language selection for Eco Sentinel
// Connected to: eco_sentinel_language_entry_final_synced/code.html
// Frontend calls: POST /api/language/select

const express = require('express');
const router = express.Router();

// Supported languages master list
const SUPPORTED_LANGUAGES = [
  { code: 'hi',  english: 'Hindi',     native: 'हिन्दी',    bhashiniCode: 'hi'  },
  { code: 'bn',  english: 'Bengali',   native: 'বাংলা',     bhashiniCode: 'bn'  },
  { code: 'mr',  english: 'Marathi',   native: 'मराठी',    bhashiniCode: 'mr'  },
  { code: 'te',  english: 'Telugu',    native: 'తెలుగు',   bhashiniCode: 'te'  },
  { code: 'ta',  english: 'Tamil',     native: 'தமிழ்',    bhashiniCode: 'ta'  },
  { code: 'gu',  english: 'Gujarati',  native: 'ગુજરાતી',  bhashiniCode: 'gu'  },
  { code: 'ur',  english: 'Urdu',      native: 'اردو',     bhashiniCode: 'ur'  },
  { code: 'kn',  english: 'Kannada',   native: 'ಕನ್ನಡ',   bhashiniCode: 'kn'  },
  { code: 'or',  english: 'Odia',      native: 'ଓଡ଼ିଆ',   bhashiniCode: 'or'  },
  { code: 'pa',  english: 'Punjabi',   native: 'ਪੰਜਾਬੀ',  bhashiniCode: 'pa'  },
  { code: 'ml',  english: 'Malayalam', native: 'മലയാളം',  bhashiniCode: 'ml'  },
  { code: 'as',  english: 'Assamese',  native: 'অসমীয়া',  bhashiniCode: 'as'  },
  { code: 'mai', english: 'Maithili',  native: 'मैथिली',   bhashiniCode: 'mai' },
  { code: 'sat', english: 'Santali',   native: 'संताली',   bhashiniCode: 'sat' },
  { code: 'ks',  english: 'Kashmiri',  native: 'کٲشُر',    bhashiniCode: 'ks'  },
  { code: 'ne',  english: 'Nepali',    native: 'नेपाली',   bhashiniCode: 'ne'  },
  { code: 'sd',  english: 'Sindhi',    native: 'سنڌي',     bhashiniCode: 'sd'  },
  { code: 'kok', english: 'Konkani',   native: 'कोंकणी',   bhashiniCode: 'kok' },
  { code: 'doi', english: 'Dogri',     native: 'डोगरी',    bhashiniCode: 'doi' },
  { code: 'mni', english: 'Manipuri',  native: 'ꯃꯤꯇꯩꯂꯣꯟ', bhashiniCode: 'mni' },
  { code: 'brx', english: 'Bodo',      native: 'बर\'',     bhashiniCode: 'brx' },
  { code: 'sa',  english: 'Sanskrit',  native: 'संस्कृतम्', bhashiniCode: 'sa' },
];

// ── POST /api/language/select ──
// Called when farmer confirms language selection
// Body: { languageCode, languageName, nativeName }
// Returns: { success, message, language, welcomeMessage }
router.post('/select', async (req, res) => {
  try {
    const { languageCode, languageName, nativeName } = req.body;

    // validate
    if (!languageCode) {
      return res.status(400).json({
        success: false,
        message: 'Language code is required'
      });
    }

    const lang = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (!lang) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported language'
      });
    }

    // Store in session (if express-session is set up)
    if (req.session) {
      req.session.language = {
        code: languageCode,
        english: languageName,
        native: nativeName,
        bhashiniCode: lang.bhashiniCode
      };
    }

    // Welcome messages per language
    const welcomeMessages = {
      hi:  'नमस्ते! Eco Sentinel में आपका स्वागत है।',
      bn:  'নমস্কার! Eco Sentinel-এ আপনাকে স্বাগতম।',
      mr:  'नमस्कार! Eco Sentinel मध्ये आपले स्वागत आहे।',
      te:  'నమస్కారం! Eco Sentinel కి స్వాగతం।',
      ta:  'வணக்கம்! Eco Sentinel-க்கு வரவேற்கிறோம்.',
      gu:  'નમસ્તે! Eco Sentinel માં આપનું સ્વાગત છે.',
      pa:  'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! Eco Sentinel ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ।',
      ml:  'നമസ്കാരം! Eco Sentinel-ലേക്ക് സ്വാഗതം।',
      kn:  'ನಮಸ್ಕಾರ! Eco Sentinel ಗೆ ಸ್ವಾಗತ.',
      or:  'ନମସ୍କାର! Eco Sentinel ରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।',
    };

    return res.status(200).json({
      success: true,
      message: 'Language selected successfully',
      language: {
        code: languageCode,
        english: languageName,
        native: nativeName,
        bhashiniCode: lang.bhashiniCode
      },
      welcomeMessage: welcomeMessages[languageCode] || `Welcome to Eco Sentinel in ${languageName}!`,
      redirectTo: '/dashboard.html'
    });

  } catch (error) {
    console.error('Language selection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during language selection'
    });
  }
});

// ── GET /api/language/list ──
// Returns all supported languages
router.get('/list', (req, res) => {
  return res.status(200).json({
    success: true,
    languages: SUPPORTED_LANGUAGES,
    total: SUPPORTED_LANGUAGES.length
  });
});

// ── GET /api/language/current ──
// Returns currently selected language from session
router.get('/current', (req, res) => {
  const lang = req.session?.language || null;
  return res.status(200).json({
    success: true,
    language: lang
  });
});

module.exports = router;