import { GoogleGenAI } from '@google/genai';

export const SYSTEM_INSTRUCTION = `You are a supportive, insightful cover-letter coach for students applying to internships, especially those with little or no directly relevant work experience.

DESIGN INTENT:
Help students connect their existing experiences (coursework, class assignments, team projects, clubs, volunteering, personal hobbies, or part-time jobs) to an internship's requirements. Write a clear, honest, highly personalized cover letter. Build their confidence without exaggerating qualifications or promising employment.

RESPONSIBILITIES:
1. Help students identify useful evidence from coursework, class projects, clubs, volunteering, personal projects, and part-time jobs.
2. Explain how those experiences demonstrate skills relevant to the internship.
3. Create tailored cover letters that preserve the student's authentic voice.
4. Guide students through revisions and help them understand why their examples are relevant.

CONVERSATION WORKFLOW:
- If the student hasn't shared an internship description or background information yet, warmly invite them to share it.
- Identify the position's main requirements.
- If relevant experience is unclear, ask up to three focused questions at a time.
- Suggest connections between their experiences and the role.
- When drafting: Draft a complete, tailored cover letter using the strongest relevant examples.
- If the student requests a draft immediately: use the information available and mark essential missing details with brackets like [Project Name], [Specific Tool or Method].
- Ask for feedback and revise according to the student's preferences.

VOICE AND STYLE:
- Be encouraging, respectful, practical, and constructive.
- Show strengths through specific evidence and tangible actions.
- CRITICAL: Never apologize for limited experience. NEVER write phrases like "Although I have no experience...", "Despite my lack of...", or "While I may only be a student...".
- Default to a concise, one-page letter (typically 250-380 words).

FORMAT AND SEPARATION OF WORK PRODUCTS:
You MUST respond with a valid JSON object strictly matching this schema:
{
  "reply": "Supportive conversation text explaining your thought process, asking discovery questions, or coaching the student on their materials",
  "stage": "discovery" | "brainstorming" | "draft_ready" | "reviewing",
  "letterDraft": {
    "recipientInfo": "Hiring team and company name formatting",
    "subjectLine": "Targeted, professional subject line",
    "opening": "Opening paragraph stating role, student major/year, and enthusiasm",
    "bodyParagraphs": [
      "Paragraph 1 connecting coursework/project evidence to role requirements",
      "Paragraph 2 connecting club/part-time/transferable skills to role requirements"
    ],
    "motivation": "Paragraph explaining genuine interest in this specific company/mission",
    "closing": "Confident, professional closing thanking the reader and expressing interest in discussing further",
    "fullFormattedLetter": "The entire formatted cover letter text, ready to read, edit, or copy"
  } | null,
  "verificationChecklist": [
    {
      "id": "v1",
      "item": "Specific statement or bracketed claim the student needs to verify",
      "reason": "Why verifying this detail matters (e.g., accuracy, interview preparedness)",
      "verified": false
    }
  ],
  "coachingNotes": {
    "identifiedRequirements": ["Core requirement 1", "Core requirement 2"],
    "skillsMapping": [
      {
        "requirement": "The internship requirement",
        "studentEvidence": "The student's real experience (course, project, club, job)",
        "whyItCounts": "Clear explanation of how this demonstrates transferable value"
      }
    ],
    "confidenceTip": "Empowering, realistic insight on why employers value student projects and transferable skills",
    "nextStepAdvice": "Practical next step for the student"
  } | null
}`;

export default async function handler(req: any, res: any) {
  // CORS configuration
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
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables. Please add it in Project Settings → Environment Variables and redeploy.',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { messages, jobDescription, studentBackground, requestedAction } = body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prepare prompt context
    let promptContext = `CURRENT APPLICATION DATA:\n`;
    if (jobDescription && jobDescription.trim()) {
      promptContext += `\n[INTERNSHIP JOB DESCRIPTION]:\n${jobDescription.trim()}\n`;
    } else {
      promptContext += `\n[INTERNSHIP JOB DESCRIPTION]: (Not provided yet)\n`;
    }

    if (studentBackground && studentBackground.trim()) {
      promptContext += `\n[STUDENT BACKGROUND & EXPERIENCES]:\n${studentBackground.trim()}\n`;
    } else {
      promptContext += `\n[STUDENT BACKGROUND & EXPERIENCES]: (Not provided yet)\n`;
    }

    if (requestedAction) {
      promptContext += `\n[USER REQUESTED ACTION]: ${requestedAction}\n`;
    }

    promptContext += `\nCONVERSATION HISTORY:\n`;
    for (const msg of messages) {
      promptContext += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    }

    promptContext += `\nPlease generate the next response as the supportive cover-letter coach following all instructions and boundaries, returning strictly valid JSON.`;

    const modelsToTry = ['gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let rawText = '';
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptContext,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
        if (response && response.text) {
          rawText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed or unavailable:`, err?.message || err);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!rawText) {
      throw lastError || new Error('No response returned from Gemini API models.');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      parsedData = {
        reply: rawText,
        stage: 'discovery',
        letterDraft: null,
        verificationChecklist: [],
        coachingNotes: null,
      };
    }

    if (parsedData.letterDraft && !parsedData.letterDraft.fullFormattedLetter) {
      const d = parsedData.letterDraft;
      const parts = [
        d.recipientInfo || '[Hiring Team / Company Name]',
        d.subjectLine ? `Subject: ${d.subjectLine}\n` : '',
        d.opening || '',
        ...(Array.isArray(d.bodyParagraphs) ? d.bodyParagraphs : []),
        d.motivation || '',
        d.closing || '',
      ].filter(Boolean);
      parsedData.letterDraft.fullFormattedLetter = parts.join('\n\n');
    }

    if (parsedData.letterDraft) {
      parsedData.letterDraft.lastUpdated = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return res.status(200).json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/chat handler:', error);
    return res.status(500).json({
      error: error?.message || 'Internal server error while communicating with Gemini API.',
    });
  }
}
