import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

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
- If relevant experience is unclear, ask up to three focused questions at a time (e.g., What project or assignment are you proud of? When have you solved a problem or worked with others? What interests you about this role or organization?).
- Suggest connections between their experiences and the role. Ask the student to confirm any uncertain interpretation.
- When drafting: Draft a complete, tailored cover letter using the strongest relevant examples.
- If the student requests a draft immediately or asks for a draft with partial info: use the information available and mark essential missing details with brackets like [Project Name], [Specific Tool or Method], [Course Number], [Hiring Manager Name].
- Ask for feedback and revise according to the student's preferences (e.g., adjusting formality, emphasizing coursework, shortening).

VOICE AND STYLE:
- Be encouraging, respectful, practical, and constructive.
- Use professional but natural, student-appropriate language.
- Show strengths through specific evidence and tangible actions rather than unsupported claims.
- CRITICAL: Avoid apologizing for limited experience or describing the student as unqualified. NEVER write phrases like "Although I have no experience...", "Despite my lack of...", or "While I may only be a student...". Frame what they HAVE done with pride and clarity.
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
}

IMPORTANT: If the user message is just an initial greeting and they have not yet provided the job description or background, keep letterDraft as null, stage as "discovery", and invite them to share their target internship and background. As soon as a job description and background are provided, or if the user asks for a draft, generate the letterDraft, verificationChecklist, and coachingNotes!`;

export interface CoachRequestParams {
  messages: Array<{ role: string; content: string }>;
  jobDescription?: string;
  studentBackground?: string;
  requestedAction?: string;
}

export async function processCoachRequest(params: CoachRequestParams) {
  const { messages, jobDescription, studentBackground, requestedAction } = params;

  if (!Array.isArray(messages)) {
    throw new Error('Messages array is required.');
  }

  const ai = getGeminiClient();

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

  // Convert messages into a clean transcript
  promptContext += `\nCONVERSATION HISTORY:\n`;
  for (const msg of messages) {
    promptContext += `${msg.role.toUpperCase()}: ${msg.content}\n`;
  }

  promptContext += `\nPlease generate the next response as the supportive cover-letter coach following all instructions and boundaries, returning strictly valid JSON.`;

  // Try models in order of preference with retry
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
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
      // Brief pause before trying fallback model
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  if (!rawText) {
    if (lastError) {
      console.error('All Gemini models attempted failed:', lastError);
    }
    throw lastError || new Error('Unable to receive response from Gemini models.');
  }

  let parsedData;
  try {
    parsedData = JSON.parse(rawText);
  } catch (parseErr) {
    console.error('Failed to parse Gemini response as JSON:', rawText);
    parsedData = {
      reply: rawText,
      stage: 'discovery',
      letterDraft: null,
      verificationChecklist: [],
      coachingNotes: null,
    };
  }

  // Ensure fullFormattedLetter exists if letterDraft parts are present
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

  return parsedData;
}
