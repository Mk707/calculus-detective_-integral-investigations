import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Target, 
  Brain, 
  Terminal as TerminalIcon, 
  ShieldAlert, 
  TrendingUp, 
  Scale, 
  MapPin,
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Calculator
} from 'lucide-react';
import { INITIAL_CASES } from './data/cases';
import { GameState, MathTopic } from './types';
import { cn } from './lib/utils';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

function DetectiveSilhouette() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* The Spotlight following the detective's "eyes" */}
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
        className="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] z-0 pointer-events-none"
      />
      
      {/* Subtle Silhouette of a detective in the corner or following slightly */}
      <motion.div
        animate={{ 
          x: mousePos.x * 0.1, 
          y: mousePos.y * 0.05 + 20 
        }}
        className="absolute bottom-0 left-[-100px] w-[500px] h-[700px] opacity-10 pointer-events-none z-50 mix-blend-overlay"
      >
        <svg viewBox="0 0 200 300" className="w-full h-full fill-slate-400">
          <path d="M100 20 C80 20 70 35 70 50 C70 65 80 80 100 80 C120 80 130 65 130 50 C130 35 120 20 100 20 Z M60 80 L140 80 L150 120 L50 120 Z M50 120 Q50 250 100 280 Q150 250 150 120 L50 120 Z" />
          <rect x="60" y="30" width="80" height="15" rx="5" /> {/* Hat rim */}
          <path d="M70 30 L130 30 L120 10 L80 10 Z" /> {/* Hat top */}
        </svg>
      </motion.div>
      {/* Custom Detective Cursor / Reticle */}
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.2 }}
        className="fixed top-0 left-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 border border-cyan-500/50 rounded-full animate-ping" />
          <div className="absolute inset-2 border border-cyan-400 rounded-full" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/20" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500/20" />
          {/* Magnifying area effect - CSS filter trick */}
          <div className="absolute inset-[-20px] rounded-full bg-cyan-500/5 border border-cyan-500/10 backdrop-blur-[2px]" />
        </div>
      </motion.div>
    </>
  );
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentCaseIndex: 0,
    score: 0,
    isGameOver: false,
    view: 'start',
    selectedOption: null,
    isCorrect: null,
  });

  const currentCase = INITIAL_CASES[gameState.currentCaseIndex];

  const startGame = () => {
    setGameState({
      ...gameState,
      view: 'investigation',
      currentCaseIndex: 0,
      score: 0,
      isGameOver: false,
    });
  };

  const handleOptionSelect = (option: string) => {
    if (gameState.isCorrect !== null) return;

    const isCorrect = option === currentCase.problem.correctAnswer;
    setGameState(prev => ({
      ...prev,
      selectedOption: option,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const nextStep = () => {
    if (gameState.currentCaseIndex < INITIAL_CASES.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentCaseIndex: prev.currentCaseIndex + 1,
        view: 'investigation',
        selectedOption: null,
        isCorrect: null,
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        view: 'conclusion',
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentCaseIndex: 0,
      score: 0,
      isGameOver: false,
      view: 'start',
      selectedOption: null,
      isCorrect: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 cursor-none">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_#1e293b_0%,_#020617_100%)]"></div>
        
        {/* Detective Silhouette POV */}
        <DetectiveSilhouette />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.12, 0.1],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]"
        />
        
        {/* HUD Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-8 min-h-screen flex flex-col">
        {/* Persistent Header */}
        {gameState.view !== 'start' && (
          <motion.header 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <Search className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">CALCULUS DETECTIVE</h1>
                <p className="text-[10px] text-cyan-400 font-mono tracking-[0.2em] uppercase">Central Intelligence Math Division</p>
              </div>
            </div>
            <div className="flex gap-8 text-right">
              <div className="hidden sm:block">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Cases Active</p>
                <p className="text-xl font-mono">{gameState.currentCaseIndex + 1} / {INITIAL_CASES.length}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Accuracy Score</p>
                <p className="text-xl font-mono text-cyan-400">
                  {INITIAL_CASES.length > 0 ? (gameState.score / (gameState.currentCaseIndex + (gameState.view === 'conclusion' ? 0 : 1)) * 100).toFixed(1) : "0.0"}%
                </p>
              </div>
            </div>
          </motion.header>
        )}

        <AnimatePresence mode="wait">
          {gameState.view === 'start' && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-40 h-40 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.1)]"
                >
                  <div className="w-16 h-16 bg-cyan-500 rounded flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Target className="w-10 h-10 text-slate-950" />
                  </div>
                </motion.div>
                <div className="absolute -top-4 -right-4 bg-red-500/20 border border-red-500/30 rounded px-2 py-1 text-[10px] text-red-400 font-bold tracking-widest animate-pulse">
                  SYSTEM ACTIVE
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase italic">
                  Calculus <span className="text-cyan-500">Detective</span>
                </h1>
                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-lg">
                  Deploy mathematical intelligence to intercept suspects and analyze crime scenes. 
                  Derivatives, Integrals, Limits—the ultimate forensic tools.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#0ea5e9' }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="group relative bg-cyan-500 text-slate-950 px-10 py-5 rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                INITIATE CASE #0742
              </motion.button>

              <div className="flex gap-12 pt-12 border-t border-white/5">
                {['OBSERVE', 'CALCULATE', 'INTERCEPT'].map((text, i) => (
                  <div key={text} className="text-center group">
                    <div className="text-cyan-500 font-mono text-sm mb-1 group-hover:animate-pulse">0{i + 1}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">{text}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {gameState.view === 'investigation' && currentCase && (
            <motion.div 
              key="investigation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 grid grid-cols-12 gap-6"
            >
              {/* Left Column: Briefing Panel */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <motion.section 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col h-full"
                >
                  <div className="mb-6">
                    <motion.span 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 uppercase tracking-wider mb-4 inline-block"
                    >
                      Case Objective: {currentCase.id}
                    </motion.span>
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-semibold mb-3 text-white leading-tight uppercase"
                    >
                      {currentCase.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-slate-400 text-sm leading-relaxed mb-6 font-medium"
                    >
                      "{currentCase.description}"
                    </motion.p>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-4 mb-8"
                    >
                       <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/5 transition-colors hover:border-cyan-500/20">
                         <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                           <MapPin className="w-4 h-4" />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Coordinates</div>
                            <div className="text-xs font-mono">{currentCase.location}</div>
                         </div>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/5 transition-colors hover:border-purple-500/20">
                         <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400">
                           <Brain className="w-4 h-4" />
                         </div>
                         <div>
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Analysis Mode</div>
                            <div className="text-xs font-mono">{currentCase.problem.topic}</div>
                         </div>
                       </div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-auto p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md"
                  >
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "If we miss the calculation, the subject escapes. Precision is paramount, Detective."
                    </p>
                  </motion.div>
                </motion.section>
              </div>

              {/* Right Column: Algebraic Workspace */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <motion.section 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col min-h-[500px]"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-medium flex items-center gap-3 text-white uppercase tracking-tight">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
                      Forensic Workspace
                    </h3>
                    <div className="flex gap-2">
                      <div className="px-3 py-1 text-[10px] border border-white/10 rounded bg-white/5 font-bold tracking-widest text-slate-400">SECURE_CHANNEL</div>
                    </div>
                  </div>

                  <motion.div 
                    key={currentCase.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900/50 rounded-3xl p-10 border border-white/5 mb-8 flex flex-col items-center justify-center relative overflow-hidden group"
                  >
                     {/* Decorative math symbol in background */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-mono text-white/[0.02] select-none pointer-events-none">
                       {currentCase.problem.topic[0]}
                     </div>

                    <p className="text-[10px] text-cyan-400 uppercase font-mono mb-4 tracking-[0.2em] relative z-10">Detected Data Matrix</p>
                    <div className="text-3xl md:text-5xl text-white relative z-10 transition-transform duration-500 group-hover:scale-105">
                      <BlockMath math={currentCase.problem.formula} />
                    </div>
                  </motion.div>

                  <div className="space-y-8 flex-1">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                        <TerminalIcon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <p className="text-xl md:text-2xl text-slate-100 font-medium tracking-tight">
                        {currentCase.problem.question}
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {currentCase.problem.options.map((option, idx) => (
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + (idx * 0.1) }}
                          key={option}
                          onClick={() => handleOptionSelect(option)}
                          disabled={gameState.isCorrect !== null}
                          className={cn(
                            "group relative h-16 rounded-2xl border transition-all duration-300 overflow-hidden text-left px-6",
                            gameState.selectedOption === option 
                              ? option === currentCase.problem.correctAnswer
                                ? "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                                : "bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                              : "bg-white/5 border-white/10 hover:border-cyan-500/40 hover:bg-white/10 text-slate-300",
                            gameState.isCorrect !== null && option === currentCase.problem.correctAnswer && "border-green-500/50"
                          )}
                        >
                          <div className="flex items-center justify-between relative z-10">
                            <span className="font-mono text-xl font-bold tracking-widest">{option}</span>
                            {gameState.selectedOption === option && (
                              option === currentCase.problem.correctAnswer 
                                ? <CheckCircle2 className="w-5 h-5 text-green-400" /> 
                                : <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-30" />
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {gameState.isCorrect !== null && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className={cn(
                          "mt-8 p-6 rounded-2xl border backdrop-blur-md transition-colors overflow-hidden",
                          gameState.isCorrect 
                            ? "bg-green-500/10 border-green-500/30 text-green-100" 
                            : "bg-red-500/10 border-red-500/30 text-red-100"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="flex-1">
                            <div className={cn(
                              "font-bold mb-2 uppercase text-xs tracking-[0.2em] flex items-center gap-2",
                              gameState.isCorrect ? "text-green-400" : "text-red-400"
                            )}>
                              {gameState.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              {gameState.isCorrect ? "Mission Success" : "Mission Critical Error"}
                            </div>
                            <p className="text-sm leading-relaxed mb-4 italic text-slate-300">
                              {gameState.isCorrect ? currentCase.successStory : currentCase.failureStory}
                            </p>
                            <div className="pt-4 border-t border-white/10 space-y-2">
                               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Theoretical Justification</p>
                               <p className="text-xs text-slate-400 font-mono italic">{currentCase.problem.explanation}</p>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={nextStep}
                            className="sm:w-48 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all group shrink-0 h-14 sm:h-auto self-end sm:self-stretch uppercase tracking-widest text-xs"
                          >
                            Next Stage
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              </div>
            </motion.div>
          )}

          {gameState.view === 'conclusion' && (
            <motion.div 
              key="conclusion"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-12"
            >
              <div className="space-y-4">
                <div className="inline-block px-4 py-1 bg-cyan-500/10 border border-cyan-500/50 rounded-full text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">
                  Investigation Pipeline Terminates
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter">
                  Case <span className="text-cyan-500">Closed</span>
                </h2>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-4xl"
              >
                <div className="md:col-span-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-4">Total Resolves</p>
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                    className="text-8xl font-black text-white tracking-widest"
                  >
                    {gameState.score}
                  </motion.div>
                  <div className="text-xs text-slate-400 mt-4 font-mono font-bold uppercase tracking-widest">Efficiency: {(gameState.score / INITIAL_CASES.length * 100).toFixed(0)}%</div>
                </div>
                
                <div className="md:col-span-8 backdrop-blur-xl bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-10 flex flex-col items-center justify-center text-left md:items-start">
                  <div className="text-[10px] text-cyan-500 uppercase tracking-[0.3em] font-black mb-6 border-b border-cyan-500/20 pb-2 w-full">Final Performance Audit</div>
                  <div className="text-4xl font-black text-white mb-4 italic uppercase">
                    {gameState.score === INITIAL_CASES.length ? "Master Analyst" : gameState.score > 2 ? "Senior Specialist" : "Junior Operative"}
                  </div>
                  <p className="text-slate-400 leading-relaxed text-lg italic max-w-md">
                    {gameState.score === INITIAL_CASES.length 
                      ? "Your mathematical precision is the foundation of order in this city. Every derivative calculated was a suspect apprehended. Exceptional work."
                      : "The field is chaotic, and math is the only tool that can tame it. You showed promise, detective, but the streets demand perfection."}
                  </p>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center gap-3 px-12 py-5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
                >
                  <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  INITIATE NEW CAREER
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-auto pt-12 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">Neural Link: ACTIVE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">Encyption: HIGH</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 font-mono tracking-widest">V.4.2.0-STABLE // MATH_INTEL_SYSTEMS_GLOBAL</p>
        </footer>
      </div>
    </div>
  );
}
