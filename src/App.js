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
import logoImg from './assets/images/abhinay_logo.png';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
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
        <Hero data={data.hero} />
        <About data={data.about} />
        <Experience data={data.experience} />
        <Projects data={data.projects} />
        <Achievements data={data.achievements} />
        <Skills data={data.skills} />
        <Contact data={data.contact} />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
