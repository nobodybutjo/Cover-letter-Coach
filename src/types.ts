export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface VerificationItem {
  id: string;
  item: string;
  reason: string;
  verified: boolean;
}

export interface SkillMapping {
  requirement: string;
  studentEvidence: string;
  whyItCounts: string;
}

export interface CoachingNotes {
  identifiedRequirements: string[];
  skillsMapping: SkillMapping[];
  confidenceTip: string;
  nextStepAdvice: string;
}

export interface LetterDraft {
  recipientInfo?: string;
  subjectLine?: string;
  opening?: string;
  bodyParagraphs?: string[];
  motivation?: string;
  closing?: string;
  fullFormattedLetter: string;
  lastUpdated: string;
}

export interface CoachApiResponse {
  reply: string;
  letterDraft?: LetterDraft | null;
  verificationChecklist?: VerificationItem[];
  coachingNotes?: CoachingNotes | null;
  stage?: 'discovery' | 'brainstorming' | 'reviewing' | 'draft_ready';
}

export interface ExampleScenario {
  id: string;
  title: string;
  studentYear: string;
  targetRole: string;
  companyName: string;
  jobDescription: string;
  studentBackground: string;
  previewSummary: string;
}
