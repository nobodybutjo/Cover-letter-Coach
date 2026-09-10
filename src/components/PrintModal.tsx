import React from 'react';
import { X, Printer, Check } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterText: string;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, letterText }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
              Print / PDF Document Preview
            </h3>
            <p className="text-xs text-stone-500">
              Formatted clean layout ready to print or save as PDF via your browser.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Preview */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-stone-100 flex justify-center">
          <div
            id="printable-cover-letter"
            className="w-full max-w-xl bg-white p-8 sm:p-10 rounded shadow-md font-serif text-stone-900 leading-relaxed text-sm whitespace-pre-wrap min-h-[500px]"
          >
            {letterText}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between bg-stone-50">
          <span className="text-xs text-stone-500">
            Tip: In the print dialog, select "Save as PDF" to generate a PDF file.
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
