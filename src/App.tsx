import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Target,
  Brain,
  Terminal as TerminalIcon,
  MapPin,
  ChevronRight,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Calculator,
  Dna,
  Cpu,
  ExternalLink,
  Youtube,
} from 'lucide-react';
import { buildActiveCases, getSubjectMeta } from './data/questionBanks';
import { generateTopicCases, isGeminiAvailable } from './lib/gemini';
import { ActiveCase, CaseResult, GameState, Subject } from './types';
import { cn } from './lib/utils';
// @ts-ignore
import 'katex/dist/katex.min.css';
// @ts-ignore
import { BlockMath } from 'react-katex';

// ─────────────────────────────────────────────────────────
// Detective ambient background / cursor
// ─────────────────────────────────────────────────────────
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
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
        className="absolute top-0 left-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] z-0 pointer-events-none"
      />
      <motion.div
        animate={{ x: mousePos.x * 0.1, y: mousePos.y * 0.05 + 20 }}
        className="absolute bottom-0 left-[-100px] w-[500px] h-[700px] opacity-10 pointer-events-none z-50 mix-blend-overlay"
      >
        <svg viewBox="0 0 200 300" className="w-full h-full fill-slate-400">
          <path d="M100 20 C80 20 70 35 70 50 C70 65 80 80 100 80 C120 80 130 65 130 50 C130 35 120 20 100 20 Z M60 80 L140 80 L150 120 L50 120 Z M50 120 Q50 250 100 280 Q150 250 150 120 L50 120 Z" />
          <rect x="60" y="30" width="80" height="15" rx="5" />
          <path d="M70 30 L130 30 L120 10 L80 10 Z" />
        </svg>
      </motion.div>
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
          <div className="absolute inset-[-20px] rounded-full bg-cyan-500/5 border border-cyan-500/10 backdrop-blur-[2px]" />
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Subject card data
// ─────────────────────────────────────────────────────────
const SUBJECT_CONFIG: {
  subject: Subject;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  accent: string;
  border: string;
  glow: string;
  badge: string;
  badgeBorder: string;
}[] = [
  {
    subject: 'calculus',
    label: 'Calculus',
    tagline: 'Derivatives · Integrals · Limits · Differential Equations',
    icon: <Calculator className="w-8 h-8" />,
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30 hover:border-cyan-500/70',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.12)] hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]',
    badge: 'bg-cyan-500/15 text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
  },
  {
    subject: 'biology',
    label: 'Biology',
    tagline: 'Cell Biology · Genetics · Evolution · Ecosystems',
    icon: <Dna className="w-8 h-8" />,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30 hover:border-emerald-500/70',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.12)] hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]',
    badge: 'bg-emerald-500/15 text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
  },
  {
    subject: 'computer-science',
    label: 'Computer Science',
    tagline: 'Binary · Conversions · Logic Gates · Algorithms',
    icon: <Cpu className="w-8 h-8" />,
    accent: 'text-violet-400',
    border: 'border-violet-500/30 hover:border-violet-500/70',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.12)] hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]',
    badge: 'bg-violet-500/15 text-violet-300',
    badgeBorder: 'border-violet-500/30',
  },
];

// ─────────────────────────────────────────────────────────
// Suggested topics shown as chips on the topic-input screen
// ─────────────────────────────────────────────────────────
const TOPIC_SUGGESTIONS: Record<Subject, string[]> = {
  calculus: ['Derivatives', 'Integrals', 'Limits', 'Chain Rule', 'Related Rates', 'Optimization'],
  biology: ['Genetics', 'Cell Biology', 'Evolution', 'DNA & RNA', 'Ecosystems', 'Photosynthesis'],
  'computer-science': ['Python Basics', 'Recursion', 'Sorting Algorithms', 'Logic Gates', 'Big-O Notation', 'Data Structures'],
};

// ─────────────────────────────────────────────────────────
// Per-subject explicit Tailwind class maps (no interpolation)
// ─────────────────────────────────────────────────────────
const SUBJECT_STYLES: Record<
  Subject | 'default',
  {
    accent: string;
    pulse: string;
    badgeText: string;
    badgeBg: string;
    badgeBorder: string;
    cardBg: string;
    cardBorder: string;
    borderSoft: string;
    bgSoft: string;
    termBg: string;
    termBorder: string;
    mcHover: string;   // hover border on multiple-choice buttons
    barBg: string;     // bottom bar accent on multiple-choice buttons
  }
