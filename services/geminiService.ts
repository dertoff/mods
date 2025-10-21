
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage } from '../types';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

function getAiInstance() {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export const startChatSession = (history: ChatMessage[]) => {
  const aiInstance = getAiInstance();
  const model = 'gemini-2.5-flash';
  
  // Format history for the API
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  chat = aiInstance.chats.create({
    model: model,
    history: formattedHistory,
  });
};


export const streamChatMessage = async (
  message: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  if (!chat) {
    onError(new Error("Chat session not initialized. Call startChatSession first."));
    return;
  }

  try {
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      onChunk(chunk.text);
    }
    onComplete();
  } catch (error) {
    console.error("Error streaming message:", error);
    onError(error instanceof Error ? error : new Error("An unknown error occurred"));
  }
};
