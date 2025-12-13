import React, { useRef, useEffect, useState } from 'react';
import type { Message } from '../types';
import { Upload, FileImage, Loader2, Send } from 'lucide-react';

interface ChatColumnProps {
  messages: Message[];
  onUpload: (file: File) => void;
  onSendMessage: (text: string) => void;
  isProcessingImage: boolean;
  isSendingMessage: boolean;
}

const ChatColumn: React.FC<ChatColumnProps> = ({ 
  messages, 
  onUpload, 
  onSendMessage, 
  isProcessingImage,
  isSendingMessage 
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSendingMessage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isSendingMessage) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      
      {/* Header with Upload Action */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 flex justify-between items-start shrink-0">
        <div>
           <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Conversation</h2>
           <p className="text-xs text-slate-500 mt-1">{messages.length} Messages Loaded</p>
        </div>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingImage}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              isProcessingImage 
                ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-wait' 
                : 'bg-slate-800 hover:bg-slate-700 text-primary-400 border-slate-700 hover:border-primary-500/50'
            }`}
          >
            {isProcessingImage ? (
               <>
                 <Loader2 className="w-3 h-3 animate-spin" /> Scanning...
               </>
            ) : (
               <>
                 <Upload className="w-3 h-3" /> Upload Chat Img
               </>
            )}
          </button>
        </div>
      </div>
      
      {/* Processing Overlay (Upload) */}
      {isProcessingImage && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
            <p className="text-sm text-slate-300 font-medium">Transcribing conversation...</p>
            <p className="text-xs text-slate-500 mt-1">Analyzing text bubbles via Gemini Vision</p>
        </div>
      )}
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
        {messages.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
              <FileImage className="w-12 h-12 mb-2" />
              <p className="text-sm">Upload a screenshot to begin</p>
           </div>
        ) : (
            messages.map((msg, idx) => (
            <div
                key={msg.id || idx}
                className={`flex flex-col max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
            >
                <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none'
                }`}
                >
                {msg.content}
                </div>
                <span className="text-[10px] text-slate-600 mt-1 px-1">
                {msg.timestamp}
                </span>
            </div>
            ))
        )}
        
        {isSendingMessage && (
           <div className="mr-auto flex items-center gap-2 p-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-600 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-slate-600 animate-bounce delay-200"></span>
              </div>
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to continue chat..."
            disabled={isSendingMessage || isProcessingImage}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-slate-600 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSendingMessage || isProcessingImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-500 disabled:opacity-0 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatColumn;