import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, CheckCircle2, XCircle, Trophy, ChevronRight, RotateCcw, Database } from 'lucide-react';
import { cn } from '../lib/utils';

type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
};

const QUIZ_DATA: Record<'Basic' | 'Intermediate' | 'High', Question[]> = {
  Basic: [
    {
      id: 1,
      text: "Which of these is a volatile memory?",
      options: ["HDD", "SSD", "RAM", "ROM"],
      correct: 2,
      explanation: "RAM is primary volatile memory, meaning it loses data when power is cut. Secondary storage like HDD/SSD is non-volatile."
    },
    {
      id: 2,
      text: "What is the smallest physical storage unit on a disk?",
      options: ["Track", "Sector", "Cylinder", "Platter"],
      correct: 1,
      explanation: "A sector is the smallest unit that can be read or written to on a disk."
    },
    {
      id: 3,
      text: "What does FCFS stand for in disk scheduling?",
      options: ["First Choice First Served", "Fast Choice Fast Serve", "First Come First Serve", "File Connection File System"],
      correct: 2,
      explanation: "FCFS handles requests in the order they arrive."
    },
    {
      id: 4,
      text: "Which device is considered secondary storage?",
      options: ["Registers", "L1 Cache", "Hard Disk", "RAM"],
      correct: 2,
      explanation: "Hard Disks are secondary storage because they provide persistent, non-volatile data storage."
    },
    {
      id: 5,
      text: "What is the main component of a Hard Disk Drive that spins?",
      options: ["Actuator", "Platter", "Arm", "Controller"],
      correct: 1,
      explanation: "The platter is the circular magnetic disk that stores the data and rotates at high speeds."
    },
    {
      id: 6,
      text: "What does SSD stand for?",
      options: ["Solid State Drive", "Static State Disk", "System Storage Device", "Super Speed Drive"],
      correct: 0,
      explanation: "Solid State Drive uses flash memory and has no moving parts, unlike HDDs."
    },
    {
      id: 7,
      text: "Which of these is an example of optical storage?",
      options: ["USB Drive", "DVD", "HDD", "SD Card"],
      correct: 1,
      explanation: "DVDs use laser technology to read and write data, making them optical storage."
    },
    {
      id: 8,
      text: "The time taken to move the disk arm to the desired track is called:",
      options: ["Latency", "Seek Time", "Transfer Time", "Access Time"],
      correct: 1,
      explanation: "Seek Time is the time required for the read/write head to move to the correct cylinder."
    },
    {
      id: 9,
      text: "The time taken for the desired sector to rotate under the head is:",
      options: ["Seek Time", "Wait Time", "Rotational Latency", "Transmission Time"],
      correct: 2,
      explanation: "Rotational Latency depends on the RPM (Revolutions Per Minute) of the disk."
    },
    {
      id: 10,
      text: "Which interface is commonly used to connect storage devices today?",
      options: ["SATA", "Parallel Port", "VGA", "PS/2"],
      correct: 0,
      explanation: "SATA (Serial ATA) is the standard interface for connecting HDDs and SSDs to the motherboard."
    },
    {
      id: 11,
      text: "A set of tracks at a given arm position across all platters is a:",
      options: ["Sector", "Cylinder", "Cluster", "Block"],
      correct: 1,
      explanation: "A cylinder consists of all tracks that are at the same distance from the center."
    },
    {
      id: 12,
      text: "What happens to data in a secondary storage device when the computer is turned off?",
      options: ["It is erased", "It is moved to RAM", "It remains saved", "It becomes corrupted"],
      correct: 2,
      explanation: "Secondary storage is non-volatile, meaning it retains data without power."
    },
    {
      id: 13,
      text: "Which storage is fastest for the CPU to access?",
      options: ["HDD", "SSD", "RAM", "Magnetic Tape"],
      correct: 2,
      explanation: "RAM (Primary storage) is much faster than secondary storage like HDD/SSD but is volatile."
    },
    {
      id: 14,
      text: "What is the process of dividing a disk into logical drives called?",
      options: ["Formatting", "Partitioning", "Sectoring", "Clustering"],
      correct: 1,
      explanation: "Partitioning allows a single physical disk to appear as multiple logical volumes."
    },
    {
      id: 15,
      text: "Which unit is typically used to measure HDD capacity today?",
      options: ["Megabytes (MB)", "Kilobytes (KB)", "Terabytes (TB)", "Hertz (Hz)"],
      correct: 2,
      explanation: "Modern consumer HDDs range from 1TB to 20TB+."
    },
    {
      id: 16,
      text: "Which of these storage devices uses flash memory?",
      options: ["HDD", "Floppy Disk", "USB Flash Drive", "CD-ROM"],
      correct: 2,
      explanation: "USB drives and SSDs use NAND flash memory chips."
    },
    {
      id: 17,
      text: "The process of preparing a disk for first-time use is:",
      options: ["Formatting", "Booting", "Loading", "Caching"],
      correct: 0,
      explanation: "Formatting sets up the file system structure on the disk."
    },
    {
      id: 18,
      text: "What is a major advantage of SSD over HDD?",
      options: ["Cheaper per GB", "No moving parts", "Larger maximum capacity", "Longer shelf life"],
      correct: 1,
      explanation: "No moving parts means SSDs are silent, cooler, and much more resistant to physical shock."
    },
    {
      id: 19,
      text: "Which of these is 'Direct Access' storage?",
      options: ["Magnetic Tape", "Hard Disk", "Paper Tape", "Punch Cards"],
      correct: 1,
      explanation: "Hard Disks allow direct access to any block, whereas tapes require sequential reading."
    },
    {
      id: 20,
      text: "What is the primary function of secondary storage?",
      options: ["Executing programs", "Processing data", "Long-term data preservation", "Speeding up the internet"],
      correct: 2,
      explanation: "Secondary storage is designed for permanent and long-term data storage."
    }
  ],
  Intermediate: [
    {
      id: 1,
      text: "Which scheduling algorithm can cause starvation for distant requests?",
      options: ["FCFS", "SSTF", "SCAN", "C-SCAN"],
      correct: 1,
      explanation: "SSTF (Shortest Seek Time First) always picks the closest request, potentially 'starving' requests far from the current head position."
    },
    {
      id: 2,
      text: "In C-SCAN, how does the head move after reaching the end?",
      options: ["Stops", "Reverses", "Returns to start immediately", "Stays at end"],
      correct: 2,
      explanation: "C-SCAN (Circular SCAN) returns to the beginning to ensure a more uniform wait time for all tracks."
    },
    {
      id: 3,
      text: "Which algorithm is also known as the 'Elevator Algorithm'?",
      options: ["SSTF", "FCFS", "SCAN", "LOOK"],
      correct: 2,
      explanation: "SCAN moves from one end to the other, servicing requests along the way, just like an elevator."
    },
    {
      id: 4,
      text: "What is the difference between LOOK and SCAN algorithms?",
      options: ["LOOK is faster", "LOOK reverses at the last request, not the disk end", "SCAN is only for SSDs", "There is no difference"],
      correct: 1,
      explanation: "LOOK 'looks' ahead to see if there are more requests. If not, it reverses without going all the way to the disk edge."
    },
    {
      id: 5,
      text: "What is the formula for Disk Bandwidth?",
      options: ["Total Bytes / Total Access Time", "Seek Time + Latency", "Rotational Speed / 2", "Number of Cylinders / Sectors"],
      correct: 0,
      explanation: "Bandwidth measures the total amount of data transferred divided by the total time from first request to last transfer."
    },
    {
      id: 6,
      text: "Which algorithm provides the most 'fair' or uniform wait time?",
      options: ["SSTF", "SCAN", "C-SCAN", "FCFS"],
      correct: 2,
      explanation: "C-SCAN treats the cylinders as a circular list, ensuring the wait time is roughly the same for any sector."
    },
    {
      id: 7,
      text: "Logical Block Addressing (LBA) maps blocks to:",
      options: ["Real physical tracks/sectors", "Indices in a 1D array", "Directories", "Virtual memory pages"],
      correct: 1,
      explanation: "LBA simplifies addressing by presenting the disk as a linear array of blocks to the OS."
    },
    {
      id: 8,
      text: "What component handles the mapping between LBA and physical addresses inside the drive?",
      options: ["OS Kernel", "CPU", "Disk Controller", "RAM"],
      correct: 2,
      explanation: "The disk controller manages the low-level hardware details and geometry mapping."
    },
    {
      id: 9,
      text: "Fragmentation that occurs when a file is stored in non-adjacent blocks is:",
      options: ["Internal fragmentation", "External fragmentation", "Logical fragmentation", "Bit-rot"],
      correct: 1,
      explanation: "External fragmentation in disks refers to file blocks being scattered, slowing down read speeds (seek time)."
    },
    {
      id: 10,
      text: "A 'Bad Block' is usually managed by:",
      options: ["Sector Sparing", "Deleting the file", "Ignoring the disk", "Formatting"],
      correct: 0,
      explanation: "Sector sparing (or forwarding) uses spare sectors to replace ones that have physically failed."
    },
    {
      id: 11,
      text: "What is the average rotational latency for a 7200 RPM disk?",
      options: ["Approx 4.17ms", "Approx 8.35ms", "Exactly 1ms", "10ms"],
      correct: 0,
      explanation: "One rotation takes 1/120 secs (~8.33ms). Average latency is half a rotation (~4.17ms)."
    },
    {
      id: 12,
      text: "Which of these is NOT a component of total disk access time?",
      options: ["Seek Time", "Rotational Latency", "Context switch time", "Transfer Time"],
      correct: 2,
      explanation: "Disk access time consists of Seek + Latency + Transfer. Context switching is an OS overhead, not disk hardware time."
    },
    {
      id: 13,
      text: "In C-LOOK, where does the head move after the last request in one direction?",
      options: ["To the disk edge", "To the first request in the same direction", "To the lowest pending request", "It stops"],
      correct: 2,
      explanation: "C-LOOK returns to the first pending request on the other side instead of going to the very edge (cylinder 0)."
    },
    {
      id: 14,
      text: "What does MB/s measure in storage simulation?",
      options: ["Rotational speed", "Throughput", "Capacity", "Power consumption"],
      correct: 1,
      explanation: "Throughput (or Transfer Rate) is measured in data units per second (KB/s, MB/s, GB/s)."
    },
    {
      id: 15,
      text: "Shortest Seek Time First (SSTF) aims to minimize:",
      options: ["Rotational latency", "Total head movement", "Power usage", "CPU cycles"],
      correct: 1,
      explanation: "By always picking the nearest candidate, SSTF reduces the total distance the arm travels."
    },
    {
      id: 16,
      text: "Why is FCFS considered inefficient?",
      options: ["It causes starvation", "It has complex logic", "It results in large head movements", "It is expensive"],
      correct: 2,
      explanation: "FCFS doesn't optimize for location, potentially moving the head back and forth across the whole disk for adjacent requests."
    },
    {
      id: 17,
      text: "What is swap space used for?",
      options: ["Fast file storage", "Extending physical memory into the disk", "Recording logs", "Backup"],
      correct: 1,
      explanation: "Virtual memory uses swap space on the disk to handle more data than fits in physical RAM."
    },
    {
      id: 18,
      text: "Modern disks use which technique to improve performance by reordering requests?",
      options: ["I/O Queuing (NCQ/TCQ)", "Zeroing", "Spin-up", "Head-parking"],
      correct: 0,
      explanation: "Native Command Queuing (NCQ) allows the drive to decide the most efficient order to fulfill requests."
    },
    {
      id: 19,
      text: "The directory structure on a disk is used to:",
      options: ["Store actual data", "Translate file names into block addresses", "Clean the disk", "Compress videos"],
      correct: 1,
      explanation: "Directories map human-readable names to internal system identifiers like Inodes or block start addresses."
    },
    {
      id: 20,
      text: "Which scheduling algorithm is best for a system with heavy disk load?",
      options: ["FCFS", "SCAN/C-SCAN", "SSTF", "FIFO"],
      correct: 1,
      explanation: "Elevator-based algorithms prevent starvation and handle high volumes of scattered requests more effectively."
    }
  ],
  High: [
    {
      id: 1,
      text: "Which RAID level provides striping with distributed parity?",
      options: ["RAID 0", "RAID 1", "RAID 5", "RAID 10"],
      correct: 2,
      explanation: "RAID 5 uses block-level striping and distributes parity across all disks to handle single drive failure."
    },
    {
      id: 2,
      text: "What is the main advantage of Indexed Allocation over Contiguous?",
      options: ["Faster sequential access", "No external fragmentation", "Lower overhead", "No index block needed"],
      correct: 1,
      explanation: "Indexed allocation allows non-contiguous block usage, eliminating external fragmentation while supporting direct access."
    },
    {
      id: 3,
      text: "What is 'Wear Leveling' in the context of SSDs?",
      options: ["Cleaning the drive face", "Moving data to ensure even use of all flash cells", "Physical grinding of disks", "Adjusting voltage"],
      correct: 1,
      explanation: "Flash cells have limited write cycles; wear leveling ensures they all wear down at the same rate to prevent early failure."
    },
    {
      id: 4,
      text: "RAID 1+0 (RAID 10) is a combination of:",
      options: ["Striping and Parity", "Mirroring and Striping", "Mirroring and Parity", "Speed and low cost"],
      correct: 1,
      explanation: "RAID 10 creates a stripe of mirrors, offering both the speed of RAID 0 and the redundancy of RAID 1."
    },
    {
      id: 5,
      text: "The 'Write Amplification' in SSDs refers to:",
      options: ["Louder sound during writes", "More data physically written than logically requested", "Faster write speeds", "Better redundancy"],
      correct: 1,
      explanation: "Because flash must be erased in large blocks before writing, small logical writes can trigger large internal physical writes."
    },
    {
      id: 6,
      text: "Which allocation method suffers most from External Fragmentation?",
      options: ["Linked Allocation", "Indexed Allocation", "Contiguous Allocation", "None"],
      correct: 2,
      explanation: "Contiguous allocation requires a single unbroken sequence of blocks, which becomes hard to find as the disk fills up."
    },
    {
      id: 7,
      text: "In Linked Allocation, how are blocks found?",
      options: ["A central index table", "Each block contains a pointer to the next", "Mathematical formula", "Pre-calculated offset"],
      correct: 1,
      explanation: "Each block uses a few bytes to point to the next block, forming a chain (linked list)."
    },
    {
      id: 8,
      text: "What happens if the Parity disk fails in RAID 4?",
      options: ["All data is lost", "System can still function, but redundancy is lost", "It becomes RAID 0", "Drives explode"],
      correct: 1,
      explanation: "Data is still available on the other disks, but the system can no longer survive another drive failure until parity is rebuilt."
    },
    {
      id: 9,
      text: "Storage Area Network (SAN) typically uses which protocol level?",
      options: ["File-level", "Block-level", "Application-level", "Bit-level"],
      correct: 1,
      explanation: "SANs present storage to the server as raw blocks, making it appear like a local hard drive."
    },
    {
      id: 10,
      text: "NAS (Network Attached Storage) typically provides access at which level?",
      options: ["Block-level", "File-level", "Sector-level", "Voltage-level"],
      correct: 1,
      explanation: "NAS devices provide shared filesystems (like NFS or SMB) over a standard network."
    },
    {
      id: 11,
      text: "What is the purpose of a 'Journal' in a filesystem?",
      options: ["Speeding up reads", "Maintaining a log of changes to prevent data corruption", "Writing daily poems", "Compression"],
      correct: 1,
      explanation: "Journaling records pending changes to disk metadata, allowing the system to recover quickly from crashes."
    },
    {
      id: 12,
      text: "Which RAID level provides zero redundancy?",
      options: ["RAID 0", "RAID 1", "RAID 5", "RAID 6"],
      correct: 0,
      explanation: "RAID 0 stripes data for performance only; if any drive fails, all data is lost."
    },
    {
      id: 13,
      text: "RAID 6 is an improvement over RAID 5 because it can handle:",
      options: ["Faster writes", "Two simultaneous drive failures", "Infinite drives", "Cheaper hardware"],
      correct: 1,
      explanation: "RAID 6 uses two sets of parity data, allowing the array to survive two disk failures."
    },
    {
      id: 14,
      text: "Internal Fragmentation in disk allocation means:",
      options: ["Wasted space at the end of the last block", "Wasted space between files", "Corrupted sectors", "Slow head movement"],
      correct: 0,
      explanation: "If a file doesn't perfectly fill its assigned blocks, the remaining space in the last block is 'internal' waste."
    },
    {
      id: 15,
      text: "Which allocation method is best for Sequential Access but worst for Direct Access?",
      options: ["Indexed", "Contiguous", "Linked", "FAT"],
      correct: 2,
      explanation: "Linked allocation is easy to read in order, but to find the 100th block, you must first read every preceding block."
    },
    {
      id: 16,
      text: "The Flash Translation Layer (FTL) in SSDs is responsible for:",
      options: ["Translating files to ZIP", "Mapping LBAs to physical flash addresses", "Transmitting data to the web", "Cooling the chips"],
      correct: 1,
      explanation: "The FTL hides the complexities of flash (like erase-before-write and wear leveling) from the host OS."
    },
    {
      id: 17,
      text: "Data Deduplication works by:",
      options: ["Deleting half the files", "Storing only one copy of identical data blocks", "Encrypting everything twice", "Naming files differently"],
      correct: 1,
      explanation: "Deduplication identifies identical chunks of data across the storage and replaces them with pointers to a single physical copy."
    },
    {
      id: 18,
      text: "What is a 'Snapshot' in storage management?",
      options: ["A photo of the server", "A point-in-time logical view of the data", "A very fast copy", "An error log"],
      correct: 1,
      explanation: "Snapshots allow you to 'freeze' the state of data without immediately copying it, often using Copy-on-Write techniques."
    },
    {
      id: 19,
      text: "A 'Cold Storage' layer is designed for data that is:",
      options: ["Frequently accessed", "Rarely accessed but must be kept", "Kept in a freezer", "Encrypted"],
      correct: 1,
      explanation: "Cold storage uses cheaper, slower media (like Tape or slow HDDs) for archiving data that is seldom needed."
    },
    {
      id: 20,
      text: "ECC (Error Correction Code) memory on modern disks helps to:",
      options: ["Speed up the drive", "Detect and fix single-bit data errors", "Compress files", "Organize folders"],
      correct: 1,
      explanation: "ECC allows the disk to verify data integrity and correct minor read errors caused by magnetic decay or interference."
    }
  ]
};

