/* eslint-env node */
import express from 'express';
import dotenv from 'dotenv';

import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  // Warn at startup so it's obvious in the server logs
  console.warn('Warning: Missing GEMINI_API_KEY (or VITE_GEMINI_API_KEY). /api/chat will return 500.');
}

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

app.post('/api/chat', async (req, res) => {
  try {
    const { text, imageDataUrl } = req.body || {};

    if (!API_KEY) {
      return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
    }

    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant for a chat application. Provide responses that are detailed yet concise (thorough but not verbose).\n' +
          'Formatting rules:\n' +
          "- Do not start your response with an asterisk (*).\n" +
          "- When enumerating items, use clear Markdown bullet lists with '-' bullets and numbered steps for procedures.\n" +
          "- Prefer short paragraphs (2–4 sentences) and compact lists.\n" +
          "- Include brief examples or key caveats when they materially help understanding.\n" +
          "- Avoid filler and unnecessary markdown emphasis unless explicitly requested.\n" +
          "- If content naturally forms sections, use brief Markdown headings (##) to improve scannability.",
      },
    ];

    if (imageDataUrl) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: text || '' },
          { type: 'image_url', image_url: { url: imageDataUrl } },
        ],
      });
    } else {
      messages.push({ role: 'user', content: text || '' });
    }

    const response = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages,
    });

    const message = response?.choices?.[0]?.message;
    let out = '';
    if (message) {
      if (typeof message.content === 'string') {
        out = message.content;
      } else if (Array.isArray(message.content)) {
        out = message.content
          .map((part) => (typeof part === 'string' ? part : part?.text || ''))
          .join('\n');
      }
    }

    return res.json({ text: out });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({ error: 'Failed to fetch completion' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
