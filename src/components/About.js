import { motion, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Animated background dot properties
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

export default function About({ data }) {
  const features = [
    {
      title: 'Client‑First Approach',
      desc: 'Transparent communication, measurable outcomes, and long‑term partnership.',
      icon: '🤝'
    },
    {
      title: 'Modern Tech Stack',
      desc: 'Azure, .NET 8, React, and event‑driven systems designed for scale.',
      icon: '🧰'
    },
    {
      title: 'AI‑Powered Solutions',
      desc: 'Pragmatic integrations of LLMs and automation where they add real value.',
      icon: '🤖'
    },
    {
      title: 'Global Flexibility',
      desc: 'Remote collaboration across time zones with strong documentation.',
      icon: '🌍'
    }
  ];
  
  const containerRef = useRef(null);
  const [dots, setDots] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize dots on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Generate random dots for the animated background
      const generateDots = () => {
        const newDots = [];
        const numDots = 50; // Number of dots to create
        
        for (let i = 0; i < numDots; i++) {
          newDots.push({
            id: i,
            size: Math.random() * 3 + 1, // Random size between 1-4px
            opacity: Math.random() * 0.4 + 0.1, // Random opacity
            posX: Math.random() * window.innerWidth,
            posY: Math.random() * window.innerHeight,
            scale: Math.random() * 2 + 1, // Random scale
            velocity: {
              x: (Math.random() - 0.5) * 0.2, // Random x velocity
              y: (Math.random() - 0.5) * 0.2, // Random y velocity
              scale: (Math.random() - 0.5) * 0.01 // Random scale change
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
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Animated background with dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-auto" ref={containerRef}>
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
      
      {/* Gradient blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-primary/10 rounded-full blur-3xl"></div>
      
      {/* Geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Centered cube */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div 
            className="w-80 h-80 border-2 border-primary/30 transform rotate-45 relative"
            animate={{ 
              rotateX: [0, 6, 0], 
              rotateY: [0, 57, 0],
              rotateZ: [0, 3, 0] 
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          >
            <div className="absolute inset-4 border-2 border-blue-500/25 transform -rotate-45 rounded-lg"></div>
            <div className="absolute inset-8 border-2 border-purple-500/25 transform rotate-45 rounded-lg"></div>
            <div className="absolute inset-12 border-2 border-cyan-500/25 transform -rotate-45 rounded-lg"></div>
            <div className="absolute inset-16 border border-emerald-500/20 transform rotate-45 rounded-full"></div>
          </motion.div>
        </div>
        
        {/* Upper right circle */}
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 border-2 border-primary/40 rounded-full"
          animate={{ scale: [1, 1.01, 1], rotate: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <div className="absolute inset-2 border-2 border-blue-500/35 rounded-full">
            <div className="absolute inset-2 border border-purple-500/30 rounded-full">
              <div className="absolute inset-2 border border-cyan-500/25 rounded-full"></div>
            </div>
          </div>
          <motion.div 
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary/60 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          ></motion.div>
        </motion.div>
      </div>

      {/* Content section */}
      <div className="relative z-10 container-px py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading text-white"
          >
            About <span className="text-primary">Me</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-gray-300"
          >
            {data.description}
          </motion.p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.05 }} 
              className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 p-5"
              style={{ 
                borderRadius: '0.25rem',
                boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              whileHover={{
                boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
                y: -4
              }}
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg p-5">
            <h4 className="font-semibold text-white">Education</h4>
            <p className="text-gray-300 mt-2">{data.education}</p>
          </div>
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-lg p-5 sm:col-span-2">
            <h4 className="font-semibold text-white">Interests</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.interests.map((x, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-primary/15 text-primary text-sm">{x}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}