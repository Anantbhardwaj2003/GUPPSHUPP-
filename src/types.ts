export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MemoryData {
  preferences: string[];
  emotionalPatterns: string[];
  facts: string[];
}

export const PersonaType = {
  STANDARD: 'Standard AI',
  MENTOR: 'Calm Mentor',
  WITTY: 'Witty Friend',
  THERAPIST: 'Therapist',
  PIRATE: 'Space Pirate',
} as const;

export type PersonaType = typeof PersonaType[keyof typeof PersonaType];

export interface PersonaResponse {
  standardReply: string;
  personaReply: string;
  analysis: string; // Reasoning behind the transformation
}

export interface ProcessingState {
  isExtractingMemories: boolean;
  isGeneratingResponse: boolean;
}