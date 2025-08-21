import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export default function Projects({ data, theme }) {
  return (
    <section id="projects" className="section relative">
      {/* Gradient blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`heading text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Featured <span className="text-primary">Projects</span>
        </motion.h2>
        
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((project, i) => (
            <motion.article 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border group overflow-hidden`}
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
              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-primary/15 text-primary" style={{ borderRadius: '0.25rem' }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" 
                      className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:text-primary transition-colors`}>
                      <FaGithub />
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" 
                      className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:text-primary transition-colors`}>
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}