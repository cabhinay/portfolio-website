import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop({ theme }) {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-primary to-blue-600
                   flex items-center justify-center text-white shadow-lg 
                   hover:shadow-primary/30 hover:shadow-xl transition-all z-50"
          style={{ 
            borderRadius: '0.25rem',
            boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)'
          }}
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-lg" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}