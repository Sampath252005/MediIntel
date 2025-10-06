// components/ChatInterface.jsx
'use client';

import { useState, useRef, useEffect } from 'react';

// Mock data for chat history
const initialChats = {
  'chat-1': {
    title: 'Welcome Chat',
    messages: [
      { id: 1, text: "Hello! I'm a friendly chatbot here to help you.", sender: 'bot' },
    ],
  },
  'chat-2': {
    title: 'Tailwind CSS Help',
    messages: [
      { id: 1, text: 'How do I center a div?', sender: 'user' },
      { id: 2, text: 'You can use `flex justify-center items-center`.', sender: 'bot' },
    ],
  },
};

const ChatInterface = () => {
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState('chat-1');
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const activeChat = chats[activeChatId];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Toggle sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || !activeChatId) return;

    const newUserMessage = {
      id: activeChat.messages.length + 1,
      text: inputValue,
      sender: 'user',
    };

    const updatedMessages = [...activeChat.messages, newUserMessage];
    const updatedChat = { ...activeChat, messages: updatedMessages };

    setChats((prevChats) => ({
      ...prevChats,
      [activeChatId]: updatedChat,
    }));
    setInputValue('');

    setTimeout(() => {
      const botResponse = {
        id: updatedMessages.length + 2,
        text: 'This is an automated response. How can I assist you further?',
        sender: 'bot',
      };
      setChats((prevChats) => {
        const currentChat = prevChats[activeChatId];
        const messagesWithBot = [...currentChat.messages, botResponse];
        return {
          ...prevChats,
          [activeChatId]: { ...currentChat, messages: messagesWithBot },
        };
      });
    }, 1000);
  };

  const handleNewChat = () => {
    const newChatId = `chat-${Object.keys(chats).length + 1}`;
    const newChat = {
      title: `New Conversation ${Object.keys(chats).length}`,
      messages: [
        { id: 1, text: "You've started a new chat. Ask me anything!", sender: 'bot' },
      ],
    };
    setChats((prevChats) => ({ ...prevChats, [newChatId]: newChat }));
    setActiveChatId(newChatId);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile after starting new chat
  };

  const switchChat = (chatId) => {
    setActiveChatId(chatId);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile after switching
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <h2 className="text-lg font-semibold p-4 text-gray-400">History</h2>
          <nav className="space-y-1 px-2">
            {Object.keys(chats).map((chatId) => (
              <a
                key={chatId}
                href="#"
                onClick={(e) => { e.preventDefault(); switchChat(chatId); }}
                className={`block px-4 py-2 rounded-md truncate ${
                  activeChatId === chatId
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700/50'
                }`}
              >
                {chats[chatId].title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-white text-gray-800 p-4 flex items-center shadow-md z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold ml-4">{activeChat?.title || 'Chatbot Assistant'}</h1>
        </header>

        {/* Messages */}
        <main className="flex-grow p-4 overflow-y-auto bg-gray-200">
          <div className="space-y-4">
            {activeChat?.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${message.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Form */}
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatInterface;