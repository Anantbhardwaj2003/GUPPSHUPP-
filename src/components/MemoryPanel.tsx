import React from 'react';
import type { MemoryData } from '../types';
import { Brain, Heart, Lightbulb, List } from 'lucide-react';

interface MemoryPanelProps {
  memories: MemoryData | null;
  isLoading: boolean;
  onExtract: () => void;
}

const MemoryCard: React.FC<{ title: string; icon: React.ReactNode; items: string[]; color: string }> = ({ title, icon, items, color }) => (
  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
    <div className={`flex items-center gap-2 mb-3 ${color}`}>
      {icon}
      <h3 className="font-semibold text-sm tracking-wide uppercase">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.length > 0 ? (
        items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.replace('text-', 'bg-')}`}></span>
            <span className="opacity-90">{item}</span>
          </li>
        ))
      ) : (
        <li className="text-slate-600 text-sm italic">No data extracted yet...</li>
      )}
    </ul>
  </div>
);

const MemoryPanel: React.FC<MemoryPanelProps> = ({ memories, isLoading, onExtract }) => {
  return (
    <div className="h-full flex flex-col bg-slate-900/50 overflow-hidden relative">
       {/* Header */}
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary-500" />
            Memory Extraction
          </h2>
          <p className="text-sm text-slate-400 mt-1">Analyzes chat patterns to build a user profile.</p>
        </div>
        <button
          onClick={onExtract}
          disabled={isLoading || !!memories}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            memories
              ? 'bg-green-500/10 text-green-400 cursor-default border border-green-500/20'
              : isLoading
              ? 'bg-slate-700 text-slate-400 cursor-wait'
              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
          }`}
        >
          {isLoading ? 'Analyzing...' : memories ? 'Extraction Complete' : 'Analyze Memories'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!memories && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-60">
            <Brain className="w-16 h-16 stroke-1" />
            <p>Click "Analyze Memories" to process the conversation.</p>
          </div>
        )}

        {isLoading && (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                    <Brain className="absolute inset-0 m-auto w-8 h-8 text-primary-500 animate-pulse" />
                </div>
                <p className="text-slate-400 animate-pulse">Scanning neural patterns...</p>
            </div>
        )}

        {memories && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
             <MemoryCard 
                title="User Preferences" 
                icon={<Heart className="w-4 h-4" />} 
                items={memories.preferences}
                color="text-pink-400"
             />
             <MemoryCard 
                title="Emotional Patterns" 
                icon={<Lightbulb className="w-4 h-4" />} 
                items={memories.emotionalPatterns}
                color="text-amber-400"
             />
             <MemoryCard 
                title="Key Facts" 
                icon={<List className="w-4 h-4" />} 
                items={memories.facts}
                color="text-emerald-400"
             />
          </div>
        )}
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default MemoryPanel;