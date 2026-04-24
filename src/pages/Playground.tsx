import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Play, Trash2, HelpCircle, Code2, Database, ChevronRight, Loader2, RotateCcw, Cpu, HardDrive } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const LANGUAGE_SAMPLES: Record<string, string> = {
  javascript: `// Disk Scheduling (JS)
function fcfs(head, queue) {
    let totalSeek = 0;
    let current = head;
    console.log("Path:");
    for(let req of queue) {
        totalSeek += Math.abs(req - current);
        console.log(\`Move to \${req}\`);
        current = req;
    }
    console.log("Total Seek:", totalSeek);
}
fcfs(50, [98, 183, 37, 122, 14, 124, 65, 67]);`,
  python: `# Disk Scheduling (Python)
def fcfs(head, queue):
    total_seek = 0
    current = head
    for req in queue:
        total_seek += abs(req - current)
        print(f"Move to {req}")
        current = req
    print(f"Total Seek: {total_seek}")

fcfs(50, [98, 183, 37, 122, 14, 124, 65, 67])`,
  java: `// Disk Scheduling (Java)
public class Main {
    public static void main(String[] args) {
        int head = 50;
        int[] queue = {98, 183, 37, 122, 14, 124, 65, 67};
        int totalSeek = 0;
        int current = head;
        for(int req : queue) {
            totalSeek += Math.abs(req - current);
            System.out.println("Move to " + req);
            current = req;
        }
        System.out.println("Total Seek: " + totalSeek);
    }
}`,
  cpp: `// Disk Scheduling (C++)
#include <iostream>
#include <vector>
#include <cmath>

int main() {
    int head = 50;
    std::vector<int> queue = {98, 183, 37, 122, 14, 124, 65, 67};
    int total_seek = 0;
    int current = head;
    for(int req : queue) {
        total_seek += std::abs(req - current);
        std::cout << "Move to " << req << std::endl;
        current = req;
    }
    std::cout << "Total Seek: " << total_seek << std::endl;
    return 0;
}`,
  c: `/* Disk Scheduling (C) */
#include <stdio.h>
#include <stdlib.h>

int main() {
    int head = 50;
    int queue[] = {98, 183, 37, 122, 14, 124, 65, 67};
    int total_seek = 0;
    int current = head;
    for(int i = 0; i < 8; i++) {
        total_seek += abs(queue[i] - current);
        printf("Move to %d\\n", queue[i]);
        current = queue[i];
    }
    printf("Total Seek: %d\\n", total_seek);
    return 0;
}`
};

