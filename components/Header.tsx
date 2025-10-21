
import React from 'react';

const BotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect x="4" y="12" width="16" height="8" rx="2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M12 12v-2" />
        <path d="M12 20v-4" />
        <circle cx="12" cy="8" r="2" />
    </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-md p-4 flex items-center justify-center sticky top-0 z-10">
      <BotIcon />
      <h1 className="text-2xl font-bold text-gray-100 ml-3">Gemini Chat</h1>
    </header>
  );
};

export default Header;
