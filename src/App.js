import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import data from './data/data.json';
import AIChat from './components/AIChat';
import './ai-mode.css';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  
  const [aiMode, setAIMode] = useState(() => {
    const savedAIMode = localStorage.getItem('aiMode');
    return savedAIMode === 'true';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('aiMode', aiMode);
  }, [aiMode]);

  return (
    <div className={`min-h-screen relative overflow-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-light-bg text-gray-900'}`}>
      {/* Animated background elements for entire site */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large gradient blobs */}
        <div className={`absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-gradient-to-br from-primary/10 to-blue-500/10' : 'bg-gradient-to-br from-primary/5 to-blue-500/5'
        }`}></div>
        <div className={`absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl ${
          theme === 'dark' ? 'bg-gradient-to-br from-purple-500/10 to-primary/10' : 'bg-gradient-to-br from-purple-500/5 to-primary/5'
        }`}></div>
      </div>

      {/* Only show Navbar when not in AI mode */}
      {!aiMode && <Navbar theme={theme} setTheme={setTheme} aiMode={aiMode} setAIMode={setAIMode} />}
      <main className={`relative z-10 ${aiMode ? 'h-screen' : 'pt-24'}`}>
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full"
        >
          {aiMode ? (
            <motion.div 
              key="ai-chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="ai-mode-light"
            >
              <AIChat theme="light" setTheme={setTheme} setAIMode={setAIMode} />
            </motion.div>
          ) : (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Hero data={data.hero} theme={theme} />
              <About data={data.about} theme={theme} />
              <Experience data={data.experience} theme={theme} />
              <Projects data={data.projects} theme={theme} />
              <Achievements data={data.achievements} theme={theme} />
              <Skills data={data.skills} theme={theme} />
              <Contact data={data.contact} theme={theme} />
            </motion.div>
          )}
        </motion.div>
      </main>
      {!aiMode && <Footer theme={theme} />}
      {!aiMode && <ScrollToTop theme={theme} />}
    </div>
  );
}
