import { motion, useAnimationFrame } from 'framer-motion';
import { useState, useEffect } from 'react';

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

export default function Footer({ theme }) {
  const year = new Date().getFullYear();
  const [dots, setDots] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize animated dots
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Generate random dots
      const generateDots = () => {
        const newDots = [];
        const numDots = 40; // Fewer dots for footer (smaller area)
        
        for (let i = 0; i < numDots; i++) {
          newDots.push({
            id: i,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.4 + 0.1,
            posX: Math.random() * window.innerWidth,
            posY: Math.random() * 100, // Keep within footer height
            scale: Math.random() * 2 + 1,
            velocity: {
              x: (Math.random() - 0.5) * 0.4, // Increased speed
              y: (Math.random() - 0.5) * 0.4, // Increased speed
              scale: (Math.random() - 0.5) * 0.02 // Increased speed
            }
          });
        }
        
        return newDots;
      };
      
      setDots(generateDots());
      setDimensions({
        width: window.innerWidth,
        height: 100 // Footer height
      });
      
      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: 100 // Footer height
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
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
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`py-6 mt-12 border-t ${theme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-light-bg'} relative z-10`}
    >
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
        {/* Small circle */}
        <motion.div 
          className="absolute bottom-5 right-20 w-16 h-16 border-2 border-primary/40 rounded-full"
          animate={{ scale: [1, 1.01, 1], rotate: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <div className="absolute inset-2 border border-blue-500/35 rounded-full">
            <div className="absolute inset-1 border border-purple-500/30 rounded-full"></div>
          </div>
        </motion.div>

        {/* Small cube */}
        <motion.div 
          className="absolute bottom-5 left-20 transform -z-10"
          animate={{ 
            rotateX: [0, 6, 0], 
            rotateY: [0, 57, 0],
            rotateZ: [0, 3, 0] 
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 border border-primary/30 transform rotate-45 relative">
            <div className="absolute inset-1 border border-blue-500/25 transform -rotate-45 rounded-lg"></div>
            <div className="absolute inset-3 border border-purple-500/25 transform rotate-45 rounded-sm"></div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center sm:text-left`}>
            © {year} All rights reserved.
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center sm:text-right`}>
            Built with React, Vite, and Tailwind CSS
          </p>
        </div>
      </div>
    </motion.footer>
  );
}