> = {
  default: {
    accent: 'text-cyan-400',
    pulse: 'bg-cyan-500',
    badgeText: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/50',
    cardBg: 'bg-cyan-500/5',
    cardBorder: 'border-cyan-500/20',
    borderSoft: 'border-cyan-500/20',
    bgSoft: 'bg-cyan-500/5',
    termBg: 'bg-cyan-500/10',
    termBorder: 'border-cyan-500/20',
    mcHover: 'hover:border-cyan-500/40',
    barBg: 'bg-cyan-500',
  },
  calculus: {
    accent: 'text-cyan-400',
    pulse: 'bg-cyan-500',
    badgeText: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/50',
    cardBg: 'bg-cyan-500/5',
    cardBorder: 'border-cyan-500/20',
    borderSoft: 'border-cyan-500/20',
    bgSoft: 'bg-cyan-500/5',
    termBg: 'bg-cyan-500/10',
    termBorder: 'border-cyan-500/20',
    mcHover: 'hover:border-cyan-500/40',
    barBg: 'bg-cyan-500',
  },
  biology: {
    accent: 'text-emerald-400',
    pulse: 'bg-emerald-500',
    badgeText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/50',
    cardBg: 'bg-emerald-500/5',
    cardBorder: 'border-emerald-500/20',
    borderSoft: 'border-emerald-500/20',
    bgSoft: 'bg-emerald-500/5',
    termBg: 'bg-emerald-500/10',
    termBorder: 'border-emerald-500/20',
    mcHover: 'hover:border-emerald-500/40',
    barBg: 'bg-emerald-500',
  },
  'computer-science': {
    accent: 'text-violet-400',
    pulse: 'bg-violet-500',
    badgeText: 'text-violet-400',
    badgeBg: 'bg-violet-500/10',
    badgeBorder: 'border-violet-500/50',
    cardBg: 'bg-violet-500/5',
    cardBorder: 'border-violet-500/20',
    borderSoft: 'border-violet-500/20',
    bgSoft: 'bg-violet-500/5',
    termBg: 'bg-violet-500/10',
    termBorder: 'border-violet-500/20',
    mcHover: 'hover:border-violet-500/40',
    barBg: 'bg-violet-500',
  },
};

function getStyles(subject: Subject | null) {
  return subject ? SUBJECT_STYLES[subject] : SUBJECT_STYLES.default;
}

