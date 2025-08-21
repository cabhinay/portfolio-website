import { motion } from 'framer-motion';

export default function Experience({ data }) {
  return (
    <section id="experience" className="section relative">
      {/* Gradient blobs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-primary/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading text-center text-white"
        >
          Professional <span className="text-primary">Experience</span>
        </motion.h2>
        
        <div className="mt-8 grid gap-6">
          {data.map((job, i) => (
            <motion.article 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-xl font-semibold text-white">{job.role} · <span className="text-primary">{job.company}</span></h3>
                <span className="text-sm text-gray-300">{job.duration}</span>
              </div>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm text-gray-300">
                {job.responsibilities.map((r, idx) => (<li key={idx}>{r}</li>))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}