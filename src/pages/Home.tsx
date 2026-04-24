import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HardDrive, Server, ShieldCheck, Zap, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85] text-[var(--text)] group"
        >
          Master <br /><span className="text-gradient">Secondary Storage</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-[var(--subtext)] mb-16 font-black max-w-3xl mx-auto leading-relaxed"
        >
          An interactive laboratory for distributed systems, <span className="text-[var(--accent)] underline decoration-[var(--accent)]/30 decoration-4 underline-offset-8">RAID Logic</span>, and <span className="text-[var(--accent)] underline decoration-[var(--accent)]/30 decoration-4 underline-offset-8">Disk Geometry</span>.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/concepts"
            className="btn-spark text-xl group"
            id="start-learning-btn"
          >
            Start Intelligence Trace <Zap size={24} className="fill-current group-hover:animate-pulse" />
          </Link>
          <Link
            to="/simulations"
            className="px-10 py-5 glass dark:glass-dark text-[var(--text)] border-2 border-[var(--primary)]/10 rounded-2xl font-black text-xl hover:border-[var(--primary)]/50 transition-all active:scale-95 flex items-center gap-3 group"
            id="simulations-btn"
          >
            <Activity size={24} className="text-accent group-hover:scale-125 transition-transform" />
            Launch Labs
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 w-full"
      >
        <FeatureCard 
          icon={HardDrive} 
          title="Theory Space" 
          desc="Deep architectural analysis of HDDs, SSDs, and Disk Structures."
          delay={0.7}
          color="hover:shadow-primary/20"
          to="/concepts"
        />
        <FeatureCard 
          icon={Zap} 
          title="Live Benchmarks" 
          desc="Visualize Disk Scheduling algorithms in real-time."
          delay={0.8}
          color="hover:shadow-primary/20"
          to="/simulations"
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="Fault Tolerance" 
          desc="Simulate RAID redundancy and data protection protocols."
          delay={0.9}
          color="hover:shadow-primary/20"
          to="/concepts"
        />
        <FeatureCard 
          icon={Server} 
          title="Terminal Lab" 
          desc="Experiment with file system commands in our terminal."
          delay={1.0}
          color="hover:shadow-primary/20"
          to="/playground"
        />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, delay, color, to }: any) => (
  <Link to={to} className="block group">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className={cn(
        "p-8 rounded-[2.5rem] glass dark:glass-dark text-left transition-all duration-500 border-4 border-transparent shadow-xl h-full",
        color
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] group-hover:text-white transition-all duration-500 shadow-lg text-[var(--primary)]">
        <Icon size={32} strokeWidth={3} />
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tighter transition-colors text-[var(--text)] group-hover:text-gradient">{title}</h3>
      <p className="text-[var(--text)] leading-relaxed font-black text-sm">{desc}</p>
    </motion.div>
  </Link>
);
