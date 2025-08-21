import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const socialIcons = {
  email: FaEnvelope,
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter
};

export default function Contact({ data, theme }) {
  return (
    <section id="contact" className="section relative">
      {/* Gradient blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl"></div>
      
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