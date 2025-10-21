
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<{ disabled: boolean }> = ({ disabled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform rotate-90 ${disabled ? 'text-gray-500' : 'text-white'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);


const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [input, adjustTextareaHeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-4 sticky bottom-0">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-3 bg-gray-700 border border-gray-600 rounded-2xl p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="flex-grow bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none resize-none max-h-48 p-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl p-3 flex items-center justify-center transition-colors duration-200"
        >
          <SendIcon disabled={isLoading || !input.trim()} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
