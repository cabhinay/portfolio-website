import { motion, useAnimationFrame } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const socialIcons = {
  email: FaEnvelope,
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter
};

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

export default function Contact({ data, theme }) {
  const [dots, setDots] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize animated dots
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Generate random dots
      const generateDots = () => {
        const newDots = [];
        const numDots = 80; // More elements
        
        for (let i = 0; i < numDots; i++) {
          newDots.push({
            id: i,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.4 + 0.1,
            posX: Math.random() * window.innerWidth,
            posY: Math.random() * window.innerHeight,
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
    <section id="contact" className="section relative">
      {/* Gradient blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl"></div>
      
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
        {/* Bottom right circle */}
        <motion.div 
          className="absolute bottom-32 right-32 w-32 h-32 border-2 border-primary/40 rounded-full"
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

        {/* Left-side cube */}
        <motion.div 
          className="absolute top-1/2 left-1/4 transform -z-10"
          animate={{ 
            rotateX: [0, 6, 0], 
            rotateY: [0, 57, 0],
            rotateZ: [0, 3, 0] 
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        >
          <div className="w-64 h-64 border-2 border-primary/30 transform rotate-45 relative">
            <div className="absolute inset-4 border-2 border-blue-500/25 transform -rotate-45 rounded-lg"></div>
            <div className="absolute inset-8 border-2 border-purple-500/25 transform rotate-45 rounded-lg"></div>
            <div className="absolute inset-12 border-2 border-cyan-500/25 transform -rotate-45 rounded-lg"></div>
            <div className="absolute inset-16 border border-emerald-500/20 transform rotate-45 rounded-full"></div>
          </div>
        </motion.div>
      </div>
      
      <div className="relative z-10 w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`heading text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Get in <span className="text-primary">Touch</span>
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 max-w-2xl mx-auto text-center"
        >
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>Let's collaborate on your next project!</p>
          
          <div className="flex justify-center gap-6">
            {Object.entries(data.socials).map(([platform, url]) => {
              const Icon = socialIcons[platform.toLowerCase()];
              if (!Icon) return null;
              
              return (
                <motion.a
                  key={platform}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 ${theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border flex items-center justify-center 
                           text-xl text-primary hover:bg-primary/10 transition-colors`}
                  style={{ borderRadius: '0.25rem' }}
                  aria-label={`Connect on ${platform}`}
                >
                  <Icon />
                </motion.a>
              );
            })}
          </div>

          <div className="mt-12">
            <motion.a
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
                y: -4
              }}
              href={`mailto:${data.email}`}
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 font-semibold flex items-center gap-2 justify-center transition-all duration-300"
              style={{ 
                borderRadius: '0.25rem',
                boxShadow: '0 5px 10px rgba(0,0,0,0.2)',
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              <FaEnvelope className="relative z-10" />
              <span className="relative z-10">Send Email</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}