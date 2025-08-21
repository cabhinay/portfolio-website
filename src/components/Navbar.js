import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import logo from '../assets/images/abhinay_logo.png';

export default function Navbar({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      setScrollProgress(value);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);
  
  const links = [
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm ${
        theme === 'dark' 
          ? 'bg-black/80 border-b border-gray-800' 
          : 'bg-white/80 border-b border-gray-200'
      }`}
    >
      <motion.div 
        className="h-1 bg-gradient-to-r from-primary to-blue-600"
        style={{ 
          scaleX: scrollProgress,
          transformOrigin: "left",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: "100%"
        }}
      ></motion.div>
      <nav className="container-px py-4 flex items-center justify-between">
        <motion.a 
          href="#hero" 
          whileHover={{ scale: 1.05 }}
          className="flex items-center"
        >
          <img src={logo} alt="Abhinay Logo" className="h-16 w-auto" />
        </motion.a>

        <button
          className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
            theme === 'dark' 
              ? 'hover:bg-gray-800' 
              : 'hover:bg-gray-100'
          }`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>☰</span>
        </button>

        <ul className={`hidden md:flex items-center gap-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {links.map(l => (
            <motion.li key={l.href} whileHover={{ scale: 1.1 }}>
              <a className="hover:text-primary transition-colors" href={l.href}>{l.label}</a>
            </motion.li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <motion.a 
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
              y: -2
            }}
            href="#contact" 
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 font-semibold flex items-center gap-2 justify-center transition-all duration-300"
            style={{ 
              borderRadius: '0.25rem',
              boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
              transform: 'translateY(-1px)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            <span className="relative z-10">Get in Touch</span>
          </motion.a>
          
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 15 }} 
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className={`w-10 h-10 backdrop-blur-sm flex items-center justify-center hover:bg-primary/10 transition-colors ${
              theme === 'dark'
                ? 'bg-gray-900/70 border border-gray-800 text-white'
                : 'bg-gray-100/70 border border-gray-200 text-gray-900'
            }`}
            style={{ borderRadius: '0.25rem' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </nav>

      {open && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={`md:hidden backdrop-blur-sm ${
            theme === 'dark' 
              ? 'border-t border-gray-800 bg-black/90' 
              : 'border-t border-gray-200 bg-white/90'
          }`}
        >
          <ul className="container-px py-3 flex flex-col gap-3">
            {links.map(l => (
              <li key={l.href}>
                <a 
                  className={`block py-2 hover:text-primary ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`} 
                  href={l.href} 
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="flex gap-3 pt-2">
              <a 
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg flex items-center gap-2 justify-center transition-all duration-300 w-full" 
                href="#contact" 
                onClick={() => setOpen(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <span className="relative z-10">Get in Touch</span>
              </a>
            </li>
            <li className="flex justify-center pt-3">
              <button 
                onClick={() => { 
                  setTheme(theme === 'dark' ? 'light' : 'dark'); 
                  setOpen(false); 
                }} 
                className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center hover:bg-primary/10 transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-900/70 border border-gray-800 text-white'
                    : 'bg-gray-100/70 border border-gray-200 text-gray-900'
                }`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}