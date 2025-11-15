/* eslint-env node */
import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import pdfParse from 'pdf-parse';

import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
// For file uploads (PDFs) we use memory storage so file is available as Buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Optional: for image generation

if (!API_KEY) {
  // Warn at startup so it's obvious in the server logs
  console.warn('Warning: Missing GEMINI_API_KEY (or VITE_GEMINI_API_KEY). /api/chat will return 500.');
}

const openai = new OpenAI({
  apiKey: API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

// Separate OpenAI client for image generation using OpenAI's native endpoint (optional)
let openaiImages = null;
if (OPENAI_API_KEY) {
  openaiImages = new OpenAI({ apiKey: OPENAI_API_KEY }); // default baseURL
}

app.post('/api/chat', async (req, res) => {
  try {
    const { text, imageDataUrl, history } = req.body || {};

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

    // Incorporate prior chat history (text only) if provided
    if (Array.isArray(history)) {
      // Keep a conservative window of the last 12 items
      const window = history.slice(-12);
      for (const item of window) {
        if (!item) continue;
        const role = item.role === 'assistant' ? 'assistant' : 'user';
        const content = typeof item.content === 'string' ? item.content : '';
        if (content && content.trim().length > 0) {
          messages.push({ role, content });
        }
      }
    }

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

// New endpoint: accept a PDF file and optional user instruction, extract text, and get a summary from the model
app.post('/api/summarize-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
    }

    const userText = req.body?.text || '';
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are supported' });
    }

    // Extract text from uploaded PDF (Buffer)
    const data = await pdfParse(file.buffer);
    let pdfText = (data?.text || '').trim();
    if (!pdfText) {
      return res.status(400).json({ error: 'Unable to extract text from PDF' });
    }

    // Trim very long PDFs to keep prompt size manageable
    const MAX_CHARS = 15000; // conservative cap
    let truncated = false;
    if (pdfText.length > MAX_CHARS) {
      pdfText = pdfText.slice(0, MAX_CHARS);
      truncated = true;
    }

    const instruction = userText?.trim()
      ? userText.trim()
      : 'Summarize the key points of this PDF in clear, concise sections with bullets where appropriate.';

    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant for a chat application. Provide responses that are detailed yet concise (thorough but not verbose).\n' +
          "- Do not start your response with an asterisk (*).\n" +
          "- When enumerating items, use clear Markdown bullet lists with '-' bullets and numbered steps for procedures.\n" +
          '- Prefer short paragraphs (2–4 sentences) and compact lists.\n' +
          '- Include brief examples or key caveats when they materially help understanding.\n' +
          '- Avoid filler and unnecessary markdown emphasis unless explicitly requested.\n' +
          '- If content naturally forms sections, use brief Markdown headings (##) to improve scannability.',
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: `${instruction}\n\nPDF content begins below:\n\n${pdfText}${truncated ? '\n\n[Note: PDF truncated for length]' : ''}` },
        ],
      },
    ];

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
    console.error('Error in /api/summarize-pdf:', err);
    return res.status(500).json({ error: 'Failed to summarize PDF' });
  }
});

// New endpoint: text-to-image generation via OpenAI Images API
app.post('/api/generate-image', async (req, res) => {
  try {
    if (!openaiImages) {
      return res.status(500).json({ error: 'Image generation is not configured. Set OPENAI_API_KEY in your environment.' });
    }
    const { prompt, size } = req.body || {};
    const finalPrompt = (prompt || '').trim();
    if (!finalPrompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }
    const finalSize = size && typeof size === 'string' ? size : '1024x1024';

    const response = await openaiImages.images.generate({
      model: 'gpt-image-1',
      prompt: finalPrompt,
      size: finalSize,
    });

    const b64 = response?.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }
    return res.json({ imageBase64: b64 });
  } catch (err) {
    console.error('Error in /api/generate-image:', err);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
