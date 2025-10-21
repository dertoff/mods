
import React, { useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';

interface ChatWindowProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
                <ChatMessage 
                    key={index} 
                    message={msg} 
                    isStreaming={isLoading && index === messages.length - 1} 
                />
            ))}
            {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-lg">Welcome to Gemini Chat!</p>
                    <p>Start a conversation by typing in the box below.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ChatWindow;
