import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, BookOpen, Activity, Terminal, BrainCircuit, Home, Database, Sparkles } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { createSparkleParticles } from '../lib/sparkle';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [palette, setPalette] = useState<'celestial' | 'arctic' | 'rose' | 'golden' | 'cyber'>('celestial');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const savedPalette = localStorage.getItem('palette') as any;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    if (savedPalette) {
      setPalette(savedPalette);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('theme', theme);
    localStorage.setItem('palette', palette);
  }, [theme, palette]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Concepts', path: '/concepts', icon: BookOpen },
    { name: 'Simulations', path: '/simulations', icon: Activity },
    { name: 'Playground', path: '/playground', icon: Terminal },
    { name: 'Quiz', path: '/quiz', icon: BrainCircuit },
  ];

  const palettes = [
    { id: 'celestial', name: 'Celestial Midnight', class: 'bg-[#7C3AED]' },
    { id: 'arctic', name: 'Arctic Aurora', class: 'bg-[#0EA5E9]' },
    { id: 'rose', name: 'Rose Nebula', class: 'bg-[#F43F5E]' },
    { id: 'golden', name: 'Golden Hour', class: 'bg-[#F59E0B]' },
    { id: 'cyber', name: 'Cyber Jade', class: 'bg-[#22C55E]' },
  ] as const;

  const handleNavClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const container = document.body;
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.position = 'absolute';
    sparkleContainer.style.left = `${rect.left + rect.width / 2}px`;
    sparkleContainer.style.top = `${rect.top + rect.height / 2}px`;
    sparkleContainer.style.width = '0px';
    sparkleContainer.style.height = '0px';
    sparkleContainer.style.pointerEvents = 'none';
    document.body.appendChild(sparkleContainer);
    createSparkleParticles(sparkleContainer, 'var(--accent)');
    setTimeout(() => sparkleContainer.remove(), 2000);
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-300 flex flex-col relative overflow-hidden", 
      theme === 'dark' ? "bg-[var(--bg)] text-[var(--text)]" : "bg-[var(--bg)] text-[var(--text)]")}>
      <ParticleBackground />
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-5%] right-[-5%] cosmic-glow bg-primary/10 dark:bg-primary/5" />
      <div className="absolute bottom-[-5%] left-[-5%] cosmic-glow bg-secondary/10 dark:bg-secondary/5" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass dark:glass-dark border-b border-[var(--primary)]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-3 text-gradient group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center p-1.5 shadow-lg group-hover:rotate-12 transition-transform">
                  <Database size={20} className="text-white" />
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-white/10">
                {navItems.map((item, index) => (
                  <motion.div key={item.name} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to={item.path}
                        onClick={handleNavClick}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2",
                          location.pathname === item.path
                            ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-xl shadow-[var(--primary)]/20"
                            : "text-[var(--subtext)] hover:text-[var(--primary)]"
                        )}
                      >
                        <item.icon size={16} className={cn(location.pathname === item.path ? "text-white" : "text-[var(--accent)]")} />
                        {item.name}
                      </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Palette Switcher */}
              <div className="hidden sm:flex items-center gap-1 bg-white/10 dark:bg-black/10 p-1 rounded-full border border-white/10">
                {palettes.map((p) => (
                  <button
                    key={p.id}
                    title={p.name}
                    onClick={(e) => {
                      setPalette(p.id);
                      handleNavClick(e);
                    }}
                    className={cn(
                      "w-4 h-4 rounded-full transition-all hover:scale-125",
                      p.class,
                      palette === p.id ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--bg)]" : "opacity-50"
                    )}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-[var(--accent)]"
                id="theme-toggle"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[var(--primary)]/10 bg-[var(--surface)]"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block px-3 py-3 rounded-xl text-base font-bold flex items-center gap-3 transition-all",
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg"
                        : "text-[var(--text)]/70 hover:bg-[var(--primary)]/10"
                    )}
                  >
                    <item.icon size={20} strokeWidth={3} className={location.pathname === item.path ? "text-white" : "text-[var(--primary)]"} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-[var(--primary)]/10 py-16 bg-black/5 dark:bg-black/20 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/5 border border-[var(--primary)]/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              System Operational
            </div>
            
            <div className="space-y-2">
              <p className="text-[var(--subtext)] text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                © 2026 Swapnika's Space
              </p>
              <div className="space-y-1">
                <p className="font-black text-xs uppercase tracking-tighter flex items-center justify-center gap-2">
                  <span className="text-[var(--subtext)] font-medium low-case italic tracking-normal">Built by</span>
                  <span className="text-gradient font-black">Swapnika krishna Jakka</span>
                </p>
                <p className="font-black text-xs uppercase tracking-tighter flex items-center justify-center gap-2">
                  <span className="text-[var(--subtext)] font-medium low-case italic tracking-normal">Academic Direction</span>
                  <span className="text-gradient font-black">Prof. Mr. P. Venkata Rajulu</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
