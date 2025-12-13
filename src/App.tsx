import React, { useState } from 'react';
import { SAMPLE_CONVERSATION } from './constants';
import { PersonaType } from './types';
import type { MemoryData, PersonaResponse, Message } from './types';
import * as geminiService from './services/geminiService';
import ChatColumn from './components/ChatColumn';
import MemoryPanel from './components/MemoryPanel';
import PersonalityEngine from './components/PersonalityEngine';
import LandingPage from './components/LandingPage';
import { Brain, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  // Dashboard State
  const [messages, setMessages] = useState<Message[]>(SAMPLE_CONVERSATION);
  const [memories, setMemories] = useState<MemoryData | null>(null);
  const [persona, setPersona] = useState<PersonaType>(PersonaType.MENTOR);
  const [response, setResponse] = useState<PersonaResponse | null>(null);
  
  // Loading States
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Handlers
  const handleExtractMemories = async () => {
    setIsExtracting(true);
    try {
      const data = await geminiService.extractMemories(messages);
      setMemories(data);
    } catch (error) {
      console.error(error);
      alert("Failed to extract memories. Check API Key configuration.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerateResponse = async () => {
    if (!memories) return;
    setIsGenerating(true);
    try {
      const lastMsg = messages[messages.length - 1];
      const result = await geminiService.generatePersonaResponse(
        lastMsg.content,
        memories,
        persona
      );
      setResponse(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate response. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    setIsSendingMessage(true);
    
    // 1. Add user message
    const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Update chat history immediately
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);

    try {
        // 2. Get standard AI reply to continue flow
        const replyText = await geminiService.continueConversation(messages, text);
        
        const assistantMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, assistantMsg]);

    } catch (error) {
        console.error("Chat error:", error);
    } finally {
        setIsSendingMessage(false);
    }
  };

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (file: File) => {
    setIsProcessingImage(true);
    setResponse(null); // Clear previous response
    setMemories(null); // Clear previous memories
    try {
        const base64 = await fileToBase64(file);
        const extractedMessages = await geminiService.parseChatScreenshot(base64);
        setMessages(extractedMessages);
    } catch (error) {
        console.error(error);
        alert("Failed to parse image. Ensure it is a clear screenshot of text messages.");
    } finally {
        setIsProcessingImage(false);
    }
  };

  // Landing Page
  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('dashboard')} />;
  }

  // Dashboard
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden animate-fade-in">
      
      {/* 1. Chat History Column (Left) */}
      <div className="hidden md:flex md:w-80 flex-shrink-0 border-r border-slate-800 relative">
        <ChatColumn 
            messages={messages} 
            onUpload={handleImageUpload}
            onSendMessage={handleSendMessage}
            isProcessingImage={isProcessingImage}
            isSendingMessage={isSendingMessage}
        />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
         <h1 className="font-bold text-lg text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-500" /> Mind & Persona
         </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <button 
          onClick={() => setView('landing')}
          className="absolute top-4 left-4 z-50 p-2 rounded-full bg-slate-900/50 text-slate-500 hover:text-white hover:bg-slate-800 transition-colors md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* 2. Memory Panel (Center) */}
        <div className="flex-1 border-r border-slate-800 min-w-[300px] overflow-hidden">
          <MemoryPanel 
            memories={memories} 
            isLoading={isExtracting} 
            onExtract={handleExtractMemories} 
          />
        </div>

        {/* 3. Personality Engine (Right) */}
        <div className="h-1/2 md:h-full md:w-96 flex-shrink-0 bg-slate-950 shadow-2xl z-20 border-t md:border-t-0 border-slate-800">
          <PersonalityEngine
            selectedPersona={persona}
            onSelectPersona={setPersona}
            onGenerate={handleGenerateResponse}
            response={response}
            isGenerating={isGenerating}
            hasMemories={!!memories}
          />
        </div>

      </div>
    </div>
  );
};

export default App;