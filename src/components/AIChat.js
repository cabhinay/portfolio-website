import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../data/data.json';
import AzureOpenAIService from '../services/azure-openai-service';
import formatMessageContent from '../utils/formatMessageContent';
import './AIChat.css';

const AIChat = ({ theme, setTheme, setAIMode }) => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: `Hey, I'm ${data.hero.name.split("I'm ")[1]} 👋`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  
  // Initialize Azure OpenAI service with resume data
  const aiService = useMemo(() => {
    // Create the service instance directly without depending on data
    return new AzureOpenAIService(data);
    // Empty dependency array since we're intentionally only creating this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Function to safely deliver bot messages
  const deliverBotMessage = useCallback((content) => {
    // First ensure typing indicator is hidden
    setIsTyping(false);
    
    // Then add the message in the next event cycle
    setTimeout(() => {
      const botMessage = {
        type: 'bot',
        content: content,
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 0);
  }, [setIsTyping, setMessages]);
  
  // Function to generate AI responses
  const generateAIResponse = useCallback((topic) => {
    // Clear any existing typing timers
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Set active category
    setActiveCategory(topic);
    
    // First add the user message
    const userMessage = {
      type: 'user',
      content: `Tell me about your ${topic === 'Me' ? 'background' : topic.toLowerCase()}`,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // After a short delay, show typing indicator
    setTimeout(() => {
      console.log('Setting isTyping to true');
      setIsTyping(true);
      scrollToBottom();
      
      // Get Azure OpenAI response for the navigation item clicked
      aiService.generateCategoryResponse(topic)
        .then(responseContent => {
          // Calculate a typing delay based on message length (for natural feel)
          const typingDelay = Math.min(3000, Math.max(1500, responseContent.length * 25));
          
          // Add response after a delay
          typingTimerRef.current = setTimeout(() => {
            console.log('Setting isTyping to false - Nav button');
            deliverBotMessage(responseContent);
          }, typingDelay);
        })
        .catch(error => {
          console.error("Error getting AI response:", error);
          // Fallback message in case of error
          const fallbackResponse = "I'm having trouble connecting to my AI services. Please try again later.";
          typingTimerRef.current = setTimeout(() => {
            deliverBotMessage(fallbackResponse);
          }, 1500);
        });
    }, 500);
  }, [setActiveCategory, setMessages, setIsTyping, deliverBotMessage, aiService]);
  
  // Auto-scroll to bottom when new messages arrive or typing state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  // Log when typing state changes
  useEffect(() => {
    console.log('Typing state changed:', isTyping);
  }, [isTyping]);

  // Ensure typing indicator is cleaned up on unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending state changes
      setIsTyping(false);
    };
  }, []);
  
  // Add keyboard shortcut support
  useEffect(() => {
    const handleKeyPress = (e) => {
      // ESC key to exit AI mode
      if (e.key === 'Escape') {
        setAIMode(false);
      }
      
      // Number keys 1-5 for quick navigation
      if (e.altKey) {
        switch (e.key) {
          case '1':
            generateAIResponse("Me");
            break;
          case '2':
            generateAIResponse("Projects");
            break;
          case '3':
            generateAIResponse("Skills");
            break;
          case '4':
            generateAIResponse("Fun");
            break;
          case '5':
            generateAIResponse("Contact");
            break;
          default:
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [setAIMode, generateAIResponse]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    // Clear any existing typing timers
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Store the current input value before clearing it
    const currentInput = inputValue;
    
    // Add user message
    const userMessage = {
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };
    
    // Update state in a sequence to ensure proper rendering
    setInputValue('');
    
    // First add the user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Then, after a short delay, show the typing indicator
    setTimeout(() => {
      console.log('Setting isTyping to true - handleSubmit');
      setIsTyping(true);
      
      // Get response from Azure OpenAI based on all previous messages
      // This provides context for a more coherent conversation
      aiService.generateResponse(currentInput, messages)
        .then(responseContent => {
          // Calculate a typing delay based on message length
          const typingDelay = Math.min(3000, Math.max(1500, responseContent.length * 25));
          
          // After the typing delay, add the bot response
          typingTimerRef.current = setTimeout(() => {
            console.log('Setting isTyping to false - after message added');
            deliverBotMessage(responseContent);
          }, typingDelay);
        })
        .catch(error => {
          console.error("Error getting AI response:", error);
          // Fallback message in case of error
          const fallbackResponse = "I'm having trouble connecting to my AI services. Please try again later.";
          typingTimerRef.current = setTimeout(() => {
            deliverBotMessage(fallbackResponse);
          }, 1500);
        });
    }, 500); // Small delay before showing typing indicator
  }, [inputValue, setInputValue, setIsTyping, setMessages, deliverBotMessage, aiService, messages]);

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col py-6">
      {/* AI Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center overflow-hidden"
          style={{ background: 'transparent' }}
        >
          <img 
            src={`${process.env.PUBLIC_URL}/${theme === 'dark' ? 'robot_image_white.png' : 'robot_image.png'}`}
            alt="AI Avatar" 
            className="h-12 w-12"
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`text-md ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}
        >
          Ask me anything about my skills, projects or experience
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center gap-3 mt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAIMode(false)}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Portfolio
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto mb-4 rounded-2xl p-4 chat-container glass-effect ${
        theme === 'dark' 
          ? 'bg-gray-900/50 border border-gray-800/50' 
          : 'bg-white/80 border border-gray-200/50'
      }`}
      style={{
        boxShadow: theme === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
          : '0 8px 32px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)'
      }}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar - only shown for bot messages */}
              {message.type === 'bot' && (
                <div 
                  className={`message-avatar ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-100'
                  } flex-shrink-0`}
                >
                  <img 
                    src={`${process.env.PUBLIC_URL}/${theme === 'dark' ? 'robot_image_white.png' : 'robot_image.png'}`}
                    alt="AI Avatar" 
                    className="h-6 w-6"
                  />
                </div>
              )}
              
              <div 
                className={`message-bubble px-5 py-4 ${
                  message.type === 'user' 
                    ? 'user-message bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                    : 'bot-message ' + (theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-800')
                }`}
                style={{
                  boxShadow: message.type === 'user'
                    ? '0 4px 15px rgba(99, 102, 241, 0.3)'
                    : theme === 'dark'
                      ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                      : '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div 
                  className="message-content"
                  dangerouslySetInnerHTML={{ 
                    __html: formatMessageContent(message.content) 
                  }}
                />
                <div className={`message-timestamp ${
                  message.type === 'user'
                    ? 'text-blue-100'
                    : theme === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {/* Avatar - only shown for user messages */}
              {message.type === 'user' && (
                <div 
                  className={`message-avatar ${
                    theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-500'
                  } text-white flex-shrink-0 ml-3`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              key="typing-indicator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start mb-4"
            >
              <div 
                className={`message-avatar ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-100'
                } flex-shrink-0`}
              >
                <img 
                  src={`${process.env.PUBLIC_URL}/${theme === 'dark' ? 'robot_image_white.png' : 'robot_image.png'}`}
                  alt="AI Avatar" 
                  className="h-6 w-6"
                />
              </div>
              
              <div 
                className={`message-bubble bot-message px-5 py-4 ${
                  theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
                }`}
                style={{
                  boxShadow: theme === 'dark'
                    ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
              >
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onSubmit={handleSubmit}
        className={`relative glass-effect ${
          theme === 'dark' 
            ? 'bg-gray-900/50 border border-gray-800/50' 
            : 'bg-white/80 border border-gray-200/50'
        } rounded-full p-1 flex items-center min-h-[60px]`}
        style={{
          boxShadow: theme === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
            : '0 8px 32px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          placeholder="Ask me anything..."
          className={`flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg min-h-[50px] ${
            theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'
          }`}
          autoFocus
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!inputValue.trim()}
          className={`rounded-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white send-button ${
            !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </motion.button>
      </motion.form>

      {/* Keyboard shortcuts tooltip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={`text-xs text-center mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
      >
        Keyboard shortcuts: Alt+1-5 for navigation, Esc to exit AI mode
      </motion.div>
      
      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center mt-3 gap-6"
      >
        <NavItem 
          icon="👤" 
          text="Me" 
          theme={theme} 
          onClick={() => generateAIResponse("Me")} 
          isActive={activeCategory === "Me"}
        />
        <NavItem 
          icon="📂" 
          text="Projects" 
          theme={theme} 
          onClick={() => generateAIResponse("Projects")} 
          isActive={activeCategory === "Projects"}
        />
        <NavItem 
          icon="🛠️" 
          text="Skills" 
          theme={theme} 
          onClick={() => generateAIResponse("Skills")} 
          isActive={activeCategory === "Skills"}
        />
        <NavItem 
          icon="🎮" 
          text="Fun" 
          theme={theme} 
          onClick={() => generateAIResponse("Fun")} 
          isActive={activeCategory === "Fun"}
        />
        <NavItem 
          icon="📞" 
          text="Contact" 
          theme={theme} 
          onClick={() => generateAIResponse("Contact")} 
          isActive={activeCategory === "Contact"}
        />
      </motion.div>
    </div>
  );
};

// Navigation item component
const NavItem = ({ icon, text, theme, onClick, isActive }) => {
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = () => {
    setIsClicked(true);
    onClick();
    
    // Reset the clicked state after animation completes
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`flex flex-col items-center justify-center cursor-pointer p-3 rounded-lg nav-item ${
        theme === 'dark' 
          ? 'hover:bg-gray-800/50' 
          : 'hover:bg-gray-100/80'
      } ${isClicked ? 'ring-2 ring-primary ring-opacity-70' : ''}
      ${isActive ? 'bg-gradient-to-br from-primary/10 to-blue-500/10 shadow-md' : ''}`}
    >
      <motion.div 
        className="text-2xl"
        animate={isClicked ? { 
          scale: [1, 1.3, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <div className={`text-sm mt-1 ${
        isClicked || isActive
          ? 'text-primary font-medium' 
          : theme === 'dark' 
            ? 'text-gray-300' 
            : 'text-gray-700'
      }`}>
        {text}
      </div>
    </motion.div>
  );
};

export default AIChat;