// ─────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────
const INITIAL_STATE: GameState = {
  subject: null,
  userTopic: null,
  activeCases: [],
  currentCaseIndex: 0,
  score: 0,
  isGameOver: false,
  view: 'start',
  selectedOption: null,
  isCorrect: null,
  codeInput: '',
  caseResults: [],
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [topicInput, setTopicInput] = useState('');
  const [geminiStatus, setGeminiStatus] = useState<'success' | 'fallback' | null>(null);

  const activeCases = gameState.activeCases;
  const currentCase = activeCases[gameState.currentCaseIndex] ?? null;
  const subjectMeta = gameState.subject ? getSubjectMeta(gameState.subject) : null;
  const S = getStyles(gameState.subject);

  const goToSubjectSelect = () => {
    setTopicInput('');
    setGameState({ ...INITIAL_STATE, view: 'subject-select' });
  };

  // Step 1: pick subject → go to topic input screen
  const selectSubject = (subject: Subject) => {
    setTopicInput('');
    setGameState({ ...INITIAL_STATE, subject, view: 'topic-input' });
  };

  // Skip topic input → use static question bank
  const handleTopicSkip = () => {
    if (!gameState.subject) return;
    const cases = buildActiveCases(gameState.subject);
    setGameState(prev => ({
      ...prev,
      userTopic: null,
      activeCases: cases,
      currentCaseIndex: 0,
      score: 0,
      isGameOver: false,
      view: 'investigation',
      selectedOption: null,
      isCorrect: null,
      codeInput: '',
      caseResults: [],
    }));
  };

  // Step 2: user typed a topic → Gemini generates all 4 cases
  const selectTopic = async (topic: string) => {
    if (!gameState.subject || !topic.trim()) return;
    const subject = gameState.subject;
    const trimmed = topic.trim();

    setGeminiStatus(null);
    setGameState(prev => ({ ...prev, view: 'loading', userTopic: trimmed }));

    let geminiCases: ActiveCase[] | null = null;
    console.log('[Gemini] isGeminiAvailable:', isGeminiAvailable());
    if (isGeminiAvailable()) {
      try {
        console.log('[Gemini] Calling generateTopicCases for', subject, trimmed);
        geminiCases = await generateTopicCases(subject, trimmed);
        console.log('[Gemini] Success, got', geminiCases?.length, 'cases');
      } catch (err) {
        console.error('[Gemini] generateTopicCases failed:', err);
        geminiCases = null;
      }
    } else {
      console.warn('[Gemini] Not available — GEMINI_API_KEY is missing or empty');
    }

    if (geminiCases && geminiCases.length > 0) {
      setGeminiStatus('success');
      setGameState(prev => ({
        ...prev,
        activeCases: geminiCases!,
        currentCaseIndex: 0,
        score: 0,
        isGameOver: false,
        view: 'investigation',
        selectedOption: null,
        isCorrect: null,
        codeInput: '',
        caseResults: [],
      }));
    } else {
      setGeminiStatus('fallback');
      const cases = buildActiveCases(subject);
      setGameState(prev => ({
        ...prev,
        activeCases: cases,
        currentCaseIndex: 0,
        score: 0,
        isGameOver: false,
        view: 'investigation',
        selectedOption: null,
        isCorrect: null,
        codeInput: '',
        caseResults: [],
      }));
    }
  };

  const recordResult = (correct: boolean) => {
    if (!currentCase) return;
    const result: CaseResult = {
      title: currentCase.title,
      topic: currentCase.problem.topic,
      correct,
    };
    setGameState(prev => ({ ...prev, caseResults: [...prev.caseResults, result] }));
  };

  const handleOptionSelect = (option: string) => {
    if (gameState.isCorrect !== null || !currentCase) return;
    const isCorrect = option === currentCase.problem.correctAnswer;
    recordResult(isCorrect);
    setGameState(prev => ({
      ...prev,
      selectedOption: option,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleCodeSubmit = () => {
    if (gameState.isCorrect !== null || !currentCase) return;
    const input = gameState.codeInput.trim();
    if (!input) return;
    const isCorrect = input.toLowerCase() === currentCase.problem.correctAnswer.toLowerCase();
    recordResult(isCorrect);
    setGameState(prev => ({
      ...prev,
      selectedOption: input,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const nextStep = () => {
    if (gameState.currentCaseIndex < activeCases.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentCaseIndex: prev.currentCaseIndex + 1,
        selectedOption: null,
        isCorrect: null,
        codeInput: '',
      }));
    } else {
      setGameState(prev => ({ ...prev, isGameOver: true, view: 'conclusion' }));
    }
  };

  const answeredCount = gameState.caseResults.length;
  const accuracyPct = answeredCount > 0
    ? ((gameState.score / answeredCount) * 100).toFixed(1)
    : '—';

  const resetGame = () => setGameState(INITIAL_STATE);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 cursor-none">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_#1e293b_0%,_#020617_100%)]" />
        <DetectiveSilhouette />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.12, 0.1], x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-8 min-h-screen flex flex-col">
        {/* Persistent Header */}
        {(gameState.view === 'investigation' || gameState.view === 'conclusion') && (
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className={cn('w-10 h-10 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]', S.pulse)}>
                <Search className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  {subjectMeta?.title.toUpperCase()} DETECTIVE
                </h1>
                <p className={cn('text-[10px] font-mono tracking-[0.2em] uppercase', S.accent)}>
                  Central Intelligence — {subjectMeta?.title} Division
                </p>
              </div>
            </div>
            <div className="flex gap-8 text-right items-center">
              {/* Progress dots */}
              <div className="hidden sm:flex flex-col items-end gap-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Progress</p>
                <div className="flex gap-1.5">
                  {activeCases.map((_, i) => {
                    const result = gameState.caseResults[i];
                    return (
                      <div
                        key={i}
                        className={cn(
                          'w-2.5 h-2.5 rounded-full transition-colors',
                          result
                            ? result.correct ? 'bg-green-400' : 'bg-red-400'
                            : i === gameState.currentCaseIndex
                            ? cn('animate-pulse', S.pulse)
                            : 'bg-white/15',
                        )}
                      />
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                <p className={cn('text-xl font-mono', S.accent)}>
                  {accuracyPct === '—' ? '—' : `${accuracyPct}%`}
                </p>
              </div>
            </div>
          </motion.header>
        )}

        <AnimatePresence mode="wait">
          {/* ─────── START SCREEN ─────── */}
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
                  Science <span className="text-cyan-500">Detective</span>
                </h1>
                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-lg">
                  Deploy mathematical and scientific intelligence to intercept suspects and analyse
                  crime scenes. Choose your field of expertise and crack the case.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#0ea5e9' }}
                whileTap={{ scale: 0.98 }}
                onClick={goToSubjectSelect}
                className="group relative bg-cyan-500 text-slate-950 px-10 py-5 rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                SELECT YOUR SUBJECT
              </motion.button>

              <div className="flex gap-12 pt-12 border-t border-white/5">
                {['OBSERVE', 'CALCULATE', 'INTERCEPT'].map((text, i) => (
                  <div key={text} className="text-center group">
                    <div className="text-cyan-500 font-mono text-sm mb-1 group-hover:animate-pulse">
                      0{i + 1}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">
                      {text}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────── SUBJECT SELECT ─────── */}
          {gameState.view === 'subject-select' && (
            <motion.div
              key="subject-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center space-y-10"
            >
              <div className="text-center space-y-3">
                <div className="inline-block px-4 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">
                  Intelligence Division
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
                  Choose Your <span className="text-cyan-500">Field</span>
                </h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Each subject presents 4 cases. Questions are randomised every session — no two
                  investigations are alike.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {SUBJECT_CONFIG.map((cfg, i) => (
                  <motion.button
                    key={cfg.subject}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => selectSubject(cfg.subject)}
                    className={cn(
                      'group relative backdrop-blur-xl bg-white/5 border rounded-3xl p-8 flex flex-col items-start gap-5 text-left transition-all duration-300',
                      cfg.border,
                      cfg.glow,
                    )}
                  >
                    {/* Level count badge */}
                    <div className={cn('absolute top-5 right-5 px-2 py-0.5 rounded text-[10px] font-bold border', cfg.badge, cfg.badgeBorder)}>
                      4 LEVELS
                    </div>

                    <div className={cn('w-14 h-14 rounded-2xl bg-white/5 border flex items-center justify-center transition-colors', cfg.border, cfg.accent)}>
                      {cfg.icon}
                    </div>

                    <div className="space-y-2">
                      <h3 className={cn('text-2xl font-bold uppercase tracking-tight', cfg.accent)}>
                        {cfg.label}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{cfg.tagline}</p>
                    </div>

                    <div className={cn('mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-widest', cfg.accent)}>
                      Start Investigation
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={resetGame}
                className="text-slate-500 hover:text-slate-300 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Back to Start
              </button>
            </motion.div>
          )}

          {/* ─────── TOPIC INPUT ─────── */}
          {gameState.view === 'topic-input' && gameState.subject && (
            <motion.div
              key="topic-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center space-y-10 max-w-2xl mx-auto w-full"
            >
              {/* Subject badge */}
              {(() => {
                const cfg = SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!;
                return (
                  <div className="text-center space-y-3">
                    <div className={cn('inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.25em] uppercase border', cfg.badge, cfg.badgeBorder)}>
                      {cfg.icon && <span className="w-3.5 h-3.5">{cfg.icon}</span>}
                      {cfg.label} Division
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                      Specify Your <span className={cfg.accent}>Focus</span>
                    </h2>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                      Type any topic within {cfg.label} and Gemini will build a full 4-case investigation around it.
                    </p>
                  </div>
                );
              })()}

              {/* Input */}
              <div className="w-full space-y-4">
                <div className={cn(
                  'flex items-center gap-3 rounded-2xl border transition-colors overflow-hidden',
                  topicInput
                    ? cn(SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!.border.replace('hover:', '').split(' ')[0], 'bg-white/5')
                    : 'border-white/10 bg-white/5 focus-within:border-white/30',
                )}>
                  <span className={cn('pl-5 shrink-0', SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!.accent)}>
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={e => setTopicInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && topicInput.trim() && selectTopic(topicInput)}
                    placeholder={`e.g., ${TOPIC_SUGGESTIONS[gameState.subject][0]}, ${TOPIC_SUGGESTIONS[gameState.subject][1]}…`}
                    autoFocus
                    className="flex-1 bg-transparent text-white text-lg font-medium outline-none placeholder:text-slate-600 py-5"
                  />
                </div>

                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2">
                  {TOPIC_SUGGESTIONS[gameState.subject].map(s => (
                    <button
                      key={s}
                      onClick={() => { setTopicInput(s); selectTopic(s); }}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold border transition-all',
                        SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!.badge,
                        SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!.badgeBorder,
                        'hover:opacity-80',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => topicInput.trim() && selectTopic(topicInput)}
                  disabled={!topicInput.trim()}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all',
                    topicInput.trim()
                      ? cn(SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!.badge, 'border', SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!.badgeBorder, 'hover:opacity-90')
                      : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed',
                  )}
                >
                  <Brain className="w-4 h-4" />
                  Generate Investigation
                </motion.button>
                <button
                  onClick={handleTopicSkip}
                  className="px-6 py-4 rounded-xl text-slate-500 hover:text-slate-300 text-xs uppercase tracking-widest font-bold border border-white/5 hover:border-white/15 transition-all"
                >
                  Use Standard Cases
                </button>
              </div>

              <button
                onClick={goToSubjectSelect}
                className="text-slate-600 hover:text-slate-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Back to Subject Select
              </button>
            </motion.div>
          )}

          {/* ─────── LOADING ─────── */}
          {gameState.view === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', S.termBg, S.termBorder, 'border')}
              >
                <Search className={cn('w-8 h-8', S.accent)} />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  Building Your Investigation
                </h2>
                <p className={cn('text-sm font-mono', S.accent)}>
                  Generating 4 custom cases on{' '}
                  <span className="font-bold">"{gameState.userTopic}"</span>…
                </p>
                <p className="text-xs text-slate-600 uppercase tracking-widest mt-4">Powered by Gemini AI</p>
              </div>
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                    className={cn('w-2 h-2 rounded-full', S.pulse)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ─────── INVESTIGATION ─────── */}
          {gameState.view === 'investigation' && currentCase && (
            <motion.div
              key={`investigation-${gameState.currentCaseIndex}-${currentCase.problem.question.slice(0, 20)}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-6"
            >
              {/* Gemini status banner */}
              {geminiStatus === 'fallback' && gameState.userTopic && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono"
                >
                  <span className="font-bold uppercase tracking-widest shrink-0">⚠ Gemini fallback</span>
                  <span className="text-amber-400/70">
                    Could not generate "{gameState.userTopic}" cases — check the browser console for details. Showing standard cases instead.
                  </span>
                </motion.div>
              )}
              {geminiStatus === 'success' && gameState.currentCaseIndex === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-mono', S.bgSoft, S.borderSoft, S.accent)}
                >
                  <span className="font-bold uppercase tracking-widest shrink-0">✦ AI Generated</span>
                  <span className="opacity-60">4 custom cases on "{gameState.userTopic}" — powered by Gemini</span>
                </motion.div>
              )}

              <div className="grid grid-cols-12 gap-6 flex-1">
              {/* Left: Briefing Panel */}
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
                      <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/5 hover:border-cyan-500/20 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Coordinates</div>
                          <div className="text-xs font-mono">{currentCase.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-white/5 hover:border-purple-500/20 transition-colors">
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
                    className={cn('mt-auto p-5 rounded-2xl border backdrop-blur-md', S.borderSoft, S.bgSoft)}
                  >
                    {currentCase.hint && (
                      <div className={cn('flex items-center gap-1.5 mb-2', S.accent)}>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">AI Partner</span>
                        <span className="text-[9px] font-mono opacity-60">✦ live</span>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "{currentCase.hint
                        ?? `Analyze the ${currentCase.evidenceType} carefully. Your knowledge of ${currentCase.problem.topic} is the key to cracking this case.`}"
                    </p>
                  </motion.div>
                </motion.section>
              </div>

              {/* Right: Forensic Workspace */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                <motion.section
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col min-h-[500px]"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-medium flex items-center gap-3 text-white uppercase tracking-tight">
                      <div className={cn('w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px]', S.pulse)} />
                      Forensic Workspace
                    </h3>
                    <div className="flex gap-2">
                      <div className="px-3 py-1 text-[10px] border border-white/10 rounded bg-white/5 font-bold tracking-widest text-slate-400">
                        SECURE_CHANNEL
                      </div>
                    </div>
                  </div>

                  {/* Formula box — only rendered when a LaTeX formula is present */}
                  {currentCase.problem.formula ? (
                    <motion.div
                      key={currentCase.id + '-formula'}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-slate-900/50 rounded-3xl p-10 border border-white/5 mb-8 flex flex-col items-center justify-center relative overflow-hidden group"
                    >
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-mono text-white/[0.02] select-none pointer-events-none">
                        {currentCase.problem.topic[0]}
                      </div>
                      <p className={cn('text-[10px] uppercase font-mono mb-4 tracking-[0.2em] relative z-10', S.accent)}>
                        Detected Data Matrix
                      </p>
                      <div className="text-3xl md:text-5xl text-white relative z-10 transition-transform duration-500 group-hover:scale-105">
                        <BlockMath math={currentCase.problem.formula} />
                      </div>
                    </motion.div>
                  ) : (
                    /* Topic badge for non-formula subjects (biology, CS) */
                    <motion.div
                      key={currentCase.id + '-topic'}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-slate-900/50 rounded-3xl p-8 border border-white/5 mb-8 flex items-center justify-center gap-5 relative overflow-hidden group"
                    >
                      <div className={cn('w-16 h-16 rounded-2xl bg-white/5 border flex items-center justify-center shrink-0', S.termBorder)}>
                        {gameState.subject === 'biology' ? (
                          <Dna className={cn('w-8 h-8', S.accent)} />
                        ) : (
                          <Cpu className={cn('w-8 h-8', S.accent)} />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-mono tracking-[0.2em] mb-1">
                          Analysis Mode
                        </p>
                        <p className={cn('text-2xl font-bold uppercase tracking-tight', S.accent)}>
                          {currentCase.problem.topic}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-8 flex-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-4"
                    >
                      <div className={cn('w-8 h-8 rounded border flex items-center justify-center shrink-0 mt-1', S.termBg, S.termBorder)}>
                        <TerminalIcon className={cn('w-4 h-4', S.accent)} />
                      </div>
                      <p className="text-xl md:text-2xl text-slate-100 font-medium tracking-tight">
                        {currentCase.problem.question}
                      </p>
                    </motion.div>

                    {currentCase.problem.type === 'code-fill' ? (
                      /* ── Code-fill input ── */
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-4"
                      >
                        {/* Code template display */}
                        {currentCase.problem.codeTemplate && (() => {
                          const parts = currentCase.problem.codeTemplate.split('___');
                          return (
                            <div className="bg-slate-900/70 rounded-xl border border-violet-500/20 overflow-hidden">
                              <div className="flex items-center gap-2 px-4 py-2 border-b border-violet-500/10 bg-black/20">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                <span className="text-[10px] text-slate-500 font-mono ml-2 uppercase tracking-widest">
                                  evidence.py
                                </span>
                              </div>
                              <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed p-4">
                                {parts[0]}
                                <span className={cn(
                                  'inline-block min-w-[3ch] border-b-2 text-center px-1 transition-colors font-bold',
                                  gameState.isCorrect === null
                                    ? 'border-violet-400 text-violet-400'
                                    : gameState.isCorrect
                                    ? 'border-green-400 text-green-300'
                                    : 'border-red-400 text-red-300',
                                )}>
                                  {gameState.isCorrect !== null ? gameState.codeInput : '   '}
                                </span>
                                {parts[1]}
                              </pre>
                            </div>
                          );
                        })()}

                        {/* Text input */}
                        <div className={cn(
                          'flex items-center gap-2 rounded-xl border transition-colors overflow-hidden',
                          gameState.isCorrect === null
                            ? 'border-violet-500/30 bg-violet-500/5 focus-within:border-violet-500/60'
                            : gameState.isCorrect
                            ? 'border-green-500/40 bg-green-500/5'
                            : 'border-red-500/40 bg-red-500/5',
                        )}>
                          <span className="text-violet-400 font-mono text-sm pl-4 shrink-0 select-none">{'>'}</span>
                          <input
                            key={currentCase.id}
                            type="text"
                            value={gameState.codeInput}
                            onChange={e => setGameState(prev => ({ ...prev, codeInput: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && gameState.isCorrect === null && gameState.codeInput.trim()) {
                                handleCodeSubmit();
                              }
                            }}
                            disabled={gameState.isCorrect !== null}
                            placeholder="Type your answer and press Enter…"
                            autoFocus
                            className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-slate-600 py-4"
                          />
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCodeSubmit}
                            disabled={gameState.isCorrect !== null || !gameState.codeInput.trim()}
                            className={cn(
                              'px-5 py-4 font-mono text-xs font-bold uppercase tracking-widest transition-all shrink-0',
                              gameState.isCorrect !== null || !gameState.codeInput.trim()
                                ? 'text-slate-600 cursor-not-allowed'
                                : 'text-violet-300 hover:text-violet-100',
                            )}
                          >
                            Run
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      /* ── Multiple choice grid ── */
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
                            transition={{ delay: 0.8 + idx * 0.1 }}
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            disabled={gameState.isCorrect !== null}
                            className={cn(
                              'group relative min-h-16 h-auto rounded-2xl border transition-all duration-300 overflow-hidden text-left px-6 py-4',
                              gameState.selectedOption === option
                                ? option === currentCase.problem.correctAnswer
                                  ? 'bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                                  : 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                                : cn('bg-white/5 border-white/10 hover:bg-white/10 text-slate-300', S.mcHover),
                              gameState.isCorrect !== null &&
                                option === currentCase.problem.correctAnswer &&
                                'border-green-500/50',
                            )}
                          >
                            <div className="flex items-center justify-between relative z-10">
                              <span className="font-mono text-base font-bold tracking-wide leading-snug">
                                {option}
                              </span>
                              {gameState.selectedOption === option &&
                                (option === currentCase.problem.correctAnswer ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 ml-2" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-400 shrink-0 ml-2" />
                                ))}
                            </div>
                            <div className={cn('absolute inset-x-0 bottom-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-30', S.barBg)} />
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Feedback panel */}
                  <AnimatePresence>
                    {gameState.isCorrect !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        className={cn(
                          'mt-8 p-6 rounded-2xl border backdrop-blur-md overflow-hidden',
                          gameState.isCorrect
                            ? 'bg-green-500/10 border-green-500/30 text-green-100'
                            : 'bg-red-500/10 border-red-500/30 text-red-100',
                        )}
                      >
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                              <div
                                className={cn(
                                  'font-bold mb-2 uppercase text-xs tracking-[0.2em] flex items-center gap-2',
                                  gameState.isCorrect ? 'text-green-400' : 'text-red-400',
                                )}
                              >
                                {gameState.isCorrect ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                {gameState.isCorrect ? 'Mission Success' : 'Mission Critical Error'}
                              </div>
                              <p className="text-sm leading-relaxed mb-4 italic text-slate-300">
                                {gameState.isCorrect
                                  ? currentCase.successStory
                                  : currentCase.failureStory}
                              </p>
                              <div className="pt-4 border-t border-white/10 space-y-2">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                  Theoretical Justification
                                </p>
                                <p className="text-xs text-slate-400 font-mono italic">
                                  {currentCase.problem.explanation}
                                </p>
                              </div>
                              {currentCase.problem.type === 'code-fill' && !gameState.isCorrect && (
                                <div className="pt-3 border-t border-white/10 space-y-1">
                                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                    Correct Answer
                                  </p>
                                  <p className="text-sm text-green-400 font-mono font-bold">
                                    {currentCase.problem.correctAnswer}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-3 shrink-0 sm:w-48">
                              {/* YouTube help button */}
                              <a
                                href={currentCase.problem.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 hover:border-red-500/60 text-red-300 font-bold transition-all text-xs uppercase tracking-widest group"
                              >
                                <Youtube className="w-4 h-4" />
                                Watch Tutorial
                                <ExternalLink className="w-3 h-3 opacity-60" />
                              </a>

                              {/* Next button */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={nextStep}
                                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all group uppercase tracking-widest text-xs h-14"
                              >
                                Next Stage
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              </div>
              </div>
            </motion.div>
          )}

          {/* ─────── CONCLUSION ─────── */}
          {gameState.view === 'conclusion' && (() => {
            const total = activeCases.length;
            const score = gameState.score;
            const pct = total > 0 ? Math.round((score / total) * 100) : 0;
            const rank =
              score === total ? 'Master Analyst' :
              score === total - 1 ? 'Senior Specialist' :
              score === total - 2 ? 'Field Operative' :
              score === 1 ? 'Junior Trainee' :
              'Rookie Recruit';
            const rankMsg =
              score === total
                ? 'Flawless. Every suspect apprehended, every clue decoded. The city is safer because of you.'
                : score === total - 1
                ? 'Outstanding work. One slip won\'t define you — the department is impressed.'
                : score === total - 2
                ? 'Solid performance. Review the cases you missed and come back sharper.'
                : score === 1
                ? 'A single resolve. The field is unforgiving — study hard before the next assignment.'
                : 'The suspects walked free this time. Hit the books, Detective. The city needs you ready.';
            return (
              <motion.div
                key="conclusion"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
              >
                <div className="space-y-3">
                  <div className={cn('inline-block px-4 py-1 rounded-full text-xs font-bold tracking-[0.3em] uppercase border', S.badgeBg, S.badgeBorder, S.badgeText)}>
                    Investigation Complete
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter">
                    Case <span className={S.accent}>Closed</span>
                  </h2>
                  {subjectMeta && (
                    <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">
                      {subjectMeta.title} Division
                    </p>
                  )}
                </div>

                {/* Score + rank */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-4xl"
                >
                  <div className="md:col-span-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Score</p>
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 120, delay: 0.4 }}
                      className="text-8xl font-black text-white"
                    >
                      {score}<span className="text-3xl text-slate-600">/{total}</span>
                    </motion.div>
                    <div className={cn('text-sm font-mono font-bold', pct === 100 ? 'text-green-400' : pct >= 50 ? S.accent : 'text-red-400')}>
                      {pct}% accuracy
                    </div>
                  </div>

                  <div className={cn('md:col-span-8 backdrop-blur-xl border rounded-3xl p-8 flex flex-col justify-center text-left', S.cardBg, S.cardBorder)}>
                    <div className={cn('text-[10px] uppercase tracking-[0.3em] font-black mb-4 border-b pb-2', S.accent, S.cardBorder)}>
                      Final Performance Audit
                    </div>
                    <div className="text-3xl font-black text-white mb-3 italic uppercase">{rank}</div>
                    <p className="text-slate-400 leading-relaxed italic text-sm max-w-md">{rankMsg}</p>
                  </div>
                </motion.div>

                {/* Per-case breakdown */}
                {gameState.caseResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-w-4xl"
                  >
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-4 text-left">
                      Case Breakdown
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {gameState.caseResults.map((r, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.08 }}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-2xl border',
                            r.correct
                              ? 'bg-green-500/5 border-green-500/20'
                              : 'bg-red-500/5 border-red-500/20',
                          )}
                        >
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', r.correct ? 'bg-green-500/20' : 'bg-red-500/20')}>
                            {r.correct
                              ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                              : <XCircle className="w-4 h-4 text-red-400" />}
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-xs font-bold text-white truncate">{r.title}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{r.topic}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={goToSubjectSelect}
                    className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
                  >
                    <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    New Investigation
                  </button>
                  <button
                    onClick={resetGame}
                    className="flex items-center justify-center gap-3 px-10 py-5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold rounded-2xl transition-all"
                  >
                    Return to Start
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <footer className="mt-auto pt-12 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                Neural Link: ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                Encryption: HIGH
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 font-mono tracking-widest">
            V.5.0.0-STABLE // SCIENCE_INTEL_SYSTEMS_GLOBAL
          </p>
        </footer>
      </div>
    </div>
  );
}
