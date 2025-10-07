'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    setChatHistory(storedChats);
  }, []);

  const handleStartChat = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const sessionId = Date.now().toString();
    const newChat = {
      sessionId,
      title: inputValue,
      lastUpdated: new Date().toISOString(),
    };

    // Store in localStorage
    const updatedChats = [newChat, ...chatHistory];
    setChatHistory(updatedChats);
    localStorage.setItem('chatHistory', JSON.stringify(updatedChats));

    router.push(`/testing/${sessionId}?initialMessage=${encodeURIComponent(inputValue)}`);
  };

  const handleOpenChat = (sessionId) => {
    router.push(`/testing/${sessionId}`);
  };

  const handleDeleteChat = (sessionId) => {
    const updatedChats = chatHistory.filter((chat) => chat.sessionId !== sessionId);
    setChatHistory(updatedChats);
    localStorage.setItem('chatHistory', JSON.stringify(updatedChats));
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Chat with AI
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Enter a prompt below to start a new conversation.
        </p>

        <form onSubmit={handleStartChat} className="flex items-center w-full bg-white shadow-lg rounded-full p-2 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-grow p-4 bg-transparent text-lg text-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
            disabled={!inputValue.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>

        {/* Chat History Section */}
        <div className="bg-white shadow-lg rounded-lg p-4 text-left">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Chats</h2>
          {chatHistory.length === 0 ? (
            <p className="text-gray-500">No previous chats found.</p>
          ) : (
            <ul className="space-y-2">
              {chatHistory.map((chat) => (
                <li key={chat.sessionId} className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg cursor-pointer">
                  <span onClick={() => handleOpenChat(chat.sessionId)} className="text-gray-800 truncate flex-grow text-left">
                    {chat.title}
                  </span>
                  <button
                    onClick={() => handleDeleteChat(chat.sessionId)}
                    className="text-red-500 hover:text-red-700 ml-3"
                    title="Delete chat"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
