import { useEffect, useState } from 'react';
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

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

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

      <Navbar theme={theme} setTheme={setTheme} />
      <main className="relative z-10 pt-24">
        <Hero data={data.hero} theme={theme} />
        <About data={data.about} theme={theme} />
        <Experience data={data.experience} theme={theme} />
        <Projects data={data.projects} theme={theme} />
        <Achievements data={data.achievements} theme={theme} />
        <Skills data={data.skills} theme={theme} />
        <Contact data={data.contact} theme={theme} />
      </main>
      <Footer theme={theme} />
      <ScrollToTop theme={theme} />
    </div>
  );
}
