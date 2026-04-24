import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { THEORY_TOPICS } from '../constants/theory';

export const Concepts = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          Curriculum Overview
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-gradient"
        >
          Theory Master
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[var(--text)] max-w-2xl mx-auto font-black"
        >
          Explore the fundamental concepts of Secondary Storage Structure. Click on any topic to dive deeper into the detailed theory.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {THEORY_TOPICS.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Link
              to={`/concepts/${topic.id}`}
              className="group block h-full p-8 glass dark:glass-dark rounded-[2rem] hover:border-[var(--primary)] transition-all shadow-sm hover:shadow-spark-light dark:hover:shadow-spark relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <BookOpen size={120} strokeWidth={1} className="text-[var(--primary)]" />
              </div>
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="p-4 bg-[var(--primary)]/5 rounded-2xl text-[var(--accent)] group-hover:bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] group-hover:text-white transition-all duration-300 shadow-inner">
                  <BookOpen size={28} />
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-full border border-[var(--primary)]/10 group-hover:bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] group-hover:border-transparent group-hover:text-white transition-all duration-300">
                  <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-4 leading-tight text-[var(--text)] group-hover:text-gradient relative z-10 tracking-tight">
                {topic.title}
              </h3>
              <p className="text-[var(--text)]/80 line-clamp-3 leading-relaxed font-black relative z-10 text-sm">
                {(() => {
                  const cleanText = topic.content[0]
                    .replace(/<[^>]*>/g, '') // Strip HTML tags
                    .replace(/[#*`_]/g, '')   // Strip Markdown chars
                    .replace(/---/g, '')     // Strip horizontal rules
                    .trim();
                  return cleanText.length > 120 ? cleanText.substring(0, 120) + '...' : cleanText;
                })()}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

