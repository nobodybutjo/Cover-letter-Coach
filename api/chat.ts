import { processCoachRequest } from '../server/geminiCoach';

export default async function handler(req: any, res: any) {
  // CORS & method validation
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { messages, jobDescription, studentBackground, requestedAction } = body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const result = await processCoachRequest({
      messages,
      jobDescription,
      studentBackground,
      requestedAction,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error in Vercel /api/chat function:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error while communicating with coach.',
    });
  }
}
