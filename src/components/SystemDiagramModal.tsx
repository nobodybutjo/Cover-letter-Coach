import React, { useState } from 'react';
import {
  X,
  Info,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileText,
  CheckCircle2,
  Workflow,
  Server,
  Terminal,
  Database,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'agent-spec' | 'data-flow'>('diagram');
  const [selectedNode, setSelectedNode] = useState<string | null>('agent');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-stone-900 text-base">
                  System & Agent Architecture
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800">
                  Full-Stack Overview
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Diagram showing client UI, Express backend orchestrator, and Gemini Coach Agent
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Selector Tabs */}
            <div className="hidden sm:flex bg-stone-200/80 p-1 rounded-lg text-xs font-medium space-x-1">
              <button
                type="button"
                onClick={() => setActiveTab('diagram')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'diagram'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Architecture Diagram
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('agent-spec')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'agent-spec'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Agent Rules & Boundaries
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('data-flow')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'data-flow'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Data Contract
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/70 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex border-b border-stone-200 bg-stone-100 p-1 text-xs">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`flex-1 py-1.5 font-medium text-center rounded-md ${
              activeTab === 'diagram' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Diagram
          </button>
          <button
            onClick={() => setActiveTab('agent-spec')}
            className={`flex-1 py-1.5 font-medium text-center rounded-md ${
              activeTab === 'agent-spec' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Agent Specs
          </button>
          <button
            onClick={() => setActiveTab('data-flow')}
            className={`flex-1 py-1.5 font-medium text-center rounded-md ${
              activeTab === 'data-flow' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
            }`}
          >
            Data Contract
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50/50 space-y-6">
          {activeTab === 'diagram' && (
            <div className="space-y-6">
              {/* Architecture Flow Visualization */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center space-x-1.5">
                    <Workflow className="w-4 h-4 text-indigo-600" />
                    <span>End-to-End System Pipeline</span>
                  </span>
                  <span className="text-[11px] text-stone-400">Click any block to view technical details</span>
                </div>

                {/* Diagram Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {/* Block 1: User / Student Inputs */}
                  <div
                    onClick={() => setSelectedNode('user')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedNode === 'user'
                        ? 'border-amber-400 bg-amber-50/60 shadow-xs ring-2 ring-amber-400/20'
                        : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-amber-700 mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">1. Student Input</span>
                    </div>
                    <h4 className="text-xs font-semibold text-stone-900">Background & Target Role</h4>
                    <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                      <li>• Internship Job Description</li>
                      <li>• Class Projects & Assignments</li>
                      <li>• Student Clubs & Volunteering</li>
                      <li>• Part-time Jobs / Hobbies</li>
                      <li>• Chat Queries & Quick Prompts</li>
                    </ul>
                  </div>

                  {/* Block 2: Client SPA (React 19) */}
                  <div
                    onClick={() => setSelectedNode('client')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedNode === 'client'
                        ? 'border-indigo-500 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-indigo-700 mb-2">
                      <Layers className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">2. Client SPA</span>
                    </div>
                    <h4 className="text-xs font-semibold text-stone-900">React 19 + Tailwind</h4>
                    <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                      <li>• <strong>ChatCoach:</strong> Stage badge & quick actions</li>
                      <li>• <strong>LetterEditor:</strong> Real-time editor + brackets</li>
                      <li>• <strong>VerificationPanel:</strong> Claim checklist</li>
                      <li>• <strong>CoachingNotes:</strong> Skills mapping</li>
                      <li>• <strong>PrintModal:</strong> PDF & print engine</li>
                    </ul>
                  </div>

                  {/* Block 3: Express Backend */}
                  <div
                    onClick={() => setSelectedNode('backend')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedNode === 'backend'
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-emerald-700 mb-2">
                      <Server className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">3. Server Layer</span>
                    </div>
                    <h4 className="text-xs font-semibold text-stone-900">Node / Express</h4>
                    <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                      <li>• <code>POST /api/chat</code> endpoint</li>
                      <li>• Context & transcript compiler</li>
                      <li>• Multi-model retry fallback</li>
                      <li>• Strict JSON response validation</li>
                      <li>• Production static file server</li>
                    </ul>
                  </div>

                  {/* Block 4: Gemini Coach Agent */}
                  <div
                    onClick={() => setSelectedNode('agent')}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedNode === 'agent'
                        ? 'border-purple-500 bg-purple-50/60 shadow-xs ring-2 ring-purple-500/20'
                        : 'border-stone-200 bg-stone-50/70 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 text-purple-700 mb-2">
                      <Cpu className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">4. AI Agent</span>
                    </div>
                    <h4 className="text-xs font-semibold text-stone-900">Gemini 3.8 Flash</h4>
                    <ul className="mt-2 space-y-1 text-[11px] text-stone-600">
                      <li>• <strong>Persona:</strong> Supportive Student Coach</li>
                      <li>• <strong>Anti-Apology Rule:</strong> No self-deprecation</li>
                      <li>• <strong>Zero Fabrication:</strong> Only real evidence</li>
                      <li>• <strong>JSON Schema:</strong> 4 structured channels</li>
                      <li>• <strong>Bracket Marker:</strong> <code>[Unconfirmed]</code></li>
                    </ul>
                  </div>
                </div>

                {/* Pipeline Flow Arrows Description */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-2">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-stone-700">Forward Flow:</span>
                    <span>Student Inputs</span>
                    <ArrowRight className="w-3 h-3 text-stone-400 inline" />
                    <span>Client State</span>
                    <ArrowRight className="w-3 h-3 text-stone-400 inline" />
                    <span>Express `/api/chat`</span>
                    <ArrowRight className="w-3 h-3 text-stone-400 inline" />
                    <span>Gemini Coach Agent</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-stone-700">Return Channel:</span>
                    <span>Structured JSON</span>
                    <ArrowRight className="w-3 h-3 text-stone-400 inline" />
                    <span>Simultaneous Letter, Checklist & Coaching Notes Update</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Selected Node Inspector */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
                {selectedNode === 'agent' && (
                  <div>
                    <div className="flex items-center space-x-2 text-purple-700 mb-2">
                      <Cpu className="w-4 h-4" />
                      <h4 className="font-semibold text-stone-900 text-sm">
                        AI Coach Agent Engine (`@google/genai` on Gemini 3.8 Flash)
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      The agent acts as a pedagogical mentor for students lacking traditional corporate resumes. Rather than fabricating credentials or generating generic cover-letter fluff, the agent operates under strict behavioral boundaries to surface transferable academic evidence.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                        <span className="font-bold text-purple-900 block mb-1">Transferable Translation</span>
                        <p className="text-purple-800 text-[11px] leading-relaxed">
                          Converts class assignments (e.g. surveys, lab reports, Python tools) and campus involvement (club promotions, cashiering) into evidence of initiative, teamwork, and technical capability.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                        <span className="font-bold text-amber-900 block mb-1">Zero-Apology Guardrail</span>
                        <p className="text-amber-800 text-[11px] leading-relaxed">
                          Strictly forbids deprecating statements like "Although I have no experience...". The letter leads with strengths, coursework, and problem solving.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                        <span className="font-bold text-emerald-900 block mb-1">Stand-Behind Verification</span>
                        <p className="text-emerald-800 text-[11px] leading-relaxed">
                          Produces a companion verification checklist itemizing every claim or bracketed detail so the student can explain and defend every sentence during interviews.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode === 'client' && (
                  <div>
                    <div className="flex items-center space-x-2 text-indigo-700 mb-2">
                      <Layers className="w-4 h-4" />
                      <h4 className="font-semibold text-stone-900 text-sm">
                        Client Presentation & Interaction Layer (React 19 SPA)
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      A multi-panel workspace designed to balance interactive coaching conversation with document drafting and claim auditing.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="font-bold text-stone-800 block text-[11px]">ChatCoach.tsx</span>
                        <p className="text-stone-500 text-[10px] mt-0.5">
                          Streamed dialogue, stage tracker, and interactive question chips.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="font-bold text-stone-800 block text-[11px]">LetterEditor.tsx</span>
                        <p className="text-stone-500 text-[10px] mt-0.5">
                          Direct editing, live word-count health check, bracket detection, quick revisions.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="font-bold text-stone-800 block text-[11px]">VerificationPanel.tsx</span>
                        <p className="text-stone-500 text-[10px] mt-0.5">
                          Interactive checkbox checklist for unverified claims with rationale.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="font-bold text-stone-800 block text-[11px]">CoachingNotesPanel.tsx</span>
                        <p className="text-stone-500 text-[10px] mt-0.5">
                          Requirement-to-evidence matrix and employer perspective breakdown.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode === 'backend' && (
                  <div>
                    <div className="flex items-center space-x-2 text-emerald-700 mb-2">
                      <Server className="w-4 h-4" />
                      <h4 className="font-semibold text-stone-900 text-sm">
                        Server Layer (Node.js + Express 4)
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3">
                      Secures the Gemini API key within the Cloud Run container environment, preventing client-side credential exposure. Bundled with esbuild into CommonJS (`dist/server.cjs`) for fast boot times and production execution.
                    </p>
                    <div className="bg-stone-900 text-stone-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
                      <p className="text-stone-400">// Server Endpoint Pipeline:</p>
                      <p>POST /api/chat -&gt; Validate Payload -&gt; Assemble Context -&gt; Call Gemini</p>
                      <p className="text-stone-400">// Automatic Model Fallback Sequence:</p>
                      <p className="text-emerald-400">gemini-3.8-flash -&gt; gemini-flash-latest -&gt; gemini-3.1-flash-lite</p>
                    </div>
                  </div>
                )}

                {selectedNode === 'user' && (
                  <div>
                    <div className="flex items-center space-x-2 text-amber-700 mb-2">
                      <User className="w-4 h-4" />
                      <h4 className="font-semibold text-stone-900 text-sm">
                        Student Input & Discovery Cycle
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3">
                      Students can either provide their own raw materials or load realistic preset scenarios. The coach proactively prompts for unexpressed achievements when resume gaps exist.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="font-bold text-stone-800 block text-[11px]">Focused Questioning</span>
                        <p className="text-stone-500 text-[10px] mt-0.5">
                          Limits discovery inquiries to a maximum of 3 targeted prompts to avoid overwhelming students.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="font-bold text-stone-800 block text-[11px]">Pre-loaded Case Studies</span>
                        <p className="text-stone-500 text-[10px] mt-0.5">
                          Instant access to sample marketing, SWE, and operations student journeys.
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                        <span className="font-bold text-stone-800 block text-[11px]">Instant Feedback Loop</span>
                        <p className="text-stone-500 text-[10px] mt-0.5">
                          Draft revisions update live in under 2 seconds via JSON parsing.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'agent-spec' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Core Guardrails & Boundary Verification</h4>
                  <p className="mt-1 leading-relaxed text-amber-900/90">
                    The agent is governed by immutable system instructions guaranteeing honesty, ethical framing, and authentic student ownership over their claims.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900 flex items-center space-x-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Approved Agent Behaviors</span>
                  </span>
                  <ul className="space-y-1.5 text-stone-600 text-[11px]">
                    <li>✓ Surface evidence from coursework projects, lab assignments, and group papers.</li>
                    <li>✓ Connect club event promotion, flyer creation, and social outreach to marketing roles.</li>
                    <li>✓ Translate customer service and cashiering into dependability and conflict resolution.</li>
                    <li>✓ Mark unconfirmed specifics in clear brackets: <code>[Course Code]</code>, <code>[Hiring Team]</code>.</li>
                    <li>✓ Frame all student skills with confidence, keeping output strictly to one standard page.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900 flex items-center space-x-1.5 text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Strictly Forbidden Actions</span>
                  </span>
                  <ul className="space-y-1.5 text-stone-600 text-[11px]">
                    <li>✕ NEVER invent metrics, awards, positions, or fabricated company facts.</li>
                    <li>✕ NEVER turn basic project participation into false claims of leadership.</li>
                    <li>✕ NEVER apologize for limited experience (e.g. "Despite my lack of experience...").</li>
                    <li>✕ NEVER guarantee interviews, offers, or ATS screening bypasses.</li>
                    <li>✕ NEVER request sensitive personal data (SSN, home addresses, credentials).</li>
                  </ul>
                </div>
              </div>

              {/* Lifecycle Stages */}
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <h4 className="font-semibold text-stone-900 text-xs mb-3">
                  Conversation & Coaching Lifecycle Stages
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="font-bold text-amber-800 text-[11px] block">1. Discovery</span>
                    <span className="text-[10px] text-amber-700">Collects job posting & student background</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="font-bold text-blue-800 text-[11px] block">2. Brainstorming</span>
                    <span className="text-[10px] text-blue-700">Asks up to 3 questions & maps skills</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-800 text-[11px] block">3. Draft Ready</span>
                    <span className="text-[10px] text-emerald-700">Generates 1-page letter & checklist</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                    <span className="font-bold text-purple-800 text-[11px] block">4. Reviewing</span>
                    <span className="text-[10px] text-purple-700">Adjusts tone, formality & length</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data-flow' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                The Express server instructs Gemini using <code>responseMimeType: "application/json"</code>. This separates conversational dialogue from editable document drafts and validation items.
              </p>

              <div className="bg-stone-900 text-stone-100 rounded-xl p-4 font-mono text-[11px] leading-relaxed overflow-x-auto shadow-inner border border-stone-800">
                <pre>{`// Backend response contract from Gemini Agent:
{
  "reply": "Conversational coach feedback explaining transferable skills...",
  "stage": "discovery" | "brainstorming" | "draft_ready" | "reviewing",
  
  // Structured cover letter draft
  "letterDraft": {
    "recipientInfo": "Hiring Team / Company Name",
    "subjectLine": "Application for [Role Title] - [Student Name]",
    "opening": "Opening paragraph stating role, major, and interest",
    "bodyParagraphs": [
      "Paragraph connecting coursework/project evidence to requirements",
      "Paragraph connecting club/transferable skills to requirements"
    ],
    "motivation": "Specific company mission or project interest",
    "closing": "Professional sign-off",
    "fullFormattedLetter": "Complete formatted 1-page letter text..."
  },

  // Stand-behind claim verification
  "verificationChecklist": [
    {
      "id": "v1",
      "item": "Specific statement or bracketed claim to verify",
      "reason": "Why verifying this matters for interview preparedness",
      "verified": false
    }
  ],

  // Coaching notes kept separate from letter draft
  "coachingNotes": {
    "identifiedRequirements": ["Requirement 1", "Requirement 2"],
    "skillsMapping": [
      {
        "requirement": "Internship requirement",
        "studentEvidence": "Coursework project or club contribution",
        "whyItCounts": "Why recruiters value this transferable experience"
      }
    ],
    "confidenceTip": "Empowering insight on student projects",
    "nextStepAdvice": "Concrete next action"
  }
}`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span className="hidden sm:inline">
            Model: <strong>gemini-3.8-flash</strong> • Runtime: Cloud Run Container • Port: 3000
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
