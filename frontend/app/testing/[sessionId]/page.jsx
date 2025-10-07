'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef(null);

  const { sessionId } = params;

  // ✅ Load all chat history for sidebar
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    setChatHistory(history);
  }, []);

  // ✅ Load messages for current session
  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem(`chat_${sessionId}`) || '[]');
    setMessages(storedMessages);
  }, [sessionId]);

  // ✅ Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Handle initialMessage from URL
  useEffect(() => {
    const initialMessage = searchParams.get('initialMessage');
    if (initialMessage && messages.length === 0) {
      const decodedMessage = decodeURIComponent(initialMessage);
      const initialUserMessage = { id: Date.now(), text: decodedMessage, sender: 'user' };
      const botMessage = { id: Date.now() + 1, text: `Thinking about "${decodedMessage}"...`, sender: 'bot' };
      const newMessages = [initialUserMessage, botMessage];
      setMessages(newMessages);
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(newMessages));

      // Update chat history
      const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      const updatedHistory = [
        { sessionId, title: decodedMessage, lastUpdated: new Date().toISOString() },
        ...history.filter((c) => c.sessionId !== sessionId),
      ];
      localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
      setChatHistory(updatedHistory);

      router.replace(`/testing/${sessionId}`, { scroll: false });
    }
  }, [searchParams, router, sessionId, messages.length]);

  // ✅ Persist messages whenever they change
  useEffect(() => {
    if (messages.length === 0) return;
    localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));

    // Update metadata
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const title = messages[0]?.text || 'Untitled Chat';
    const updatedHistory = [
      { sessionId, title, lastUpdated: new Date().toISOString() },
      ...chatHistory.filter((c) => c.sessionId !== sessionId),
    ];
    localStorage.setItem('chatHistory', JSON.stringify(updatedHistory));
    setChatHistory(updatedHistory);
  }, [messages, sessionId]);

  // ✅ Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const botMsg = { id: Date.now() + 1, text: 'This is an automated response.', sender: 'bot' };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  // ✅ Switch to another chat
  const handleSelectChat = (id) => {
    router.push(`/testing/${id}`);
  };

  // ✅ Delete chat
  const handleDeleteChat = (id) => {
    localStorage.removeItem(`chat_${id}`);
    const updated = chatHistory.filter((c) => c.sessionId !== id);
    setChatHistory(updated);
    localStorage.setItem('chatHistory', JSON.stringify(updated));

    // If user deleted current chat, redirect to /testing
    if (id === sessionId) router.push('/testing');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ===== Sidebar: Chat History ===== */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-300 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Chats</h2>
          <Link
            href="/testing"
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
          >
            + New
          </Link>
        </div>

        {chatHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">No previous chats.</p>
        ) : (
          <ul className="space-y-1">
            {chatHistory.map((chat) => (
              <li
                key={chat.sessionId}
                className={`flex justify-between items-center rounded-md p-2 cursor-pointer ${
                  chat.sessionId === sessionId
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <span
                  onClick={() => handleSelectChat(chat.sessionId)}
                  className="truncate flex-grow text-left"
                >
                  {chat.title}
                </span>
                <button
                  onClick={() => handleDeleteChat(chat.sessionId)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ===== Main Chat Panel ===== */}
      <div className="flex flex-col flex-1">
        <header className="bg-white text-gray-800 p-4 flex items-center justify-between shadow-md z-10">
          <h1 className="text-xl font-bold">Conversation</h1>
          <Link
            href="/testing"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <span>New Chat</span>
          </Link>
        </header>

        <main className="flex-grow p-4 overflow-y-auto bg-gray-200">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={!inputValue.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
