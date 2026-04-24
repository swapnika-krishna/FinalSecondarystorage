import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, RotateCcw, Plus, Trash2, Cpu, Database, Shield, Zap, HardDrive, Disc, Info, BookOpen, Activity, Shuffle, Pause } from 'lucide-react';
import { cn } from '../lib/utils';

export const Simulations = () => {
  const [activeTab, setActiveTab] = useState<'scheduling' | 'allocation' | 'raid' | 'storage'>('scheduling');

  return (
    <div className="space-y-8 min-h-screen bg-[var(--bg)] text-[var(--text)] p-4 sm:p-8">
      <div className="flex flex-wrap gap-2 p-1.5 bg-[var(--surface)] rounded-2xl w-fit shadow-2xl border border-[var(--primary)]/10 backdrop-blur-xl">
        {(['scheduling', 'allocation', 'raid', 'storage'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300",
              activeTab === tab 
                ? "bg-[var(--primary)] text-[var(--surface)] shadow-[0_0_20px_var(--primary-low)] scale-105" 
                : "text-[var(--text)]/40 hover:text-[var(--text)] hover:bg-[var(--primary)]/5"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'scheduling' && <DiskSchedulingSim />}
          {activeTab === 'allocation' && <FileAllocationSim />}
          {activeTab === 'raid' && <RAIDSim />}
          {activeTab === 'storage' && <HDDvsSSDSim />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const DiskSchedulingSim = () => {
  const [queue, setQueue] = useState<number[]>([98, 183, 37, 122, 14, 124, 65, 67]);
  const [head, setHead] = useState(53);
  const [algorithm, setAlgorithm] = useState<'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK'>('FCFS');
  const [results, setResults] = useState<any[]>([]);
  const [totalMovement, setTotalMovement] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedSteps, setSimulatedSteps] = useState<any[]>([]);
  const [speed] = useState(500);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startSimulation = () => {
    if (results.length === 0) return;
    
    if (isSimulating) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsSimulating(false);
      return;
    }

    setIsSimulating(true);
    
    let currentStepIndex = simulatedSteps.length;
    if (currentStepIndex >= results.length) {
      setSimulatedSteps([results[0]]);
      currentStepIndex = 1;
    }

    const id = setInterval(() => {
      setSimulatedSteps(prev => {
        if (currentStepIndex < results.length) {
          const next = results[currentStepIndex];
          currentStepIndex++;
          return [...prev, next];
        } else {
          clearInterval(id);
          setIntervalId(null);
          setIsSimulating(false);
          return prev;
        }
      });
    }, speed);

    setIntervalId(id);
  };

  const calculate = () => {
    let order: number[] = [head];
    let tempQueue = [...queue];
    let currentHead = head;
    let max = 199;

    if (algorithm === 'FCFS') {
      order = [head, ...queue];
    } else if (algorithm === 'SSTF') {
      while (tempQueue.length > 0) {
        let closestIdx = 0;
        let minDiff = Math.abs(tempQueue[0] - currentHead);
        
        for (let i = 1; i < tempQueue.length; i++) {
          let diff = Math.abs(tempQueue[i] - currentHead);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        }
        
        let closest = tempQueue[closestIdx];
        order.push(closest);
        tempQueue.splice(closestIdx, 1);
        currentHead = closest;
      }
    } else if (algorithm === 'SCAN') {
      const left = tempQueue.filter(x => x < head).sort((a, b) => b - a);
      const right = tempQueue.filter(x => x >= head).sort((a, b) => a - b);
      order = [head, ...right, max, ...left];
    } else if (algorithm === 'C-SCAN') {
      const left = tempQueue.filter(x => x < head).sort((a, b) => a - b);
      const right = tempQueue.filter(x => x >= head).sort((a, b) => a - b);
      order = [head, ...right, max, 0, ...left];
    } else if (algorithm === 'LOOK') {
       const left = tempQueue.filter(x => x < head).sort((a, b) => b - a);
       const right = tempQueue.filter(x => x >= head).sort((a, b) => a - b);
       order = [head, ...right, ...left];
    } else if (algorithm === 'C-LOOK') {
       const left = tempQueue.filter(x => x < head).sort((a, b) => a - b);
       const right = tempQueue.filter(x => x >= head).sort((a, b) => a - b);
       order = [head, ...right, ...left];
    }

    const data = order.map((pos, index) => ({
      request: index,
      position: pos,
    }));

    let movement = 0;
    for (let i = 1; i < order.length; i++) {
      movement += Math.abs(order[i] - order[i-1]);
    }

    setResults(data);
    setTotalMovement(movement);
    if (!isSimulating && data.length > 0) {
      setSimulatedSteps([data[0]]);
    }
  };

  useEffect(() => {
    calculate();
    setIsSimulating(false);
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
  }, [queue, head, algorithm]);

  const addRequest = (val: number) => {
    if (val >= 0 && val <= 199) setQueue([...queue, val]);
  };

  const randomizeQueue = () => {
    const newQueue = Array.from({ length: 8 }, () => Math.floor(Math.random() * 200));
    setQueue(newQueue);
  };

  const resetSimulation = () => {
    setSimulatedSteps([results[0]]);
    setIsSimulating(false);
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
  };

  const movementSoFar = simulatedSteps.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return 0;
    return acc + Math.abs((curr?.position || 0) - (arr[idx - 1]?.position || 0));
  }, 0);

  const avgSeekTime = simulatedSteps.length > 1 ? movementSoFar / (simulatedSteps.length - 1) : 0;
  const currentMoveDistance = simulatedSteps.length > 1 
    ? Math.abs((simulatedSteps[simulatedSteps.length - 1]?.position || 0) - (simulatedSteps[simulatedSteps.length - 2]?.position || 0))
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[var(--text)]">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[var(--surface)] shadow-2xl border border-[var(--primary)]/10 p-8 rounded-[2rem] backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Zap size={80} className="text-[var(--primary)]" />
          </div>
          <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-[var(--primary)] uppercase tracking-widest">
            <Cpu className="text-[var(--primary)]" /> Controls
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[var(--text)]/40">Algorithm</label>
              <div className="grid grid-cols-3 gap-2">
                {['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'].map(a => (
                  <button
                    key={a}
                    onClick={() => setAlgorithm(a as any)}
                    className={cn(
                      "px-2 py-2 rounded-lg text-[10px] font-black transition-all border",
                      algorithm === a 
                        ? "bg-[var(--primary)] text-[var(--surface)] border-[var(--primary)]" 
                        : "bg-[var(--text)]/5 text-[var(--text)]/40 border-transparent hover:border-[var(--primary)]/20"
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[var(--text)]/40">Initial Head (0-199)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="199"
                  value={head} 
                  onChange={(e) => setHead(Number(e.target.value))}
                  className="flex-1 accent-[var(--primary)]"
                />
                <span className="text-xl font-black text-[var(--primary)] min-w-[3ch]">{head}</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[var(--text)]/40">Add Request</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="e.g. 150"
                  className="flex-1 bg-[var(--text)]/5 border border-[var(--primary)]/10 rounded-xl px-4 py-3 text-[var(--text)] focus:ring-1 focus:ring-[var(--primary)]/30 outline-none transition-all font-bold"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addRequest(Number((e.target as any).value));
                      (e.target as any).value = '';
                    }
                  }}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[var(--text)]/40">Speed multiplier</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="50" 
                  max="2000"
                  step="50"
                  value={speed} 
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="flex-1 accent-[var(--secondary)]"
                />
                <span className="text-[10px] font-black text-[var(--secondary)] min-w-[5ch] uppercase">{speed}ms</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
               <button 
                  onClick={startSimulation}
                  disabled={queue.length === 0}
                  className={cn(
                    "flex-1 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl uppercase tracking-widest",
                    isSimulating 
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-600 hover:bg-amber-500/20" 
                      : "bg-[var(--primary)] text-[var(--surface)] shadow-[0_0_30px_var(--primary-low)]"
                  )}
                >
                  {isSimulating ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                  <span className="text-lg">{isSimulating ? 'Pause' : simulatedSteps.length > 1 && simulatedSteps.length < results.length ? 'Resume' : 'Start'}</span>
                </button>
                <button 
                  onClick={resetSimulation}
                  className="w-16 h-16 bg-[var(--text)]/5 border border-[var(--primary)]/10 text-[var(--text)]/40 rounded-2xl flex items-center justify-center hover:bg-[var(--text)]/10 transition-all"
                  title="Reset Simulation"
                >
                  <RotateCcw size={24} />
                </button>
                <button 
                  onClick={randomizeQueue}
                  className="w-16 h-16 bg-[var(--text)]/5 border border-[var(--primary)]/10 text-[var(--text)]/40 rounded-2xl flex items-center justify-center hover:bg-[var(--text)]/10 transition-all"
                  title="Randomize Queue"
                >
                  <Shuffle size={24} />
                </button>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] p-8 rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-3xl">
          <h3 className="text-xl font-black mb-6 text-[var(--primary)] uppercase tracking-widest">Queue</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {queue.map((q, i) => (
              <span key={i} className="px-4 py-2 bg-[var(--text)]/5 text-[var(--text)]/80 rounded-xl flex items-center gap-3 font-black text-xs border border-[var(--primary)]/10">
                {q}
                <button 
                  onClick={() => setQueue(queue.filter((_, idx) => idx !== i))} 
                  className="text-[var(--text)]/20 hover:text-[var(--primary)] transition-colors"
                  disabled={isSimulating}
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Move', value: totalMovement },
              { label: 'Current Move', value: currentMoveDistance },
              { label: 'Steps', value: `${Math.max(0, simulatedSteps.length - 1)}/${results.length > 0 ? results.length - 1 : 0}` },
              { label: 'Avg Seek', value: avgSeekTime.toFixed(1) }
            ].map((stat, i) => (
              <div key={i} className="p-5 bg-[var(--text)]/5 rounded-2xl border border-[var(--primary)]/10">
                <div className="text-[10px] text-[var(--text)]/30 uppercase font-black tracking-widest mb-1">{stat.label}</div>
                <div className="text-2xl font-black text-[var(--primary)]">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--primary)]/10 p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-[var(--text)] uppercase tracking-tighter">Movement Visualization</h3>
            <p className="text-[10px] font-black text-[var(--text)]/20 uppercase tracking-[0.3em] mt-1">Live Disk Arm Traversal</p>
          </div>
          {isSimulating && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-5 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-2xl"
            >
              <Activity size={14} className="text-[var(--primary)] animate-pulse" />
              <span className="text-[10px] font-black uppercase text-[var(--primary)] tracking-wider">Simulating...</span>
            </motion.div>
          )}
        </div>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={450}>
            <LineChart data={simulatedSteps} layout="vertical" margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--text)/3" opacity={0.1} />
              <XAxis 
                type="number" 
                domain={[0, 199]} 
                stroke="var(--text)/10" 
                tick={{ fill: 'var(--text)', opacity: 0.2, fontSize: 10, fontWeight: 900 }}
                axisLine={false}
              />
              <YAxis type="number" dataKey="request" reversed hide />
              <Tooltip 
                cursor={{ stroke: 'var(--text)', strokeOpacity: 0.05, strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[var(--surface)] border border-[var(--primary)]/10 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl text-[var(--text)]">
                        <p className="text-[10px] font-black uppercase text-[var(--primary)] mb-1">Position</p>
                        <p className="text-2xl font-black">{payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Background Path (Full results) */}
              <Line 
                type="linear" 
                data={results}
                dataKey="position" 
                stroke="var(--text)" 
                strokeOpacity={0.05}
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={false}
              />
              {/* Foreground Path (Simulated) */}
              <Line 
                type="linear" 
                dataKey="position" 
                stroke="var(--primary)" 
                strokeWidth={4} 
                className="drop-shadow-[0_0_15px_var(--primary-low)]"
                dot={(props: any) => {
                  const { cx, cy, index } = props;
                  if (!cx || !cy) return null;
                  const isLast = index === simulatedSteps.length - 1;
                  const isHead = index === 0;
                  return (
                    <g key={`dot-${index}`}>
                      {isLast && (
                        <circle cx={cx} cy={cy} r={15} fill="var(--primary)" opacity={0.1} className="animate-ping" />
                      )}
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isLast ? 7 : 5} 
                        fill={isLast || isHead ? "var(--secondary)" : "var(--surface)"} 
                        stroke={isLast || isHead ? "var(--secondary)" : "var(--primary)"} 
                        strokeWidth={2} 
                      />
                    </g>
                  );
                }}
                isAnimationActive={!isSimulating}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-3 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
              <h5 className="font-black mb-4 flex items-center gap-3 text-[var(--primary)] uppercase tracking-widest text-sm">
                  <Info size={18} /> Scheduling
              </h5>
              <p className="text-xs text-[var(--text)]/40 leading-relaxed font-bold uppercase tracking-wider">
                  Disk scheduling algorithms manage the order of O/S I/O requests. Efficient ordering is critical because disk heads must physically move.
              </p>
          </div>
          <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
              <h5 className="font-black mb-4 flex items-center gap-3 text-[var(--primary)] uppercase tracking-widest text-sm">
                  <Cpu size={18} /> Performance
              </h5>
              <p className="text-xs text-[var(--text)]/40 leading-relaxed font-bold uppercase tracking-wider">
                  Minimize <b>Seek Time</b> (time to find a track). Optimized algorithms reduce wear and prevent system bottlenecks.
              </p>
          </div>
          <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-[0_0_30px_var(--primary-low)] backdrop-blur-xl border-dashed">
              <h5 className="font-black text-[var(--secondary)] mb-4 flex items-center gap-3 uppercase tracking-widest text-sm">
                  <Play size={18} /> Simulator
              </h5>
              <ol className="text-[10px] text-[var(--text)]/60 list-decimal ml-4 space-y-2 font-black uppercase tracking-tight">
                  <li>Pick an <span className="text-[var(--primary)]">Algorithm</span> (e.g., SSTF).</li>
                  <li>Set <span className="text-[var(--primary)]">Initial Head</span> position.</li>
                  <li>Add/Randomize <span className="text-[var(--primary)]">Queue</span> requests.</li>
                  <li>Compare <span className="text-[var(--secondary)]">Total Movement</span>.</li>
              </ol>
          </div>
      </div>
    </div>
  );
};

const FileAllocationSim = () => {
  const [method, setMethod] = useState<'Contiguous' | 'Linked' | 'Indexed'>('Contiguous');
  const [blockSize] = useState(24);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [files, setFiles] = useState<{ name: string; color: string; blocks: number[] }[]>([]);

  useEffect(() => {
    const initial = Array.from({ length: blockSize }).map((_, i) => ({ id: i, usedBy: null }));
    setBlocks(initial);
  }, []);

  const allocate = () => {
    const size = Math.floor(Math.random() * 4) + 2;
    const name = `File${files.length + 1}`;
    const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    let allocated: number[] = [];

    const freeIndices = blocks.map((b, i) => b.usedBy === null ? i : -1).filter(i => i !== -1);
    
    if (freeIndices.length < size) {
      alert("No space!");
      return;
    }

    if (method === 'Contiguous') {
      for (let i = 0; i <= blockSize - size; i++) {
        const span = blocks.slice(i, i + size);
        if (span.every(s => s.usedBy === null)) {
          allocated = Array.from({ length: size }).map((_, idx) => i + idx);
          break;
        }
      }
    } else {
      allocated = freeIndices.sort(() => Math.random() - 0.5).slice(0, size);
    }

    if (allocated.length > 0) {
      const newBlocks = [...blocks];
      allocated.forEach(idx => newBlocks[idx].usedBy = name);
      setBlocks(newBlocks);
      setFiles([...files, { name, color, blocks: allocated }]);
    } else {
      alert("Could not find continuous block!");
    }
  };

  const reset = () => {
    setBlocks(blocks.map(b => ({ ...b, usedBy: null })));
    setFiles([]);
  };

  return (
    <div className="space-y-6 text-[var(--text)]">
      <div className="flex justify-between items-center bg-[var(--surface)] p-8 rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
        <div className="flex gap-4">
          <select 
            value={method} 
            onChange={(e: any) => setMethod(e.target.value)}
            className="bg-[var(--text)]/5 border border-[var(--primary)]/10 rounded-xl px-6 py-2.5 font-black text-xs uppercase tracking-widest text-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 outline-none transition-all shadow-xl"
          >
            <option value="Contiguous">Contiguous</option>
            <option value="Linked">Linked</option>
            <option value="Indexed">Indexed</option>
          </select>
          <button 
            onClick={allocate}
            className="px-8 py-2.5 bg-[var(--primary)] text-[var(--surface)] rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_var(--primary-low)]"
          >
            <Plus size={16} /> Allocate File
          </button>
          <button 
            onClick={reset}
            className="px-6 py-2.5 bg-[var(--text)]/5 text-[var(--text)]/40 border border-[var(--primary)]/10 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[var(--text)]/10 transition-all"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[var(--text)]/30 uppercase font-black tracking-widest mb-1">Files Active</div>
          <div className="text-3xl font-black text-[var(--primary)]">{files.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {blocks.map((block, i) => {
          const file = files.find(f => f.name === block.usedBy);
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              className={cn(
                "aspect-square rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all duration-300",
                block.usedBy 
                  ? "border-transparent text-white shadow-xl" 
                  : "bg-[var(--surface)] border-dashed border-[var(--primary)]/10 text-[var(--text)]/10"
              )}
              style={file ? { backgroundColor: file.color, boxShadow: `0 0 15px ${file.color}33` } : {}}
            >
              {i}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] p-8 rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
          <h4 className="font-black mb-6 text-[var(--primary)] uppercase tracking-widest text-sm flex items-center gap-2">
            <Info size={16} /> File Details
          </h4>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {files.map(f => (
              <div key={f.name} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--text)]/5 border border-[var(--primary)]/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: f.color }} />
                  <span className="font-black text-xs uppercase text-[var(--text)]/80">{f.name}</span>
                </div>
                <div className="text-[10px] font-black opacity-30 tracking-tighter text-[var(--text)]">
                   {method === 'Linked' 
                     ? f.blocks.join(' → ') 
                     : method === 'Indexed' 
                       ? `Index ${f.blocks[0]} [${f.blocks.slice(1).join(', ')}]`
                       : `Blocks [${f.blocks.join(', ')}]`}
                </div>
              </div>
            ))}
            {files.length === 0 && <p className="text-[var(--text)]/20 text-xs font-black uppercase italic p-4">No files allocated</p>}
          </div>
        </div>
        <div className="bg-[var(--surface)] p-8 rounded-[2rem] border border-[var(--primary)]/10 flex flex-col justify-center items-center text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Database size={200} className="absolute -bottom-10 -right-10" />
          </div>
          <Database size={48} className="text-[var(--secondary)] mb-6" />
          <h4 className="font-black text-xl mb-4 text-[var(--text)] uppercase tracking-tighter">{method} Logic</h4>
          <p className="text-xs text-[var(--text)]/40 font-bold uppercase tracking-wider leading-relaxed max-w-xs">
            {method === 'Contiguous' && "Files must occupy a continuous set of blocks. Fast, but hard to grow files."}
            {method === 'Linked' && "Each block contains a pointer to the next block. No fragmentation, but slow direct access."}
            {method === 'Indexed' && "An index block holds pointers to all data blocks. Efficient direct access with no fragmentation."}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
              <h5 className="font-black mb-4 flex items-center gap-3 text-[var(--primary)] uppercase tracking-widest text-sm">
                  <Info size={18} /> Allocation
              </h5>
              <p className="text-xs text-[var(--text)]/40 leading-relaxed font-bold uppercase tracking-wider">
                  File allocation methods determine how the operating system stores file data in disk blocks. It defines the mapping between a logical file and the physical storage units.
              </p>
          </div>
          <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
              <h5 className="font-black mb-4 flex items-center gap-3 text-[var(--primary)] uppercase tracking-widest text-sm">
                  <Database size={18} /> Optimization
              </h5>
              <p className="text-xs text-[var(--text)]/40 leading-relaxed font-bold uppercase tracking-wider">
                  Ensures <b>efficient disk space</b> and <b>fast access</b>. Different methods balance fragmentation, speed, and ease of file growth.
              </p>
          </div>
          <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-[0_0_30px_var(--primary-low)] backdrop-blur-xl border-dashed">
              <h5 className="font-black text-[var(--secondary)] mb-4 flex items-center gap-3 uppercase tracking-widest text-sm">
                  <Play size={18} /> Simulator
              </h5>
              <ol className="text-[10px] text-[var(--text)]/60 list-decimal ml-4 space-y-2 font-black uppercase tracking-tight">
                  <li>Pick an <span className="text-[var(--primary)]">Method</span>.</li>
                  <li>Click <span className="text-[var(--primary)]">Allocate File</span>.</li>
                  <li>Observe <span className="text-[var(--primary)]">Block Distribution</span>.</li>
                  <li>Use <span className="text-[var(--secondary)]">Reset</span> for a new test.</li>
              </ol>
          </div>
      </div>
    </div>
  );
};

const RAIDSim = () => {
    const [level, setLevel] = React.useState<'0' | '1' | '5'>('0');
    const [drives, setDrives] = React.useState<any[][]>([[], [], []]);
    const [isWriting, setIsWriting] = React.useState(false);

    const reset = () => setDrives([[], [], []]);

    const writeData = async () => {
        if (isWriting) return;
        setIsWriting(true);
        
        const newDrives = [...drives];
        const dataCount = level === '5' ? 4 : 4;

        for (let i = 0; i < dataCount; i++) {
            await new Promise(r => setTimeout(r, 600));
            
            if (level === '0') {
                const driveIdx = i % 2;
                newDrives[driveIdx] = [...newDrives[driveIdx], { type: 'data', id: i }];
            } else if (level === '1') {
                newDrives[0] = [...newDrives[0], { type: 'data', id: i }];
                newDrives[1] = [...newDrives[1], { type: 'data', id: i }];
            } else if (level === '5') {
                const parityIdx = i % 3;
                const dataIndices = [0, 1, 2].filter(idx => idx !== parityIdx);
                newDrives[parityIdx] = [...newDrives[parityIdx], { type: 'parity', id: i }];
                dataIndices.forEach(idx => {
                    newDrives[idx] = [...newDrives[idx], { type: 'data', id: i }];
                });
            }
            setDrives([...newDrives]);
        }
        setIsWriting(false);
    };

    return (
        <div className="space-y-8 text-[var(--text)]">
            <div className="flex flex-wrap gap-4 justify-between items-end">
                <div className="space-y-6">
                    <h3 className="text-2xl font-black flex items-center gap-3 text-[var(--primary)] uppercase tracking-tighter">
                        <Shield className="text-[var(--primary)]" />
                        RAID Simulator
                    </h3>
                    <div className="flex gap-2 p-1.5 bg-[var(--surface)] rounded-2xl w-fit border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
                        {(['0', '1', '5'] as const).map(l => (
                            <button
                                key={l}
                                onClick={() => { setLevel(l); reset(); }}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    level === l 
                                    ? 'bg-[var(--secondary)] text-white shadow-[0_0_20px_var(--secondary-low)]' 
                                    : 'text-[var(--text)]/40 hover:text-[var(--text)] hover:bg-[var(--primary)]/5'
                                }`}
                            >
                                RAID {l}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={reset}
                        className="px-8 py-3 rounded-2xl bg-[var(--text)]/5 text-[var(--text)]/40 border border-[var(--primary)]/10 font-black uppercase text-xs tracking-widest hover:bg-[var(--text)]/10 transition-all shadow-xl"
                    >
                        <RotateCcw size={16} className="inline mr-2" /> Reset
                    </button>
                    <button 
                        onClick={writeData}
                        disabled={isWriting}
                        className="px-8 py-3 rounded-2xl bg-[var(--primary)] text-[var(--surface)] font-black uppercase text-xs tracking-widest hover:opacity-90 disabled:opacity-30 transition-all shadow-[0_0_30px_var(--primary-low)]"
                    >
                        {isWriting ? 'Writing...' : 'Write Data'}
                    </button>
                </div>
            </div>

            <div className="bg-[var(--bg)] p-10 rounded-[2.5rem] border border-[var(--primary)]/10 min-h-[450px] shadow-inner relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Shield size={300} />
                </div>
                <div className="grid grid-cols-3 gap-10 relative z-10">
                    {[0, 1, 2].map(driveIdx => {
                        if (level !== '5' && driveIdx === 2) return null;
                        return (
                            <div key={driveIdx} className="flex flex-col items-center">
                                <div className="mb-6 text-[var(--text)]/20 flex flex-col items-center group">
                                    <Database size={40} className="mb-3 transition-transform group-hover:scale-110 text-[var(--primary)]/40" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Drive {String.fromCharCode(65 + driveIdx)}</span>
                                </div>
                                <div className="w-full h-80 bg-[var(--surface)] rounded-3xl border border-[var(--primary)]/10 p-3 flex flex-col-reverse gap-3 overflow-hidden shadow-2xl backdrop-blur-xl">
                                    <AnimatePresence>
                                        {drives[driveIdx].map((block, i) => (
                                            <motion.div
                                                key={`${block.id}-${block.type}-${i}`}
                                                initial={{ scale: 0, y: -100, rotateX: 90 }}
                                                animate={{ scale: 1, y: 0, rotateX: 0 }}
                                                className={`h-14 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest border-b-4 ${
                                                    block.type === 'parity'
                                                    ? 'bg-[var(--secondary)]/20 border-[var(--secondary)] text-[var(--secondary)] shadow-[0_0_15px_var(--secondary-low)]'
                                                    : 'bg-[var(--primary)]/10 border-[var(--primary)]/60 text-[var(--primary)] shadow-[0_0_15px_var(--primary-low)]'
                                                }`}
                                            >
                                                {block.type} {block.id}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {drives[driveIdx].length === 0 && (
                                        <div className="flex-1 flex items-center justify-center border border-dashed border-[var(--primary)]/10 rounded-2xl">
                                          <span className="text-[10px] font-black uppercase text-[var(--text)]/5 tracking-widest">Ready</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 p-8 bg-[var(--secondary)]/10 border border-[var(--secondary)]/20 text-[var(--text)] rounded-3xl shadow-2xl backdrop-blur-xl">
                    <h4 className="font-black text-xl mb-3 text-[var(--secondary)] uppercase tracking-tighter">
                        {level === '0' && "RAID 0: Striping"}
                        {level === '1' && "RAID 1: Mirroring"}
                        {level === '5' && "RAID 5: Distributed Parity"}
                    </h4>
                    <p className="text-[var(--text)]/40 text-xs leading-relaxed font-bold uppercase tracking-wider">
                        {level === '0' && "Data is split across drives for maximum performance. If one drive fails, ALL data is lost."}
                        {level === '1' && "Data is copied identically to both drives. If one fails, the other keeps everything safe."}
                        {level === '5' && "Data is split across 3+ drives with parity (checksums). Can survive 1 drive failure with optimal capacity."}
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
                        <h5 className="font-black text-[var(--primary)] mb-4 flex items-center gap-3 uppercase tracking-widest text-xs">
                            <Info size={18} /> Purpose
                        </h5>
                        <p className="text-xs text-[var(--text)]/40 leading-relaxed font-bold uppercase tracking-wider">
                            Visualizes how different RAID levels distribute data across physical disks to achieve speed or safety.
                        </p>
                    </div>
                    <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
                        <h5 className="font-black text-[var(--primary)] mb-4 flex items-center gap-3 uppercase tracking-widest text-xs">
                            <Play size={18} /> Execution
                        </h5>
                        <ol className="text-[10px] text-[var(--text)]/60 list-decimal ml-4 space-y-2 font-black uppercase tracking-tight">
                            <li>Select a <b>RAID Level</b> (0, 1, or 5)</li>
                            <li>Click <b>Write Data</b> to start</li>
                            <li>Watch blocks and parity placement</li>
                            <li>Use <b>Reset</b> for a new level</li>
                        </ol>
                    </div>
                    <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-[0_0_30px_var(--primary-low)] backdrop-blur-xl border-dashed">
                        <h5 className="font-black text-[var(--secondary)] mb-4 flex items-center gap-3 uppercase tracking-widest text-xs">
                            <BookOpen size={18} /> Real-world
                        </h5>
                        <p className="text-xs text-[var(--text)]/40 leading-relaxed font-bold uppercase tracking-wider">
                            Used in servers and NAS devices to protect against failures and speed up large databases.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HDDvsSSDSim = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[var(--text)]">
            <div className="p-10 bg-[var(--surface)] rounded-[2.5rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <HardDrive size={200} />
                </div>
                <HardDrive size={32} className="text-[var(--primary)] mb-6" />
                <h3 className="text-2xl font-black mb-6 text-[var(--text)] uppercase tracking-tighter">HDD Mechanism</h3>
                <div className="aspect-square bg-[var(--bg)] rounded-full border-8 border-[var(--primary)]/10 relative overflow-hidden animate-spin-slow shadow-inner max-w-[300px] mx-auto">
                   <div className="absolute inset-x-1/2 top-8 bottom-1/2 w-1.5 bg-gradient-to-t from-[var(--primary)] to-transparent origin-bottom rounded-full" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-10">
                       <Disc size={250} className="text-[var(--primary)]" />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-br from-[var(--text)]/5 to-transparent pointer-events-none" />
                </div>
                <p className="mt-10 text-xs text-[var(--text)]/40 font-bold uppercase tracking-widest leading-relaxed text-center">Relies on moving arm and spinning disk. Slower access times <span className="text-[var(--primary)]">(~4-15ms)</span>.</p>
            </div>
            <div className="p-10 bg-[var(--surface)] rounded-[2.5rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Cpu size={200} />
                </div>
                <Cpu size={32} className="text-[var(--secondary)] mb-6" />
                <h3 className="text-2xl font-black mb-6 text-[var(--text)] uppercase tracking-tighter">SSD Mechanism</h3>
                <div className="aspect-square grid grid-cols-4 grid-rows-4 gap-3 p-10 max-w-[300px] mx-auto">
                   {Array.from({length: 16}).map((_, i) => (
                       <motion.div 
                        key={i}
                        animate={{ 
                          opacity: [0.2, 1, 0.2],
                          scale: [0.95, 1, 0.95]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                        className="rounded-xl border border-[var(--primary)]/10 shadow-xl bg-[var(--primary)]/10"
                       />
                   ))}
                </div>
                <p className="mt-10 text-xs text-[var(--text)]/40 font-bold uppercase tracking-widest leading-relaxed text-center">Flash memory based. No moving parts. Near-instant access <span className="text-[var(--secondary)]">(&lt;0.1ms)</span>.</p>
            </div>

            <div className="md:col-span-2 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
                    <h5 className="font-black text-[var(--primary)] mb-4 flex items-center gap-3 uppercase tracking-widest text-xs">
                        <Info size={18} /> Comparison
                    </h5>
                    <p className="text-xs text-[var(--text)]/40 leading-relaxed font-bold uppercase tracking-wider">
                        Visualizes the fundamental difference between mechanical spinning disks (HDD) and electronic flash memory (SSD).
                    </p>
                </div>
                <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-2xl backdrop-blur-xl">
                    <h5 className="font-black text-[var(--primary)] mb-4 flex items-center gap-3 uppercase tracking-widest text-xs">
                        <Play size={18} /> Usage
                    </h5>
                    <ul className="text-[10px] text-[var(--text)]/60 space-y-2 font-black uppercase tracking-tight">
                        <li>Observe the <span className="text-[var(--primary)]">spinning disk</span> in HDD.</li>
                        <li>Notice the <span className="text-[var(--secondary)]">pulsing chips</span> in SSD.</li>
                        <li>Compare access speeds mentioned above.</li>
                    </ul>
                </div>
                <div className="p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--primary)]/10 shadow-[0_0_30px_var(--primary-low)] backdrop-blur-xl border-dashed">
                    <h5 className="font-black text-[var(--secondary)] mb-4 flex items-center gap-3 uppercase tracking-widest text-xs">
                        <BookOpen size={18} /> Efficiency
                    </h5>
                    <p className="text-xs text-[var(--text)]/40 leading-relaxed font-bold uppercase tracking-wider">
                        SSDs for fast booting and high-performance tasks. HDDs for massive bulk storage at lower costs.
                    </p>
                </div>
            </div>
        </div>
    );
}

