const express = require('express');
const router = express.Router();
const { askAI } = require('../ai');

// ── Language name to native script mapping ────────────
const LANGUAGE_MAP = {
  'Hindi':     { native: 'हिन्दी',    instruction: 'आप केवल हिंदी में जवाब दें। एक भी शब्द अंग्रेजी में मत लिखें।' },
  'Bengali':   { native: 'বাংলা',     instruction: 'শুধুমাত্র বাংলায় উত্তর দিন।' },
  'Marathi':   { native: 'मराठी',    instruction: 'फक्त मराठीत उत्तर द्या.' },
  'Telugu':    { native: 'తెలుగు',   instruction: 'తెలుగులో మాత్రమే జవాబు ఇవ్వండి.' },
  'Tamil':     { native: 'தமிழ்',    instruction: 'தமிழில் மட்டும் பதில் சொல்லுங்கள்.' },
  'Gujarati':  { native: 'ગુજરાતી',  instruction: 'ફક્ત ગુજરાતીમાં જ જવાબ આપો.' },
  'Punjabi':   { native: 'ਪੰਜਾਬੀ',  instruction: 'ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।' },
  'Kannada':   { native: 'ಕನ್ನಡ',   instruction: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಉತ್ತರಿಸಿ.' },
  'Malayalam': { native: 'മലയാളം',  instruction: 'മലയാളത്തിൽ മാത്രം മറുപടി നൽകുക.' },
  'Urdu':      { native: 'اردو',     instruction: 'صرف اردو میں جواب دیں۔' },
  'Odia':      { native: 'ଓଡ଼ିଆ',   instruction: 'କେବଳ ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅନ୍ତୁ।' },
  'Assamese':  { native: 'অসমীয়া',  instruction: 'কেৱল অসমীয়াত উত্তৰ দিয়ক।' },
  'English':   { native: 'English',   instruction: 'Reply only in English.' },
};

// ── POST /api/chat ────────────────────────────────────
// Called by Ask Krishi AI chat page and dashboard
// Frontend sends: { message, language }
router.post('/', async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lang = language || 'Hindi';
    const langInfo = LANGUAGE_MAP[lang] || LANGUAGE_MAP['Hindi'];

    // ── STRICT LANGUAGE PROMPT ────────────────────────
    // The language instruction is at the TOP and BOTTOM
    // so the AI cannot ignore it
    const prompt = `🔴 IMPORTANT: ${langInfo.instruction}
🔴 LANGUAGE: Respond ONLY in ${lang} (${langInfo.native}). Do NOT use English at all.

A farmer is asking: "${message}"

Give a helpful, practical answer that:
- Directly addresses what they asked
- Uses simple language they can understand  
- Uses cultural metaphors familiar to Indian farmers
- Gives specific actionable advice with quantities and rupee amounts
- Is short enough to be spoken aloud (max 4-5 sentences)
- Ends with one clear action to take today

🔴 REMINDER: Your ENTIRE response must be in ${lang} (${langInfo.native}) only.`;

    const response = await askAI(prompt, lang);

    res.json({
      success: true,
      response,
      language: lang
    });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      error: 'AI unavailable',
      message: error.message
    });
  }
});

module.exports = router;