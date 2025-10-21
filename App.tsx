
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { startChatSession, streamChatMessage } from './services/geminiService';
import type { ChatMessage } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  useEffect(() => {
    try {
      startChatSession(messages);
      setSessionInitialized(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to initialize chat session.');
    }
  }, []);


  const handleSendMessage = useCallback(async (message: string) => {
    if (!sessionInitialized) {
        setError("Chat session is not ready.");
        return;
    }
    
    setError(null);
    setIsLoading(true);

    const userMessage: ChatMessage = { role: 'user', content: message };
    const modelResponsePlaceholder: ChatMessage = { role: 'model', content: '' };
    
    setMessages(prevMessages => [...prevMessages, userMessage, modelResponsePlaceholder]);

    streamChatMessage(
      message,
      (chunk) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'model') {
            lastMessage.content += chunk;
          }
          return newMessages;
        });
      },
      () => {
        setIsLoading(false);
        // Re-initialize chat with the full new history for context
        setMessages(prev => {
            startChatSession(prev);
            return prev;
        });
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
        setMessages(prev => prev.slice(0, -1)); // Remove placeholder
      }
    );
  }, [sessionInitialized]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      {error && (
        <div className="bg-red-500 text-white p-3 text-center">
          <p>Error: {error}</p>
        </div>
      )}
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
