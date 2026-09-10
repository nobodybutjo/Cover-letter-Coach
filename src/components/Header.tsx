import React from 'react';
import { Sparkles, FileText, RotateCcw, BookOpen, Layers, Info } from 'lucide-react';
import { EXAMPLE_SCENARIOS } from '../data/exampleScenarios';
import { ExampleScenario } from '../types';

interface HeaderProps {
  onSelectScenario: (scenario: ExampleScenario) => void;
  onOpenReferenceModal: () => void;
  onOpenSystemDiagram: () => void;
  onReset: () => void;
  hasReferenceData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectScenario,
  onOpenReferenceModal,
  onOpenSystemDiagram,
  onReset,
  hasReferenceData,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Purpose */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold text-stone-900 text-lg tracking-tight">
                Student Cover Letter Coach
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
                Internship Specialist
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden md:block">
              Turn class projects, clubs, and coursework into honest, compelling applications
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Preset Example Scenarios Selector */}
          <div className="relative group">
            <button
              id="btn-sample-cases"
              type="button"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
              title="Load realistic sample student cases"
            >
              <BookOpen className="w-4 h-4 text-stone-500" />
              <span className="hidden sm:inline">Try Sample Cases</span>
              <span className="sm:hidden">Samples</span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-lg border border-stone-200 p-2 hidden group-hover:block group-focus-within:block z-40">
              <p className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Select a Student Journey
              </p>
              {EXAMPLE_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  id={`scenario-opt-${scenario.id}`}
                  onClick={() => onSelectScenario(scenario)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-50 text-xs transition-colors border-b border-stone-100 last:border-0"
                >
                  <p className="font-medium text-stone-900">{scenario.title}</p>
                  <p className="text-stone-500 line-clamp-1 mt-0.5">{scenario.previewSummary}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Reference Materials Button */}
          <button
            id="btn-open-reference"
            onClick={onOpenReferenceModal}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
              hasReferenceData
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Job & Background</span>
            <span className="sm:hidden">Materials</span>
            {hasReferenceData && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block ml-1"></span>
            )}
          </button>

          {/* System & Agent Architecture Diagram Button */}
          <button
            id="btn-open-system-diagram"
            onClick={onOpenSystemDiagram}
            className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            title="View system architecture diagram and agent specifications"
          >
            <Info className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">System Diagram</span>
            <span className="sm:hidden">Info</span>
          </button>

          {/* Reset Session */}
          <button
            id="btn-reset-session"
            onClick={onReset}
            className="inline-flex items-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            title="Start fresh conversation"
          >
            <RotateCcw className="w-4 h-4 sm:mr-1" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
