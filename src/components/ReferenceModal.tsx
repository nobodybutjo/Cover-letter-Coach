import React, { useState } from 'react';
import { X, Check, FileText, UserCheck, AlertCircle } from 'lucide-react';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobDescription: string;
  studentBackground: string;
  onSave: (jobDesc: string, background: string) => void;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({
  isOpen,
  onClose,
  jobDescription,
  studentBackground,
  onSave,
}) => {
  const [localJob, setLocalJob] = useState(jobDescription);
  const [localBackground, setLocalBackground] = useState(studentBackground);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localJob, localBackground);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-semibold text-stone-900 text-base">
              Internship Details & Student Background
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Paste your target job description and your real experiences (coursework, projects, clubs, or part-time work).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Job Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Internship Job Description</span>
              </label>
              <span className="text-[11px] text-stone-400">
                {localJob.length} characters
              </span>
            </div>
            <textarea
              id="input-job-description"
              rows={6}
              value={localJob}
              onChange={(e) => setLocalJob(e.target.value)}
              placeholder="Paste the internship posting, requirements, and responsibilities here (e.g., from Handshake, LinkedIn, or company website)..."
              className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-stone-400 font-sans"
            />
          </div>

          {/* Student Background / Experiences */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-700 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Your Experiences, Coursework & Projects</span>
              </label>
              <span className="text-[11px] text-stone-400">
                {localBackground.length} characters
              </span>
            </div>
            <textarea
              id="input-student-background"
              rows={7}
              value={localBackground}
              onChange={(e) => setLocalBackground(e.target.value)}
              placeholder="List what you've done! Course assignments, class projects you are proud of, student clubs, volunteer work, hobbies, tools you've used (Canva, Excel, Python), or part-time customer service jobs..."
              className="w-full text-xs sm:text-sm p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-stone-400 font-sans"
            />
            <div className="mt-2 flex items-start space-x-2 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <p>
                <strong>Honesty Promise:</strong> The coach will only use confirmed details from what you share. We will never exaggerate your qualifications or claim leadership you didn't have.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-end space-x-3 bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>
          <button
            id="btn-save-reference"
            onClick={handleSave}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Save & Update Coach</span>
          </button>
        </div>
      </div>
    </div>
  );
};
