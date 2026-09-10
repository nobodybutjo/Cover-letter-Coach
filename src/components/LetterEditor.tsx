import React, { useState, useEffect, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  Edit3,
  AlertTriangle,
  RefreshCw,
  Eye,
  FileCheck,
} from 'lucide-react';
import { LetterDraft } from '../types';

interface LetterEditorProps {
  letterDraft: LetterDraft | null;
  onUpdateDraft: (updatedText: string) => void;
  onRequestRevision: (instruction: string) => void;
  onOpenPrint: () => void;
  isLoading: boolean;
}

export const LetterEditor: React.FC<LetterEditorProps> = ({
  letterDraft,
  onUpdateDraft,
  onRequestRevision,
  onOpenPrint,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [editableText, setEditableText] = useState('');

  // Keep local editable text synced when letterDraft updates from server
  useEffect(() => {
    if (letterDraft?.fullFormattedLetter) {
      setEditableText(letterDraft.fullFormattedLetter);
    }
  }, [letterDraft?.fullFormattedLetter]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditableText(val);
    onUpdateDraft(val);
  };

  const handleCopy = async () => {
    if (!editableText) return;
    try {
      await navigator.clipboard.writeText(editableText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadTxt = () => {
    if (!editableText) return;
    const blob = new Blob([editableText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Identify bracketed placeholders like [Project Name]
  const bracketMatches = useMemo(() => {
    const matches = editableText.match(/\[(.*?)\]/g);
    return matches || [];
  }, [editableText]);

  // Word count calculation
  const wordCount = useMemo(() => {
    const words = editableText.trim().split(/\s+/).filter(Boolean);
    return words.length;
  }, [editableText]);

  // Length health check
  const lengthStatus = useMemo(() => {
    if (wordCount === 0) return { label: 'Empty', color: 'text-stone-400' };
    if (wordCount < 180) return { label: 'A bit brief (Aim for ~250 words)', color: 'text-amber-600' };
    if (wordCount <= 380) return { label: 'Ideal One-Page Length', color: 'text-emerald-600' };
    return { label: 'Slightly long (May spill past 1 page)', color: 'text-orange-600' };
  }, [wordCount]);

  if (!letterDraft && !editableText) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-4 border border-stone-200">
          <Edit3 className="w-7 h-7" />
        </div>
        <h3 className="font-semibold text-stone-800 text-base mb-1">
          No Cover Letter Draft Yet
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mb-5 leading-relaxed">
          Share your internship posting and background with the coach in the left panel, or click below to generate an immediate first draft.
        </p>
        <button
          id="btn-generate-starter-draft"
          onClick={() => onRequestRevision('Please generate an initial tailored cover letter draft based on the materials provided.')}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs sm:text-sm font-medium shadow-xs transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>Draft Cover Letter Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-stone-200 bg-stone-50/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold text-stone-800 flex items-center space-x-1.5">
            <FileCheck className="w-4 h-4 text-indigo-600" />
            <span>Tailored Cover Letter</span>
          </span>
          <span className="text-[11px] text-stone-500">
            {wordCount} words • <strong className={lengthStatus.color}>{lengthStatus.label}</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            id="btn-copy-letter"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-200/70 border border-stone-200 transition-colors"
            title="Copy letter to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            id="btn-download-txt"
            onClick={handleDownloadTxt}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-200/70 border border-stone-200 transition-colors"
            title="Download as text file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            id="btn-print-letter"
            onClick={onOpenPrint}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-200/70 border border-stone-200 transition-colors"
            title="Print or save to PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Bracket Warning Banner (if bracketed placeholders exist) */}
      {bracketMatches.length > 0 && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>{bracketMatches.length} placeholder details</strong> need your specific input (marked in <code>[brackets]</code>).
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-medium hidden sm:inline">
            Edit text directly or verify in the Checklist
          </span>
        </div>
      )}

      {/* Main Letter Content Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-stone-50/40">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xs border border-stone-200/80 p-6 sm:p-8 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 text-stone-400 text-xs">
            <span>STANDARD ONE-PAGE INTERNSHIP LETTER</span>
            <span>{letterDraft?.lastUpdated ? `Drafted ${letterDraft.lastUpdated}` : ''}</span>
          </div>

          <textarea
            id="editable-cover-letter-text"
            value={editableText}
            onChange={handleTextChange}
            placeholder="Your personalized cover letter will appear here..."
            className="w-full flex-1 min-h-[420px] text-xs sm:text-sm text-stone-800 leading-relaxed font-sans resize-none focus:outline-none placeholder:text-stone-400"
            spellCheck="true"
          />
        </div>
      </div>

      {/* Quick Revision Strip */}
      <div className="p-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] text-stone-500 font-medium shrink-0 flex items-center space-x-1">
          <RefreshCw className="w-3 h-3 text-stone-400" />
          <span>Quick Revisions:</span>
        </span>
        <div className="flex gap-1.5 shrink-0">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onRequestRevision('Revise the letter to have a slightly less formal, more authentic and conversational tone.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors disabled:opacity-50"
          >
            Make Less Formal
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onRequestRevision('Highlight my class projects, coursework, and problem-solving examples more clearly.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors disabled:opacity-50"
          >
            Emphasize Coursework
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onRequestRevision('Tighten the letter to be very concise and punchy (under 300 words).')}
            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors disabled:opacity-50"
          >
            Tighter / Under 300 Words
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onRequestRevision('Ensure any unconfirmed claims or missing project details are clearly bracketed.')}
            className="text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-colors disabled:opacity-50"
          >
            Mark Missing Details
          </button>
        </div>
      </div>
    </div>
  );
};
