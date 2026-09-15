import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { processCoachRequest } from './server/geminiCoach';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, jobDescription, studentBackground, requestedAction } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const parsedData = await processCoachRequest({
      messages,
      jobDescription,
      studentBackground,
      requestedAction,
    });

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error while communicating with coach.',
    });
  }
});

// Start server with Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Student Cover Letter Coach running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
