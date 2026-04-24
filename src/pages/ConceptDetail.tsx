import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { THEORY_TOPICS } from '../constants/theory';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export const ConceptDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const topic = THEORY_TOPICS.find(t => t.id === id);

  if (!topic) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black mb-4 text-gradient">Topic Not Found</h2>
        <button 
          onClick={() => navigate('/concepts')}
          className="text-[var(--primary)] font-black hover:underline"
        >
          Back to Concepts
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/concepts')}
        className="mb-8 flex items-center gap-2 text-[var(--primary)] font-black hover:gap-3 transition-all"
      >
        <ArrowLeft size={20} className="text-[var(--accent)]" /> Back to All Topics
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--surface)] border border-[var(--primary)]/10 rounded-3xl p-8 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={32} className="text-[var(--accent)]" />
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">{topic.title}</h1>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-[var(--text)] font-black leading-relaxed">
          {topic.content.map((paragraph, idx) => (
             <div key={idx} className="markdown-body">
                <Markdown rehypePlugins={[rehypeRaw]}>{paragraph}</Markdown>
             </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