export const Playground = () => {
  const [lang, setLang] = useState('c');
  const [code, setCode] = useState(LANGUAGE_SAMPLES.c);
  const [isExecuting, setIsExecuting] = useState(false);
  const [labOutput, setLabOutput] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);

  const resetCode = () => {
    setCode(LANGUAGE_SAMPLES[lang]);
    setLabOutput([]);
    setShowOutput(false);
  };

  const executeAlgorithm = async () => {
    setIsExecuting(true);
    setShowOutput(true);
    setLabOutput(["[System] Initializing Peterson Hypervisor...", "[System] Compiling source code..."]);
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Language: ${lang}\n\nCode:\n${code}`,
            config: {
                systemInstruction: `You are the Peterson Hypervisor, a specialized OS simulation environment.
Your task is to execute and simulate code provided in C, C++, Python, or Java.

Focus: Disk Scheduling Algorithms.
Response format:
- Start with [Hypervisor Status: OK]
- Provide step-by-step trace of disk head movement.
- End with Total Seek Count and Average Time.
- Keep it concise and technical.`
            }
        });

        const lines = response.text?.split('\n').filter(l => l.trim() !== '') || ["Error: Simulator timed out."];
        setLabOutput(prev => [...prev, "[Run] Starting execution...", ...lines, "[Status] ready_"]);
    } catch (error) {
        setLabOutput(prev => [...prev, "[Fatal] Hypervisor crash.", error instanceof Error ? error.message : String(error)]);
    } finally {
        setIsExecuting(false);
    }
  };

  return (
    <div className="font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-sm font-black tracking-widest uppercase flex items-center gap-3 text-[var(--primary)]">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                Select Language
            </h1>
            
            <div className="flex items-center gap-2 glass dark:glass-dark p-1.5 rounded-xl border border-[var(--primary)]/10">
                {['c', 'cpp', 'python', 'java'].map((l) => (
                    <button
                        key={l}
                        onClick={() => {
                            setLang(l);
                            setCode(LANGUAGE_SAMPLES[l]);
                        }}
                        className={cn(
                            "px-6 py-2 rounded-lg text-xs font-black transition-all uppercase tracking-widest",
                            lang === l 
                                ? "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg scale-105" 
                                : "text-[var(--subtext)] hover:text-[var(--text)]"
                        )}
                    >
                        {l === 'cpp' ? 'c++' : l}
                    </button>
                ))}
            </div>
        </div>

        {/* Main Editor Frame */}
        <div className="relative group">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
            
            <div className="relative bg-[#0d1117] border border-[var(--primary)]/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col min-h-[600px] ring-1 ring-white/5">
                {/* Editor Header */}
                <div className="bg-[#161b22] px-8 py-4 border-b border-[var(--primary)]/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 font-mono text-xs flex items-center gap-2 font-black">
                            <ChevronRight size={14} className="text-[var(--accent)]" />
                            PETERSON_HYPERVISOR_ACTIVE
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                        <div className="w-3 h-3 rounded-full bg-slate-800" />
                    </div>
                </div>

                {/* Editor Content Area */}
                <div className="flex-1 flex flex-col relative">
                    <textarea 
                        className="flex-1 bg-transparent p-10 font-mono text-lg text-slate-300 focus:outline-none resize-none leading-relaxed overflow-y-auto font-black"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                    />

                    {/* Output Overlay */}
                    <AnimatePresence>
                        {showOutput && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute inset-x-8 bottom-32 bg-[#161b22]/95 backdrop-blur border border-[var(--primary)]/20 rounded-2xl p-6 shadow-2xl max-h-[300px] overflow-y-auto font-mono text-sm z-20"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[var(--accent)] font-black uppercase tracking-widest text-[10px]">Terminal Output</span>
                                    <button onClick={() => setShowOutput(false)} className="text-slate-500 hover:text-white transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {labOutput.map((line, i) => (
                                        <div key={i} className={cn(
                                            "font-black",
                                            line.startsWith("[System]") ? "text-slate-500" : 
                                            line.startsWith("[Fatal]") ? "text-red-400" : 
                                            line.startsWith("[Run]") ? "text-[var(--primary)]" :
                                            "text-[var(--accent)]"
                                        )}>
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Editor Footer Actions */}
                <div className="bg-[#161b22]/50 px-8 py-6 border-t border-[var(--primary)]/10 flex items-center justify-between">
                    <button 
                        onClick={resetCode}
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
                    >
                        <RotateCcw size={14} className="text-[var(--accent)]" />
                        Reset
                    </button>

                    <button 
                        onClick={executeAlgorithm}
                        disabled={isExecuting}
                        className="btn-gradient px-8 py-3 rounded-xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                        <span className="font-black text-xs uppercase tracking-widest">Execute</span>
                    </button>
                </div>

                {/* Ready Status Bar */}
                <div className="bg-[#0d1117] px-8 py-3 border-t border-[var(--primary)]/5 flex items-center gap-2">
                    <span className="text-slate-600 font-mono text-[10px]">&gt; ready_</span>
                </div>
            </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl border border-[var(--primary)]/10 glass dark:glass-dark shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-[var(--accent)] mb-4"><Cpu size={24} /></div>
                <h4 className="font-black mb-2 uppercase tracking-wide text-gradient">Virtual Core</h4>
                <p className="text-[var(--text)] font-black text-sm opacity-80 leading-relaxed">Execution is simulated in a sandboxed hypervisor environment optimized for disk scheduling trace analysis.</p>
            </div>
            <div className="p-6 rounded-3xl border border-[var(--primary)]/10 glass dark:glass-dark shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-[var(--accent)] mb-4"><HardDrive size={24} /></div>
                <h4 className="font-black mb-2 uppercase tracking-wide text-gradient">Disk Geometry</h4>
                <p className="text-[var(--text)] font-black text-sm opacity-80 leading-relaxed">Default range 0-199. You can override head position and queue parameters directly in your script.</p>
            </div>
            <div className="p-6 rounded-3xl border border-[var(--primary)]/10 glass dark:glass-dark shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-[var(--accent)] mb-4"><Database size={24} /></div>
                <h4 className="font-black mb-2 uppercase tracking-wide text-gradient">Output Logs</h4>
                <p className="text-[var(--text)] font-black text-sm opacity-80 leading-relaxed">Includes total seek count and step-by-step movement path for accurate performance benchmarking.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
