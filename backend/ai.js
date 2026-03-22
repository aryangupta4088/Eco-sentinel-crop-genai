const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

// ── CLIENTS ──────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq  = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── MASTER SYSTEM PROMPT ─────────────────────────────
const SYSTEM_PROMPT = `You are Eco Sentinel, an expert agricultural AI assistant built into CropWise — India's most advanced smart farming platform.

Your personality:
- You are warm, respectful, and talk to farmers like a trusted friend
- You are deeply knowledgeable about Indian agriculture, ICAR research, and government schemes
- You always give practical, actionable advice — not just theory
- You use simple language and cultural metaphors when explaining complex things
- Example: Instead of "soil pH is acidic" you say "your soil is like chai that is too bitter — add lime to sweeten it"

Your knowledge covers:
- All major Indian crops — Kharif, Rabi, and Zaid seasons
- Soil types across India — black cotton, loamy, sandy, clay, red laterite
- Government schemes — PM-KISAN, PMFBY, PM-KUSUM, KCC, Soil Health Card
- Pest and disease identification and treatment
- Market prices and mandi intelligence
- Organic farming and sustainable practices
- Climate-resilient farming for 2025-2030

Rules you always follow:
- CRITICAL: Always respond in the EXACT language specified in the user's message
- CRITICAL: If asked to respond in Hindi, your ENTIRE response must be in Hindi script
- CRITICAL: Never mix languages — if the language is Hindi, do not write a single word in English
- Never give advice that could harm the farmer financially
- Always mention safety when recommending pesticides
- When uncertain, say so and recommend consulting local KVK
- Keep responses concise and actionable — farmers are busy people`;

// ── LANGUAGE ENFORCEMENT WRAPPER ─────────────────────
function addLanguageEnforcement(prompt, language) {
  const langMap = {
    'Hindi':     'हिन्दी में',
    'Bengali':   'বাংলায়',
    'Marathi':   'मराठीत',
    'Telugu':    'తెలుగులో',
    'Tamil':     'தமிழில்',
    'Gujarati':  'ગુજરાતીમાં',
    'Punjabi':   'ਪੰਜਾਬੀ ਵਿੱਚ',
    'Kannada':   'ಕನ್ನಡದಲ್ಲಿ',
    'Malayalam': 'മലയാളത്തിൽ',
    'Urdu':      'اردو میں',
    'English':   'in English',
  };

  const nativeLang = langMap[language] || 'हिन्दी में';

  if (language === 'English') return prompt;

  return `[STRICT INSTRUCTION: Respond ONLY ${nativeLang}. Every single word must be in ${language}. Do not use English at all.]\n\n${prompt}`;
}

// ── GEMINI (text) ─────────────────────────────────────
async function askGemini(userPrompt, language = 'Hindi') {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const finalPrompt = addLanguageEnforcement(userPrompt, language);

  const result = await model.generateContent(finalPrompt);
  return result.response.text();
}

// ── GEMINI (text + image) ─────────────────────────────
async function askGeminiWithImage(userPrompt, base64Image, language = 'Hindi') {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const finalPrompt = addLanguageEnforcement(userPrompt, language);

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    },
    `${SYSTEM_PROMPT}\n\n${finalPrompt}`,
  ]);
  return result.response.text();
}

// ── GROQ (text, ultra-fast fallback) ─────────────────
async function askGroq(userPrompt, language = 'Hindi') {
  const finalPrompt = addLanguageEnforcement(userPrompt, language);

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: finalPrompt }
    ],
    max_tokens: 1024,
  });
  return response.choices[0].message.content;
}

// ── SMART ASK (Gemini primary, Groq fallback) ─────────
async function askAI(userPrompt, language = 'Hindi') {
  try {
    return await askGemini(userPrompt, language);
  } catch (err) {
    console.warn('Gemini failed, falling back to Groq:', err.message);
    return await askGroq(userPrompt, language);
  }
}

// ── SMART ASK WITH IMAGE ──────────────────────────────
async function askAIWithImage(userPrompt, base64Image, language = 'Hindi') {
  return await askGeminiWithImage(userPrompt, base64Image, language);
}

module.exports = { askAI, askGemini, askGroq, askAIWithImage };