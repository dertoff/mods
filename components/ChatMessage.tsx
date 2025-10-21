
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const BotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect x="4" y="12" width="16" height="8" rx="2" />
        <path d="M2 12h2" /><path d="M20 12h2" /><path d="M12 12v-2" /><path d="M12 20v-4" /><circle cx="12" cy="8" r="2" />
    </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <div className="flex-shrink-0"><BotIcon /></div>}
      
      <div className={`max-w-xl p-4 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
        {message.content ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
            isStreaming && <LoadingSpinner />
        )}
      </div>
      
      {isUser && <div className="flex-shrink-0"><UserIcon /></div>}
    </div>
  );
};

export default ChatMessage;
