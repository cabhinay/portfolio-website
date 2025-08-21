import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Skills({ data }) {
  return (
    <section id="skills" className="section relative">
      {/* Gradient blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/5 to-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-primary/5 to-emerald-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading text-center text-white"
        >
          Technical <span className="text-primary">Skills</span>
        </motion.h2>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8"
        >
          <motion.div 
            variants={item} 
            className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 p-6"
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
            <div className="flex flex-wrap gap-3">
              {data.map((skill, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-primary/15 text-primary text-sm hover:bg-primary/20 transition-colors"
                  style={{ borderRadius: '0.25rem' }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
