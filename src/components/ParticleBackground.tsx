import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HardDrive, File, Database, Play, Disc } from 'lucide-react';
import { cn } from '../lib/utils';

const icons = [HardDrive, File, Database, Play, Disc];

export const ParticleBackground = () => {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 30,
      iconIndex: Math.floor(Math.random() * icons.length),
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 10,
      color: ['text-[var(--primary)]/10', 'text-[var(--accent)]/10'][Math.floor(Math.random() * 2)]
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] opacity-30 dark:opacity-40 select-none">
      {particles.map((p) => {
        const Icon = icons[p.iconIndex];
        return (
          <motion.div
            key={p.id}
            initial={{ scale: 0, x: `${p.x}%`, y: `${p.y}%`, rotate: 0 }}
            animate={{
              y: [`${p.y}%`, `${(p.y + 40) % 100}%`, `${(p.y - 40 + 100) % 100}%`, `${p.y}%`],
              x: [`${p.x}%`, `${(p.x + 20) % 100}%`, `${(p.x - 20 + 100) % 100}%`, `${p.x}%`],
              rotate: [0, 180, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.33, 0.66, 1]
            }}
            className={cn("absolute flex items-center justify-center filter blur-[1px]", p.color)}
            style={{ width: p.size, height: p.size }}
          >
            <Icon size={p.size} strokeWidth={1} />
          </motion.div>
        );
      })}
    </div>
  );
};