export const Quiz = () => {
  const [level, setLevel] = useState<'Basic' | 'Intermediate' | 'High' | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const questions = level ? QUIZ_DATA[level] : [];
  const currentQuestion = questions[currentIndex];

  const handleLevelSelect = (l: 'Basic' | 'Intermediate' | 'High') => {
    setLevel(l);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (!level) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative mb-8">
            <div className="absolute -inset-4 bg-[var(--primary)]/20 rounded-full blur-2xl animate-pulse" />
            <BrainCircuit size={80} className="text-[var(--accent)] relative z-10" />
        </div>
        <h1 className="text-4xl font-black mb-4 text-gradient">System Verification Quiz</h1>
        <p className="text-light-text dark:text-dark-text mb-12 max-w-md font-black opacity-80 leading-relaxed">Choose a precision level to verify your secondary storage kiến thức. Master the logical sectoring before moving to distributed parity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {(['Basic', 'Intermediate', 'High'] as const).map(l => (
            <button
              key={l}
              onClick={() => handleLevelSelect(l)}
              className="p-8 bg-[var(--surface)] border border-[var(--primary)]/10 rounded-3xl hover:border-[var(--primary)] hover:scale-[1.02] active:scale-95 transition-all text-left shadow-lg group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--primary)]/5 rounded-full blur-2xl group-hover:bg-[var(--primary)]/10 group-hover:scale-150 transition-all duration-500" />
              <div className="font-black text-xs mb-2 uppercase tracking-widest text-[var(--subtext)] group-hover:text-[var(--primary)] transition-colors">{l} Level</div>
              <h3 className="text-2xl font-black mb-3 text-[var(--text)]">{l === 'High' ? 'System Expert' : l === 'Intermediate' ? 'Systems Analyst' : 'Technician'}</h3>
              <p className="text-sm text-[var(--text)] font-black opacity-70">
                {l === 'Basic' && "Fundamentals of storage and memory."}
                {l === 'Intermediate' && "Scheduling algorithms and movement."}
                {l === 'High' && "RAID, allocation, and complex logic."}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-10">
          <div className="absolute -inset-6 bg-[var(--primary)]/30 rounded-full blur-3xl" />
          <div className="w-24 h-24 glass dark:glass-dark rounded-full flex items-center justify-center text-[var(--accent)] relative z-10 shadow-2xl border border-[var(--primary)]/20">
            <Trophy size={48} />
          </div>
        </div>
        <h2 className="text-4xl font-black mb-4 text-gradient">Quiz Completed!</h2>
        <div className="text-7xl font-black my-8 text-gradient tabular-nums">
          {score} <span className="text-2xl text-[var(--subtext)]">/ {questions.length}</span>
        </div>
        <p className="text-[var(--text)] mb-12 font-black leading-relaxed max-w-sm">
          {score === questions.length ? "Incredible operational efficiency! You've achieved full storage mastery." : "Strong logical alignment. Review the terminal logs to optimize your knowledge architecture."}
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => handleLevelSelect(level)} 
            className="btn-gradient px-8 py-3 rounded-xl font-black flex items-center gap-2"
          >
            <RotateCcw size={20} /> Restart Simulation
          </button>
          <button 
            onClick={() => setLevel(null)} 
            className="px-8 py-3 glass dark:glass-dark text-[var(--text)] border border-[var(--primary)]/10 rounded-xl font-black hover:bg-[var(--primary)]/5 guest-auto transition-all"
          >
            Select Level
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
            {level} PRESET
          </div>
          <div className="text-[var(--subtext)] text-xs font-black uppercase tracking-widest">
            Module {currentIndex + 1} <span className="opacity-50">of {questions.length}</span>
          </div>
        </div>
        <div className="h-2 flex-1 mx-8 bg-[var(--surface)] border border-[var(--primary)]/5 rounded-full overflow-hidden shadow-inner">
           <motion.div 
            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
           />
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--primary)]/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Database size={120} className="text-[var(--primary)]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black mb-12 text-[var(--text)] leading-tight relative z-10">{currentQuestion.text}</h2>
        
        <div className="space-y-4 relative z-10">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={cn(
                "w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between text-lg font-black group",
                isAnswered 
                  ? idx === currentQuestion.correct
                    ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                    : idx === selectedOption
                      ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                      : "border-transparent opacity-30 scale-95"
                  : "bg-[var(--bg)]/50 border-[var(--primary)]/5 hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 text-[var(--text)] hover:translate-x-2"
              )}
            >
              <span>{option}</span>
              {isAnswered && idx === currentQuestion.correct && <CheckCircle2 className="text-green-500" />}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correct && <XCircle className="text-red-500" />}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-10 pt-10 border-t border-[var(--primary)]/10 relative z-10"
            >
              <h4 className="font-black flex items-center gap-2 mb-3 text-[var(--accent)] uppercase text-xs tracking-widest">
                <BrainCircuit size={18} /> Logic Insight
              </h4>
              <p className="text-[var(--text)] mb-10 font-black leading-relaxed opacity-90">{currentQuestion.explanation}</p>
              <button
                onClick={handleNext}
                className="btn-gradient w-full sm:w-auto px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {currentIndex < questions.length - 1 ? "Next Module" : "Analyze Results"} <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
