import { GoogleGenAI, Type } from "@google/genai";
import type { Schema } from "@google/genai";
import type { Message, MemoryData, PersonaResponse } from '../types';
import { PersonaType } from '../types';
import { PERSONA_DESCRIPTIONS } from '../constants';

// Initialize Gemini Client
const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// 3. Image Parsing Service
export const parseChatScreenshot = async (base64Image: string): Promise<Message[]> => {
  const ai = getClient();
  
  const prompt = `
    You are a transcription assistant. 
    Analyze the provided image, which is a screenshot of a chat conversation (e.g., iMessage, WhatsApp, Slack).
    
    Task:
    1. Transcribe the text bubbles into a structured JSON array.
    2. Identify the 'user' (usually on the right side, or 'me') and the 'assistant' or 'other person' (usually on the left side).
    3. If timestamps are visible, include them. If not, generate plausible relative timestamps starting from '10:00 AM'.
    4. Limit to the most recent 30 messages if the conversation is long.
    5. Maintain the chronological order.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        role: { type: Type.STRING, enum: ['user', 'assistant'] },
        content: { type: Type.STRING },
        timestamp: { type: Type.STRING }
      },
      required: ["id", "role", "content", "timestamp"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { 
          role: 'user', 
          parts: [
            { text: prompt },
            { 
              inlineData: {
                mimeType: "image/png", 
                data: base64Image
              }
            }
          ] 
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");
    
    const parsedMessages = JSON.parse(jsonText) as Message[];
    return parsedMessages.map((msg, idx) => ({
      ...msg,
      id: msg.id || `imported-${idx}`
    }));

  } catch (error) {
    console.error("Error parsing chat screenshot:", error);
    throw error;
  }
};

// 4. Continue Conversation Service
export const continueConversation = async (history: Message[], newMessage: string): Promise<string> => {
  const ai = getClient();
  
  const chatHistory = history.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: chatHistory
  });

  try {
    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Error continuing conversation:", error);
    throw error;
  }
};

// 1. Memory Extraction Service
export const extractMemories = async (messages: Message[]): Promise<MemoryData> => {
  const ai = getClient();
  const conversationText = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');


  const prompt = `
    Analyze the following conversation history (30 messages) to build a dynamic user profile.
    
    Perform the following reasoning steps:
    1. Scan for explicit facts (Names, medical history, possessions).
    2. Deduce implicit preferences (e.g., if they hate treadmills and like trails, they prefer "Outdoor/Nature" environments).
    3. Analyze emotional tone to construct a personality profile (e.g., detect "Perfectionism" from fear of failure).

    Output a structured JSON object with these exact categories:
    1. preferences: Inferred or explicit likes/dislikes.
    2. emotionalPatterns: Psychological observations about the user's state.
    3. facts: Concrete, verifiable details.
    
    Conversation Log:
    ${conversationText}
  `;

  // STRUCTURED OUTPUT PARSING:
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      preferences: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of inferred user preferences",
      },
      emotionalPatterns: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of psychological observations or personality traits",
      },
      facts: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of hard facts (names, injuries, dates, etc.)",
      },
    },
    required: ["preferences", "emotionalPatterns", "facts"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");
    
    return JSON.parse(jsonText) as MemoryData;
  } catch (error) {
    console.error("Error extracting memories:", error);
    throw error;
  }
};

// 2. Personality Engine Service
export const generatePersonaResponse = async (
  lastMessage: string,
  memories: MemoryData,
  persona: PersonaType
): Promise<PersonaResponse> => {
  const ai = getClient();
  const personaDesc = PERSONA_DESCRIPTIONS[persona];

  // MEMORY INTEGRATION:
  const memoriesContext = `
    USER PREFERENCES: ${memories.preferences.join(', ')}
    USER EMOTIONAL PATTERNS: ${memories.emotionalPatterns.join(', ')}
    USER FACTS: ${memories.facts.join(', ')}
  `;

  const prompt = `
    You are an advanced AI agent with a "Personality Engine".
    
    CONTEXT:
    The user just sent this message: "${lastMessage}"
    You have the following extracted memories about this user:
    ${memoriesContext}

    TASK:
    Generate a JSON object containing two responses and a brief analysis.
    
    1. 'standardReply': A standard, helpful AI assistant response. It should be polite and correct, but GENERIC. Do NOT use the specific extracted memories (like the dog's name or specific music genres) unless explicitly mentioned in the last message. It represents a "Context-Light" or "Standard LLM" response.
    2. 'personaReply': A response that strictly adheres to the '${persona}' persona. 
       - Persona Description: "${personaDesc}"
       - The response MUST heavily incorporate the user's memories (preferences, facts, emotions) to show deep understanding (e.g. referencing the knee injury, the dog Buster, or the dislike of treadmills if relevant).
    3. 'analysis': Explain specifically what changed. Mention the tone shift AND which specific memory was retrieved to personalize the second response.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      standardReply: { type: Type.STRING },
      personaReply: { type: Type.STRING },
      analysis: { type: Type.STRING },
    },
    required: ["standardReply", "personaReply", "analysis"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.8,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from Gemini");

    return JSON.parse(jsonText) as PersonaResponse;
  } catch (error) {
    console.error("Error generating persona response:", error);
    throw error;
  }
};