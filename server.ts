import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { dbServiceAsync, supabaseAdmin } from './src/server/db-supabase';

const PORT = Number(process.env.PORT) || 3000;

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

const SYSTEM_INSTRUCTION = "You are a warm, highly professional CBT therapist. You are empathetic and objective. You do not flirt, you do not diagnose clinical conditions, and you do not prescribe medicine. If the user mentions self-harm or suicide, prioritize safety: show compassion and immediately provide crisis helpline contact info.";

async function startServer() {
  const app = express();
  app.use(express.json());

  // === API Routes ===
  
  // Supabase is considered configured only when real credentials are provided via env vars.
  const isSupabaseConfigured = Boolean(
    (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (!isSupabaseConfigured) {
    console.warn('[warn] Supabase env vars not set (VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) - auth is bypassed with a local dev dummy user.');
  }

  const DEV_DUMMY_USER = { id: 'dummy-id', email: 'dummy@example.com', free_messages_left: 10, is_subscribed: false, onboarded: true };

  // === Developer login bypass ===
  // Set DEV_LOGIN_CODE in .env to enable code-based dev login (bypasses Supabase OTP).
  // Any client-supplied code matching this value logs in as the dev dummy user.
  // The dev token is what the client stores in localStorage and sends as the Authorization header.
  const DEV_LOGIN_CODE = process.env.DEV_LOGIN_CODE;
  const DEV_LOGIN_TOKEN = 'dev-login-token';

  const isDevLoginEnabled = Boolean(DEV_LOGIN_CODE);

  if (isDevLoginEnabled) {
    console.warn(`[warn] Developer code login is ENABLED (DEV_LOGIN_CODE set). Anyone with the code can bypass auth. Do NOT use in production.`);
  }

  // Supabase Auth Middleware
  const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Dev bypass: only when Supabase credentials are missing entirely.
    if (!isSupabaseConfigured) {
      (req as any).user = { ...DEV_DUMMY_USER };
      return next();
    }

    const token = req.headers['authorization'];

    // Dev login bypass: a request carrying the dev token authenticates as the dev dummy user.
    if (isDevLoginEnabled && token === DEV_LOGIN_TOKEN) {
      (req as any).user = { ...DEV_DUMMY_USER };
      return next();
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const profile = await dbServiceAsync.syncProfile(user.id, user.email || '');
      (req as any).user = profile;
      next();
    } catch(e) {
      console.error('Failed to sync profile', e);
      return res.status(500).json({ error: 'Failed to sync profile' });
    }
  };

  app.post('/api/auth/sync', requireAuth, (req, res) => {
    res.json({ user: (req as any).user });
  });

  // Developer login: exchange a dev code for a dev token + dev dummy user.
  // Enabled only when DEV_LOGIN_CODE is set in env.
  app.post('/api/auth/dev-login', (req, res) => {
    if (!isDevLoginEnabled) {
      return res.status(404).json({ error: 'Dev login is disabled' });
    }
    const { code } = req.body || {};
    if (code !== DEV_LOGIN_CODE) {
      return res.status(401).json({ error: 'Invalid dev code' });
    }
    res.json({ user: { ...DEV_DUMMY_USER }, token: DEV_LOGIN_TOKEN });
  });

  app.get('/api/me', requireAuth, (req, res) => {
    res.json({ user: (req as any).user });
  });

  app.post('/api/user/subscribe', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const updatedUser = await dbServiceAsync.updateUserSubscription(user.id, true);
      res.json({ user: updatedUser });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/user/onboard', requireAuth, async (req, res) => {
    const user = (req as any).user;
    const { name, age, concerns, goals } = req.body;
    
    if (!name || !age || !concerns || !goals) {
      return res.status(400).json({ error: 'All onboarding fields are required' });
    }

    try {
      const updatedUser = await dbServiceAsync.updateUserOnboarding(user.id, { name, age, concerns, goals });
      res.json({ user: updatedUser });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/chats', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const chats = await dbServiceAsync.getChatsByUser(user.id);
      res.json({ chats });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/chats', requireAuth, async (req, res) => {
    try {
      const user = (req as any).user;
      const chat = await dbServiceAsync.createChat(user.id, 'New Chat');
      res.json({ chat });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/chats/:chatId/messages', requireAuth, async (req, res) => {
    try {
      const { chatId } = req.params;
      const user = (req as any).user;
      const chat = await dbServiceAsync.getChatById(chatId);
      
      if (!chat || chat.user_id !== user.id) {
        return res.status(404).json({ error: 'Chat not found' });
      }
      
      const messages = await dbServiceAsync.getMessagesByChat(chatId, 50);
      res.json({ messages });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/chats/:chatId/message', requireAuth, async (req, res) => {
    const { chatId } = req.params;
    const { content } = req.body;
    const user = (req as any).user;

    if (!content) return res.status(400).json({ error: 'Message content required' });

    try {
      const chat = await dbServiceAsync.getChatById(chatId);
      if (!chat || chat.user_id !== user.id) {
        return res.status(404).json({ error: 'Chat not found' });
      }

      // Checking subscription and limits
      if (!user.is_subscribed && user.free_messages_left <= 0) {
        return res.status(403).json({ error: 'Limit reached' });
      }

      // Decrement if not subscribed
      if (!user.is_subscribed) {
        await dbServiceAsync.decrementFreeMessages(user.id);
      }

      // Save user message
      const userMessage = await dbServiceAsync.createMessage(chatId, 'user', content);

      // Fetch history for Gemini context (last 10 messages)
      const history = await dbServiceAsync.getMessagesByChat(chatId, 10);
      
      const chatHistory = history.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const dynamicSystemInstruction = `${SYSTEM_INSTRUCTION}\n\nYou are currently talking to ${user.name || 'a new user'}, age ${user.age || 'unknown'}.\nTheir primary concerns are: ${user.concerns || 'Not specified'}.\nTheir goals for therapy are: ${user.goals || 'Not specified'}.\nKeep responses tailored to their background.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: chatHistory,
          config: {
            systemInstruction: dynamicSystemInstruction,
          }
        });
      } catch (geminiError: any) {
        console.error("Gemini Error:", geminiError);
        const fallbackText = "I'm sorry, I am experiencing a temporary system overload and cannot process my thoughts right now. Please give me a moment and try again.";
        const modelMessage = await dbServiceAsync.createMessage(chatId, 'model', fallbackText);
        const updatedUser = await dbServiceAsync.getUserById(user.id, user.email);
        return res.json({ userMessage, modelMessage, user: updatedUser });
      }

      const aiText = response.text || "I'm here, but I couldn't formulate a response. How are you feeling?";

      // Save model message
      const modelMessage = await dbServiceAsync.createMessage(chatId, 'model', aiText);

      // Return updated user to reflect potential decrement of free_messages_left
      const updatedUser = await dbServiceAsync.getUserById(user.id, user.email);

      res.json({ userMessage, modelMessage, user: updatedUser });

    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: 'Failed to process request', details: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
