import { motion, useAnimationFrame } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Animated background dot component
const AnimatedDot = ({ size, opacity, posX, posY, scale }) => {
  return (
    <div 
      className="absolute bg-primary/30 rounded-full" 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        opacity: opacity,
        transform: `translateX(${posX}px) translateY(${posY}px) scale(${scale})`
      }}
    ></div>
  );
};

export default function Hero({ data, theme }) {
  const [dots, setDots] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [typedText, setTypedText] = useState('');
  const fullText = data.name;
  const typingSpeed = 150; // ms per character
  const cursorRef = useRef(null);
  
  // Initialize animated dots
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Generate random dots
      const generateDots = () => {
        const newDots = [];
        const numDots = 80; // Increased from 50 to 80 for more elements
        
        for (let i = 0; i < numDots; i++) {
          newDots.push({
            id: i,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.4 + 0.1,
            posX: Math.random() * window.innerWidth,
            posY: Math.random() * window.innerHeight,
            scale: Math.random() * 2 + 1,
            velocity: {
              x: (Math.random() - 0.5) * 0.4, // Increased from 0.2 to 0.4 for faster movement
              y: (Math.random() - 0.5) * 0.4, // Increased from 0.2 to 0.4 for faster movement
              scale: (Math.random() - 0.5) * 0.02 // Increased from 0.01 to 0.02 for faster scaling
            }
          });
        }
        
        return newDots;
      };
      
      setDots(generateDots());
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Text typing effect
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypedText(fullText.substring(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(typingInterval);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [fullText]);
  
  // Cursor blinking effect
  useEffect(() => {
    if (!cursorRef.current) return;
    
    const blinkInterval = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = cursorRef.current.style.opacity === '0' ? '1' : '0';
      }
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Animate dots
  useAnimationFrame((time) => {
    setDots(prevDots => 
      prevDots.map(dot => {
        // Update position and scale based on velocity
        let newPosX = dot.posX + dot.velocity.x;
        let newPosY = dot.posY + dot.velocity.y;
        let newScale = dot.scale + dot.velocity.scale;
        
        // Boundary check for position
        if (newPosX > dimensions.width || newPosX < 0) {
          dot.velocity.x *= -1;
          newPosX = dot.posX + dot.velocity.x;
        }
        
        if (newPosY > dimensions.height || newPosY < 0) {
          dot.velocity.y *= -1;
          newPosY = dot.posY + dot.velocity.y;
        }
        
        // Boundary check for scale
        if (newScale > 3 || newScale < 1) {
          dot.velocity.scale *= -1;
          newScale = dot.scale + dot.velocity.scale;
        }
        
        return {
          ...dot,
          posX: newPosX,
          posY: newPosY,
          scale: newScale
        };
      })
    );
  });

  return (
    <section id="hero" className="section relative flex flex-col items-center justify-center min-h-screen text-center overflow-hidden pt-16">
      {/* Animated background with dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dots.map((dot) => (
          <AnimatedDot
            key={dot.id}
            size={dot.size}
            opacity={dot.opacity}
            posX={dot.posX}
            posY={dot.posY}
            scale={dot.scale}
          />
        ))}
      </div>
      
      {/* Geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Centered cube */}
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
          animate={{ 
            rotateX: [0, 6, 0], 
            rotateY: [0, 57, 0],
            rotateZ: [0, 3, 0] 
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        >
          <div className="w-80 h-80 border-2 border-primary/30 transform rotate-45 relative">
            <div className="absolute inset-4 border-2 border-blue-500/25 transform -rotate-45 rounded-lg"></div>
            <div className="absolute inset-8 border-2 border-purple-500/25 transform rotate-45 rounded-lg"></div>
            <div className="absolute inset-12 border-2 border-cyan-500/25 transform -rotate-45 rounded-lg"></div>
            <div className="absolute inset-16 border border-emerald-500/20 transform rotate-45 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary flex justify-center items-center"
        >
          <span className="inline-flex items-baseline min-h-[1.2em]">
            {typedText}
            <span ref={cursorRef} className="inline-block w-0.5 h-[0.8em] bg-primary ml-1"></span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 max-w-2xl text-lg text-gray-300"
        >
          {data.role}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className={`mt-3 max-w-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          {data.intro}
        </motion.p>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6 }} 
            className="mt-7 flex flex-wrap items-center justify-center gap-4"
          >
            <a 
              href={data.resume} 
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 font-semibold flex items-center gap-2 justify-center transition-all duration-300"
              style={{ 
                borderRadius: '0.25rem',
                boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = '0 5px 10px rgba(0,0,0,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              <svg 
                stroke="currentColor" 
                fill="currentColor" 
                strokeWidth="0" 
                viewBox="0 0 512 512" 
                className="w-4 h-4 relative z-10 group-hover:animate-bounce" 
                height="1em" 
                width="1em" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"></path>
              </svg>
              <span className="relative z-10">Download CV</span>
            </a>
            
            <a 
              href={data.contact} 
              className={`group relative overflow-hidden bg-transparent border-2 border-primary ${theme === 'dark' ? 'text-white hover:text-primary' : 'text-gray-900 hover:text-primary'} px-6 py-3 font-semibold flex items-center gap-2 justify-center transition-all duration-300 hover:bg-primary/5`}
              style={{ 
                borderRadius: '0.25rem',
                boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.3)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow = '0 5px 10px rgba(0,0,0,0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
            >
              <svg 
                stroke="currentColor" 
                fill="currentColor" 
                strokeWidth="0" 
                viewBox="0 0 512 512" 
                className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" 
                height="1em" 
                width="1em" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2v82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9V380.8c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
              </svg>
              <span>Let's Build Together</span>
            </a>
          </motion.div>        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex flex-col items-center text-gray-400"
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <motion.div 
              className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center overflow-visible"
              initial={{ y: 0 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <motion.div 
                className="w-1 h-3 bg-primary rounded-full mt-2"
                initial={{ y: 0 }}
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              ></motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}