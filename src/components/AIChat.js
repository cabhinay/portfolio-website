import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChat({ theme, closeAIMode }) {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hey 👋 I'm Abhinay's AI assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick navigation buttons based on the second screenshot
  const quickButtons = [
    { label: 'Me', icon: '👤' },
    { label: 'Projects', icon: '💼' },
    { label: 'Skills', icon: '🛠️' },
    { label: 'Fun', icon: '🎮' },
    { label: 'Contact', icon: '✉️' }
  ];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message with animation
    setMessages(prev => [...prev, { type: 'user', text: inputValue }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Clear input immediately
    const userInput = inputValue;
    setInputValue('');
    
    // Simulate AI response (in a real app, you'd call an API here)
    setTimeout(() => {
      setIsTyping(false);
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            type: 'bot', 
            text: `Thanks for your message! This is a demo of the AI chat interface. In a real implementation, I'd respond to "${userInput}" with actual information about Abhinay.` 
          }
        ]);
      }, 200); // Small delay after typing indicator disappears
    }, 1500);
  };

  const handleQuickButtonClick = (button) => {
    setMessages(prev => [...prev, { type: 'user', text: `Tell me about ${button.label}` }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response based on button clicked
    setTimeout(() => {
      setIsTyping(false);
      
      setTimeout(() => {
        let response = '';
        switch (button.label) {
          case 'Me':
            response = "Abhinay is a full-stack developer with expertise in modern web technologies. He has experience working with React, Node.js, and various other frameworks.";
            break;
          case 'Projects':
            response = "Abhinay has worked on various exciting projects including web applications, mobile apps, and data visualization tools.";
            break;
          case 'Skills':
            response = "Abhinay is proficient in JavaScript, React, Node.js, Python, and many other technologies. He's also experienced with cloud platforms and CI/CD pipelines.";
            break;
          case 'Fun':
            response = "Outside of coding, Abhinay enjoys hiking, photography, and exploring new technologies.";
            break;
          case 'Contact':
            response = "You can reach out to Abhinay through email or connect with him on LinkedIn. Would you like his contact details?";
            break;
          default:
            response = "I'd be happy to tell you more about that topic!";
        }
        setMessages(prev => [...prev, { type: 'bot', text: response }]);
      }, 200);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex flex-col ${theme === 'dark' ? 'bg-black' : 'bg-light-bg'}`}
    >
      {/* Animated Background Elements - No blurs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {theme === 'dark' ? (
          <>
            <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10 animate-float bg-gradient-to-br from-primary to-blue-500"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-10 animate-pulse-slow bg-gradient-to-br from-purple-500 to-primary"></div>
            <div className="absolute top-40 left-10 w-64 h-64 rounded-2xl bg-gray-800/10"></div>
            <div className="absolute bottom-40 right-10 w-48 h-48 rounded-2xl bg-gray-800/10"></div>
          </>
        ) : (
          <>
            {/* Very subtle gradient background elements for light mode */}
            <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-blue-500/5"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/5 to-primary/5"></div>
          </>
        )}
      </div>
      {/* Header - No backdrop blur */}
      <div className={`p-4 flex items-center justify-between ${
        theme === 'dark' 
          ? 'bg-gray-900 border-b border-gray-800/50 shadow-md shadow-black/10' 
          : 'bg-white border-b border-gray-200 shadow-md'
      }`}>
        <div className="flex items-center">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 rounded-xl overflow-hidden mr-3 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            }}
          >
            {/* Avatar image - replace with your actual avatar */}
            <div className="w-full h-full flex items-center justify-center text-xl text-white">
              �‍💻
            </div>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              AI Portfolio
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Hey, I'm Abhinay <span className="animate-wave inline-block">👋</span>
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(243, 244, 246, 0.8)' }}
          whileTap={{ scale: 0.9 }}
          onClick={closeAIMode}
          className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50' 
              : 'bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200/50'
          } transition-colors`}
        >
          <span className="text-xl">✕</span>
        </motion.button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`mb-4 max-w-[80%] ${message.type === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              {message.type === 'user' ? (
                // User message - right side
                <div className="flex items-end justify-end gap-2">
                  <div 
                    className={`p-3 rounded-2xl ${
                      theme === 'dark' 
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/20' 
                        : 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg shadow-primary/20'
                    }`}
                  >
                    {message.text}
                  </div>
                  
                  <div 
                    className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${
                      theme === 'dark' ? 'bg-blue-500/30' : 'bg-blue-500/20'
                    } flex items-center justify-center`}
                  >
                    <span className="text-xs">👤</span>
                  </div>
                </div>
              ) : (
                // Bot message - left side
                <div className="flex items-end gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${
                      theme === 'dark' ? 'bg-primary/30' : 'bg-primary/20'
                    } flex items-center justify-center`}
                  >
                    <span className="text-xs">🤖</span>
                  </div>
                  
                  <div 
                    className={`p-3 rounded-2xl ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-white border border-gray-700/50 shadow-lg shadow-black/10' 
                        : 'bg-white text-gray-800 border border-gray-200/50 shadow-lg shadow-black/5'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-4 max-w-[80%] mr-auto"
            >
              <div className="flex items-end gap-2">
                <div 
                  className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${
                    theme === 'dark' ? 'bg-primary/30' : 'bg-primary/20'
                  } flex items-center justify-center`}
                >
                  <span className="text-xs">🤖</span>
                </div>
                
                <div 
                  className={`px-4 py-3 rounded-2xl ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-white border border-gray-700/50' 
                      : 'bg-white text-gray-800 border border-gray-200/50'
                  }`}
                >
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 rounded-full bg-primary/70 animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-2 h-2 rounded-full bg-primary/70 animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-2 h-2 rounded-full bg-primary/70 animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick navigation buttons - No backdrop blur */}
      <div className={`px-4 py-3 flex justify-around ${
        theme === 'dark' 
          ? 'bg-gray-900 border-t border-gray-800/50 shadow-inner' 
          : 'bg-white border-t border-gray-200 shadow-inner'
      }`}>
        {quickButtons.map((button, index) => (
          <motion.button
            key={index}
            whileHover={{ 
              scale: 1.1, 
              y: -3,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickButtonClick(button)}
            className={`relative flex flex-col items-center p-3 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700/30 hover:border-primary/40' 
                : 'bg-white border border-gray-200/50 hover:border-primary/40'
            } transition-all duration-300`}
            style={{ 
              boxShadow: theme === 'dark' 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
            }}
          >
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300`}></div>
            <span className="text-2xl relative z-10">{button.icon}</span>
            <span className="text-xs mt-1 font-medium relative z-10">{button.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Input area */}
      <form 
        onSubmit={handleSend}
        className={`p-4 flex gap-3 ${
          theme === 'dark' 
            ? 'bg-gray-900/90 backdrop-blur-lg border-t border-gray-800/50' 
            : 'bg-white border-t border-gray-200'
        }`}
      >
        <div className="flex-1 relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className={`w-full pl-4 pr-10 py-3.5 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white border border-gray-700/50 focus:border-primary/70 placeholder-gray-500' 
                : 'bg-gray-100 text-gray-900 border border-gray-200 focus:border-primary/70 placeholder-gray-400'
            } outline-none transition-all duration-300 shadow-lg`}
            style={{
              boxShadow: theme === 'dark'
                ? '0 4px 10px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                : '0 4px 10px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(0, 0, 0, 0.03)'
            }}
          />
          {inputValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setInputValue('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
            >
              ✕
            </motion.button>
          )}
        </div>
        
        <motion.button
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3), 0 4px 6px -2px rgba(79, 70, 229, 0.2)'
          }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-gradient-to-r from-primary to-blue-600 text-white p-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center min-w-[48px]"
          disabled={!inputValue.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13"></path>
            <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
          </svg>
        </motion.button>
      </form>
    </motion.div>
  );
}
