import React from 'react';
import { CheckSquare, Square, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { VerificationItem } from '../types';

interface VerificationPanelProps {
  items: VerificationItem[];
  onToggleItem: (id: string) => void;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  items,
  onToggleItem,
}) => {
  const verifiedCount = items.filter((i) => i.verified).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 100;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-stone-800">
            Claims & Details to Verify
          </span>
        </div>
        {totalCount > 0 && (
          <span className="text-[11px] font-medium text-stone-500">
            {verifiedCount} of {totalCount} verified ({progressPercent}%)
          </span>
        )}
      </div>

      {/* Verification Notice */}
      <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex items-start space-x-3 text-xs text-emerald-900">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Stand Behind Every Statement</p>
          <p className="text-emerald-700/90 mt-0.5 leading-relaxed">
            Honest applications stand out. Review each statement below so you can confidently discuss your real contributions and tools if asked during an interview.
          </p>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-stone-300" />
            <p className="text-sm font-medium text-stone-600">No Pending Claims</p>
            <p className="text-xs text-stone-400 max-w-xs mx-auto mt-1">
              Once a cover letter draft is generated, specific claims and bracketed details that need your verification will be listed here.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                item.verified
                  ? 'bg-stone-50/80 border-stone-200 opacity-75'
                  : 'bg-white border-amber-200/80 hover:border-amber-300 shadow-xs'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-stone-500 hover:text-stone-800 shrink-0 focus:outline-none"
              >
                {item.verified ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-stone-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs sm:text-sm font-medium leading-snug ${
                    item.verified ? 'line-through text-stone-500' : 'text-stone-900'
                  }`}
                >
                  {item.item}
                </p>
                {item.reason && (
                  <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                    <strong>Why verify:</strong> {item.reason}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Progress Footer */}
      {totalCount > 0 && (
        <div className="p-3 bg-stone-50 border-t border-stone-200">
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
