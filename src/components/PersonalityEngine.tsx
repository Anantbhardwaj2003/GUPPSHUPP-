import React from 'react';
import { PersonaType } from '../types';
import type { PersonaResponse } from '../types';
import { PERSONA_DESCRIPTIONS } from '../constants';
import { Sparkles, ArrowDown, RefreshCw, Wand2, Bot, Zap } from 'lucide-react';

interface PersonalityEngineProps {
  selectedPersona: PersonaType;
  onSelectPersona: (p: PersonaType) => void;
  onGenerate: () => void;
  response: PersonaResponse | null;
  isGenerating: boolean;
  hasMemories: boolean;
}

const PersonalityEngine: React.FC<PersonalityEngineProps> = ({
  selectedPersona,
  onSelectPersona,
  onGenerate,
  response,
  isGenerating,
  hasMemories
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-950 border-l border-slate-800 relative shadow-xl">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-950 z-10 shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-purple-500" />
          Personality Engine
        </h2>
        <p className="text-sm text-slate-400 mt-1">Transform responses using extracted context.</p>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/30 shrink-0">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Select Persona Module
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {(Object.values(PersonaType) as PersonaType[]).map((persona) => (
             <button
                key={persona}
                onClick={() => onSelectPersona(persona)}
                className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                  selectedPersona === persona
                    ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
             >
                {persona}
             </button>
          ))}
        </div>
        
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-6 min-h-[60px] flex items-center">
            <p className="text-xs text-slate-400 italic w-full">
                <span className="font-semibold text-purple-400">Instruction: </span> 
                {PERSONA_DESCRIPTIONS[selectedPersona]}
            </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={!hasMemories || isGenerating}
          className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            !hasMemories
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
              : isGenerating
              ? 'bg-slate-700 text-slate-300 cursor-wait'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : !hasMemories ? (
            "Extract Memories First"
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Response
            </>
          )}
        </button>
      </div>

      {/* Output Comparison */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">
        {response ? (
          <div className="space-y-6 animate-fade-in pb-10">
            {/* Analysis Snippet */}
            <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-3">
                <h4 className="text-xs font-bold text-blue-400 uppercase mb-1 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Engine Analysis
                </h4>
                <p className="text-sm text-blue-200/80 leading-relaxed">{response.analysis}</p>
            </div>

            {/* Comparison Flow */}
            <div className="relative">
                {/* Before Card */}
                <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 opacity-80">
                    <div className="flex justify-between items-center mb-2 border-b border-slate-700/50 pb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                          <Bot className="w-3 h-3" /> Standard Output (No Context)
                        </span>
                        <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-700">Generic</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{response.standardReply}</p>
                </div>
                
                {/* Visual Arrow Connector */}
                <div className="flex justify-center -my-3 relative z-10">
                    <div className="bg-slate-900 rounded-full p-1.5 border border-purple-500/30 shadow-lg shadow-purple-500/10">
                        <ArrowDown className="w-4 h-4 text-purple-400" />
                    </div>
                </div>

                {/* After Card */}
                <div className="bg-gradient-to-b from-purple-900/10 to-indigo-900/10 rounded-xl p-4 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] relative overflow-hidden mt-2">
                     <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                        <Wand2 className="w-24 h-24 text-purple-500" />
                     </div>
                    <div className="flex justify-between items-center mb-2 border-b border-purple-500/20 pb-2 relative z-10">
                        <span className="text-xs font-bold text-purple-300 uppercase flex items-center gap-2">
                          <Sparkles className="w-3 h-3" /> {selectedPersona} Output
                        </span>
                        <span className="text-[10px] text-purple-200 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/20">Memory + Tone</span>
                    </div>
                    <p className="text-sm text-slate-100 leading-relaxed relative z-10 font-medium">
                        {response.personaReply}
                    </p>
                </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
             <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
               <Sparkles className="w-8 h-8 text-slate-500" />
             </div>
             <p className="text-sm text-center max-w-[200px]">Extract memories, then select a persona to see the transformation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityEngine;