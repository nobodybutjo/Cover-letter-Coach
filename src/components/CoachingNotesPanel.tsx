import React from 'react';
import { Lightbulb, Target, Sparkles, CheckCircle2, Compass } from 'lucide-react';
import { CoachingNotes } from '../types';

interface CoachingNotesPanelProps {
  notes: CoachingNotes | null;
}

export const CoachingNotesPanel: React.FC<CoachingNotesPanelProps> = ({ notes }) => {
  if (!notes) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3 border border-amber-200">
          <Lightbulb className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-stone-800 text-sm mb-1">
          Coaching Analysis & Evidence Map
        </h3>
        <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
          As you chat with the coach and generate drafts, this panel breaks down exactly why your coursework, projects, and clubs count as valuable evidence.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-semibold text-stone-800">
            Coaching Notes & Transferable Skills
          </span>
        </div>
        <span className="text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
          Evidence Mapping
        </span>
      </div>

      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5">
        {/* Confidence Tip */}
        {notes.confidenceTip && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/90 to-orange-50/70 border border-amber-200/80 shadow-xs">
            <div className="flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-950 uppercase tracking-wider">
                  Confidence Booster
                </h4>
                <p className="text-xs sm:text-sm text-stone-800 mt-1 leading-relaxed">
                  {notes.confidenceTip}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Identified Internship Requirements */}
        {notes.identifiedRequirements && notes.identifiedRequirements.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-stone-700 flex items-center space-x-1.5 mb-2.5">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Target Role Core Requirements</span>
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {notes.identifiedRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 flex items-start space-x-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Mapping Table / Cards */}
        {notes.skillsMapping && notes.skillsMapping.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-stone-700 flex items-center space-x-1.5 mb-2.5">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>How Your Experiences Map to the Role</span>
            </h4>
            <div className="space-y-3">
              {notes.skillsMapping.map((mapItem, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-stone-200/80 bg-white hover:border-stone-300 transition-colors shadow-2xs space-y-2 text-xs"
                >
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block mb-0.5">
                      Internship Requirement
                    </span>
                    <p className="font-semibold text-stone-900">{mapItem.requirement}</p>
                  </div>

                  <div className="pl-2 border-l-2 border-emerald-400 my-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                      Your Evidence (Coursework / Project / Club)
                    </span>
                    <p className="text-stone-700">{mapItem.studentEvidence}</p>
                  </div>

                  <div className="bg-stone-50 p-2 rounded-lg text-stone-600 text-[11px] leading-relaxed">
                    <strong className="text-stone-800">Why recruiters value this:</strong> {mapItem.whyItCounts}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practical Next Step */}
        {notes.nextStepAdvice && (
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
            <strong className="text-stone-900 block mb-1">Recommended Next Step:</strong>
            <p className="leading-relaxed">{notes.nextStepAdvice}</p>
          </div>
        )}
      </div>
    </div>
  );
};
