import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, HelpCircle, Loader2, ArrowRight, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface ChatCoachProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  stage?: 'discovery' | 'brainstorming' | 'reviewing' | 'draft_ready';
  onQuickAction?: (promptText: string) => void;
  onOpenSystemDiagram?: () => void;
}

const QUICK_PROMPTS = [
  'Ask me 3 focused questions to discover my hidden project evidence',
  'I have no formal work experience, only coursework and class projects',
  'Please draft a cover letter now with [brackets] for missing details',
  'Can you suggest connections between my experiences and this role?',
  'Make the tone more conversational and natural for a student',
];

export const ChatCoach: React.FC<ChatCoachProps> = ({
  messages,
  isLoading,
  onSendMessage,
  stage = 'discovery',
  onQuickAction,
  onOpenSystemDiagram,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleChipClick = (promptText: string) => {
    if (isLoading) return;
    if (onQuickAction) {
      onQuickAction(promptText);
    } else {
      onSendMessage(promptText);
    }
  };

  const stageLabels: Record<string, { label: string; color: string }> = {
    discovery: { label: 'Step 1: Role & Experience Discovery', color: 'bg-amber-100 text-amber-800' },
    brainstorming: { label: 'Step 2: Connecting Skills & Evidence', color: 'bg-blue-100 text-blue-800' },
    draft_ready: { label: 'Step 3: Cover Letter Drafted', color: 'bg-emerald-100 text-emerald-800' },
    reviewing: { label: 'Step 4: Refinement & Tone Revision', color: 'bg-purple-100 text-purple-800' },
  };

  const currentStage = stageLabels[stage] || stageLabels.discovery;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-stone-800">Coach Dialogue</span>
        </div>
        <div className="flex items-center space-x-2">
          {onOpenSystemDiagram && (
            <button
              type="button"
              onClick={onOpenSystemDiagram}
              className="text-stone-400 hover:text-indigo-600 p-1 rounded hover:bg-stone-200/50 transition-colors"
              title="View Agent & System Architecture"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${currentStage.color}`}>
            {currentStage.label}
          </span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 px-4 text-stone-500">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-stone-800 text-sm">Welcome to your Cover Letter Coaching!</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed">
              Don't worry if you don't have corporate experience. We will dig into your coursework, class projects, clubs, or part-time jobs and translate them into honest proof of your skills.
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-end space-x-2 max-w-[88%]">
                {isAssistant && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mb-1 shadow-xs">
                    C
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-stone-100/90 text-stone-800 rounded-bl-xs border border-stone-200/70'
                      : 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                  }`}
                >
                  {isAssistant ? (
                    <div className="prose prose-stone prose-xs sm:prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-stone-900">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-end space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mb-1 shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-bl-xs bg-stone-100 text-stone-600 text-xs border border-stone-200 flex items-center space-x-2">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="italic text-stone-500">Coach is analyzing your experiences...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question / Action Chips */}
      <div className="p-2.5 bg-stone-50/70 border-t border-stone-200 overflow-x-auto">
        <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 mb-1.5 px-1 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
          <span>Need ideas? Try asking the coach:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleChipClick(prompt)}
              className="shrink-0 text-left px-2.5 py-1 rounded-full bg-white border border-stone-200 text-stone-700 text-xs hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-stone-200 flex items-center space-x-2">
        <input
          id="chat-input-field"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question, confirm an experience, or request revisions..."
          disabled={isLoading}
          className="flex-1 text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-stone-400 disabled:bg-stone-50"
        />
        <button
          id="btn-send-message"
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors shadow-xs"
          title="Send message"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
