import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatCoach } from './components/ChatCoach';
import { LetterEditor } from './components/LetterEditor';
import { VerificationPanel } from './components/VerificationPanel';
import { CoachingNotesPanel } from './components/CoachingNotesPanel';
import { ReferenceModal } from './components/ReferenceModal';
import { PrintModal } from './components/PrintModal';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import {
  Message,
  LetterDraft,
  VerificationItem,
  CoachingNotes,
  ExampleScenario,
  CoachApiResponse,
} from './types';
import { EXAMPLE_SCENARIOS } from './data/exampleScenarios';
import { FileCheck, ShieldCheck, Lightbulb, AlertCircle, FileText } from 'lucide-react';

const INITIAL_COACH_MESSAGE: Message = {
  id: 'init-msg-1',
  role: 'assistant',
  content: `Hello! I'm your cover-letter coach. 

Applying for internships can feel intimidating—especially if you don't have corporate work experience yet. But employers know that! What they actually look for is curiosity, reliability, and evidence that you can solve problems and work with others.

We're going to uncover the real skills you've developed through **coursework, class projects, clubs, volunteering, or part-time jobs**, and translate them into a clear, honest cover letter.

To start, you can:
1. **Paste your target internship description** and any coursework/projects using the **"Job & Background"** button above, or
2. **Choose a sample student case** from the **"Try Sample Cases"** menu to see how this works!`,
  timestamp: new Date().toISOString(),
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_COACH_MESSAGE]);
  const [jobDescription, setJobDescription] = useState('');
  const [studentBackground, setStudentBackground] = useState('');
  const [stage, setStage] = useState<'discovery' | 'brainstorming' | 'reviewing' | 'draft_ready'>('discovery');
  
  const [letterDraft, setLetterDraft] = useState<LetterDraft | null>(null);
  const [verificationChecklist, setVerificationChecklist] = useState<VerificationItem[]>([]);
  const [coachingNotes, setCoachingNotes] = useState<CoachingNotes | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'letter' | 'checklist' | 'coaching'>('letter');
  
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSystemDiagramOpen, setIsSystemDiagramOpen] = useState(false);

  // Send message to Coach API
  const handleSendMessage = async (userContent: string, actionOverride?: string) => {
    setErrorMessage(null);
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userContent,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          jobDescription,
          studentBackground,
          requestedAction: actionOverride,
        }),
      });

      if (!res.ok) {
        let errMessage = '';
        try {
          const errData = await res.json();
          errMessage = errData.error || errData.message;
        } catch {
          errMessage = await res.text().catch(() => '');
        }
        throw new Error(errMessage || `Server responded with status ${res.status}`);
      }

      const data: CoachApiResponse = await res.json();

      // Add coach assistant response
      const coachMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I've reviewed your details and updated your cover letter materials.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, coachMsg]);

      if (data.stage) {
        setStage(data.stage);
      }

      if (data.letterDraft) {
        setLetterDraft(data.letterDraft);
        // Automatically switch to letter tab when a draft is newly available
        if (!letterDraft) {
          setActiveTab('letter');
        }
      }

      if (Array.isArray(data.verificationChecklist) && data.verificationChecklist.length > 0) {
        setVerificationChecklist(data.verificationChecklist);
      }

      if (data.coachingNotes) {
        setCoachingNotes(data.coachingNotes);
      }
    } catch (err: any) {
      console.error('Failed to communicate with coach:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the coaching server. Please check your network or try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Quick revision request
  const handleRequestRevision = (instruction: string) => {
    handleSendMessage(instruction, 'REVISION_REQUEST');
  };

  // Direct edit of cover letter text
  const handleUpdateDraftText = (updatedText: string) => {
    if (!letterDraft) {
      setLetterDraft({
        fullFormattedLetter: updatedText,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } else {
      setLetterDraft({
        ...letterDraft,
        fullFormattedLetter: updatedText,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  };

  // Toggle checklist item verified state
  const handleToggleVerificationItem = (id: string) => {
    setVerificationChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, verified: !item.verified } : item
      )
    );
  };

  // Load a preset example scenario
  const handleSelectScenario = (scenario: ExampleScenario) => {
    setJobDescription(scenario.jobDescription);
    setStudentBackground(scenario.studentBackground);

    const welcomeMsg: Message = {
      id: `sample-loaded-${Date.now()}`,
      role: 'assistant',
      content: `I've loaded the case: **${scenario.title}** (${scenario.studentYear}).\n\n**Target Role:** ${scenario.targetRole} at ${scenario.companyName}\n**Background:** ${scenario.previewSummary}\n\nLet's connect your class project and club involvement to this internship. Would you like me to analyze how your coursework maps to their requirements, or draft an initial cover letter right now?`,
      timestamp: new Date().toISOString(),
    };

    setMessages([welcomeMsg]);
    setLetterDraft(null);
    setVerificationChecklist([]);
    setCoachingNotes(null);
    setStage('discovery');
    setActiveTab('letter');
  };

  // Save reference materials from modal
  const handleSaveReferenceData = (newJob: string, newBackground: string) => {
    setJobDescription(newJob);
    setStudentBackground(newBackground);

    if (newJob.trim() || newBackground.trim()) {
      handleSendMessage(
        "I've updated my target internship description and background details. Please review and suggest how we can connect my experience to their requirements.",
        'UPDATE_MATERIALS'
      );
    }
  };

  // Reset conversation
  const handleReset = () => {
    if (confirm('Start a fresh coaching conversation? Your current session will be reset.')) {
      setMessages([INITIAL_COACH_MESSAGE]);
      setJobDescription('');
      setStudentBackground('');
      setLetterDraft(null);
      setVerificationChecklist([]);
      setCoachingNotes(null);
      setStage('discovery');
      setActiveTab('letter');
      setErrorMessage(null);
    }
  };

  const hasReferenceData = Boolean(jobDescription.trim() || studentBackground.trim());
  const unverifiedCount = verificationChecklist.filter((i) => !i.verified).length;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      {/* Header */}
      <Header
        onSelectScenario={handleSelectScenario}
        onOpenReferenceModal={() => setIsReferenceModalOpen(true)}
        onOpenSystemDiagram={() => setIsSystemDiagramOpen(true)}
        onReset={handleReset}
        hasReferenceData={hasReferenceData}
      />

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 text-xs sm:text-sm text-red-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-4xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-600 hover:text-red-900 font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-4rem)]">
        {/* Left Column: Coaching Chat Dialogue (5 cols on lg) */}
        <section className="lg:col-span-5 h-[580px] lg:h-full flex flex-col min-h-0">
          <ChatCoach
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            stage={stage}
            onQuickAction={handleSendMessage}
            onOpenSystemDiagram={() => setIsSystemDiagramOpen(true)}
          />
        </section>

        {/* Right Column: Work Product Center (7 cols on lg) */}
        <section className="lg:col-span-7 h-[680px] lg:h-full flex flex-col min-h-0">
          {/* Navigation Tabs between Letter, Checklist, and Coaching Notes */}
          <div className="flex items-center justify-between bg-stone-200/80 p-1 rounded-xl mb-3 border border-stone-300/60 shadow-2xs">
            <div className="flex items-center space-x-1">
              <button
                id="tab-letter"
                type="button"
                onClick={() => setActiveTab('letter')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'letter'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-300/40'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cover Letter Draft</span>
              </button>

              <button
                id="tab-checklist"
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'checklist'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-300/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verification Checklist</span>
                {unverifiedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unverifiedCount}
                  </span>
                )}
              </button>

              <button
                id="tab-coaching"
                type="button"
                onClick={() => setActiveTab('coaching')}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'coaching'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-300/40'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Coaching Notes</span>
              </button>
            </div>

            {/* Quick reference indicator */}
            <button
              onClick={() => setIsReferenceModalOpen(true)}
              className="text-[11px] text-stone-500 hover:text-stone-800 hidden sm:flex items-center space-x-1 px-2 py-1 rounded hover:bg-stone-300/40 transition-colors"
            >
              <FileText className="w-3 h-3 text-stone-400" />
              <span>{hasReferenceData ? 'Edit Materials' : 'Add Materials'}</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 min-h-0">
            {activeTab === 'letter' && (
              <LetterEditor
                letterDraft={letterDraft}
                onUpdateDraft={handleUpdateDraftText}
                onRequestRevision={handleRequestRevision}
                onOpenPrint={() => setIsPrintModalOpen(true)}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'checklist' && (
              <VerificationPanel
                items={verificationChecklist}
                onToggleItem={handleToggleVerificationItem}
              />
            )}

            {activeTab === 'coaching' && (
              <CoachingNotesPanel notes={coachingNotes} />
            )}
          </div>
        </section>
      </main>

      {/* Reference Materials Modal */}
      <ReferenceModal
        isOpen={isReferenceModalOpen}
        onClose={() => setIsReferenceModalOpen(false)}
        jobDescription={jobDescription}
        studentBackground={studentBackground}
        onSave={handleSaveReferenceData}
      />

      {/* Print / PDF Preview Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        letterText={letterDraft?.fullFormattedLetter || ''}
      />

      {/* System & Agent Architecture Diagram Modal */}
      <SystemDiagramModal
        isOpen={isSystemDiagramOpen}
        onClose={() => setIsSystemDiagramOpen(false)}
      />
    </div>
  );
}
