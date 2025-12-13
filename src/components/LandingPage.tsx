import React from 'react';
import { Brain, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="z-10 text-center px-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-primary-400 mb-4 backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          <span>Next-Gen Contextual AI</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
          Mind & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500">Persona</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          A sophisticated dashboard demonstrating <strong>Memory Extraction</strong> and <strong>Adaptive Personality Engine</strong>. 
          Upload chat screenshots or use sample data to see how AI builds user profiles in real-time.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold mb-2">Chat Analysis</h3>
            <p className="text-sm text-slate-400">Upload raw conversation screenshots (PNG/JPG). We use OCR-free vision AI to transcribe them instantly.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
             <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 text-amber-400">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold mb-2">Memory Core</h3>
            <p className="text-sm text-slate-400">Extracts user facts, preferences, and emotional patterns to build a persistent psychological profile.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
             <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold mb-2">Persona Morphing</h3>
            <p className="text-sm text-slate-400">Transforms standard AI responses into distinct personalities (Mentor, Pirate, Therapist) using extracted memories.</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onGetStarted}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          Get Started
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
        </button>
        
        <p className="text-xs text-slate-600 mt-6">Powered by Google Gemini 2.5 Flash</p>
      </div>
    </div>
  );
};

export default LandingPage;