import { motion } from 'framer-motion';
import { FaTrophy, FaCertificate, FaMedal, FaStar } from 'react-icons/fa';

const iconMap = {
  trophy: FaTrophy,
  certificate: FaCertificate,
  medal: FaMedal,
  star: FaStar
};

export default function Achievements({ data, theme }) {
  return (
    <section id="achievements" className="section relative">
      {/* Gradient blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`heading text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Notable <span className="text-primary">Achievements</span>
        </motion.h2>
        
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {data.map((achievement, i) => {
            // For the existing array of strings in data.json
            if (typeof achievement === 'string') {
              return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`${theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border p-6 flex gap-4`}
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
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/15 flex items-center justify-center" style={{ borderRadius: '0.25rem' }}>
                      <FaTrophy className="text-primary text-xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{achievement}</h3>
                  </div>
                </motion.article>
              );
            }
            
            // For object format if needed in the future
            const Icon = achievement.icon ? iconMap[achievement.icon] : FaTrophy;
            
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`${theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-sm border p-6 flex gap-4`}
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
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/15 flex items-center justify-center" style={{ borderRadius: '0.25rem' }}>
                    <Icon className="text-primary text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{achievement.title}</h3>
                  <p className="text-sm text-gray-300">{achievement.description}</p>
                  {achievement.date && (
                    <span className="text-xs text-gray-300 block mt-2">
                      {achievement.date}
                    </span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}