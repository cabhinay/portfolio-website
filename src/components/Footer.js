import { motion } from 'framer-motion';

export default function Footer({ theme }) {
  const year = new Date().getFullYear();

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`py-6 mt-12 border-t ${theme === 'dark' ? 'border-gray-800 bg-black' : 'border-gray-200 bg-light-bg'} relative z-10`}
    >
      <div className="container mx-auto px-4">
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