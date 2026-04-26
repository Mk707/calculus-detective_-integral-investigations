import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Target,
  GraduationCap,
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
  LogOut,
  X,
  Zap,
  Shield,
  BookOpen,
  FileText,
  Layers,
  Infinity as InfinityIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { buildActiveCases, getSubjectMeta } from './data/questionBanks';
import { generateTopicCases, isGeminiAvailable } from './lib/gemini';
import { ActiveCase, CaseResult, Difficulty, GameState, QuestionLimit, Subject } from './types';
import { cn } from './lib/utils';
import { playPop } from './lib/sound';
import { Detective } from './components/Detective';
import { FloatingShapes } from './components/FloatingShapes';
// @ts-ignore
import 'katex/dist/katex.min.css';
// @ts-ignore
import { BlockMath } from 'react-katex';

// ─────────────────────────────────────────────────────────
// Ambient background + custom cursor
// ─────────────────────────────────────────────────────────
function DetectiveSilhouette() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
        className="absolute top-0 left-0 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(6,182,212,0.12)_0%,transparent_70%)] z-0 pointer-events-none"
      />
      <motion.div
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: 'spring', damping: 20, stiffness: 300, mass: 0.2 }}
        className="fixed top-0 left-0 w-10 h-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[100]"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 border border-cyan-500/50 rounded-full animate-ping" />
          <div className="absolute inset-1.5 border border-cyan-400/80 rounded-full" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/30" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500/30" />
        </div>
      </motion.div>
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Subject card config
// ─────────────────────────────────────────────────────────
const SUBJECT_CONFIG: {
  subject: Subject;
  label: string;
  tagline: string;
  icon: React.ReactNode;
  accent: string;
  gradientBorder: string;
  glow: string;
  badge: string;
  badgeBorder: string;
  accentHex: string;
  floatingColor: 'cyan' | 'green' | 'purple';
}[] = [
  {
    subject: 'calculus',
    label: 'Calculus',
    tagline: 'Derivatives · Integrals · Limits · Differential Equations',
    icon: <Calculator className="w-7 h-7" />,
    accent: 'text-cyan-400',
    gradientBorder: 'bg-gradient-to-br from-cyan-500/40 via-cyan-500/10 to-transparent',
    glow: 'shadow-[0_0_50px_rgba(6,182,212,0.18)]',
    badge: 'bg-cyan-500/15 text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
    accentHex: '#22d3ee',
    floatingColor: 'cyan',
  },
  {
    subject: 'biology',
    label: 'Biology',
    tagline: 'Cell Biology · Genetics · Evolution · Ecosystems',
    icon: <Dna className="w-7 h-7" />,
    accent: 'text-emerald-400',
    gradientBorder: 'bg-gradient-to-br from-emerald-500/40 via-emerald-500/10 to-transparent',
    glow: 'shadow-[0_0_50px_rgba(16,185,129,0.18)]',
    badge: 'bg-emerald-500/15 text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    accentHex: '#34d399',
    floatingColor: 'green',
  },
  {
    subject: 'computer-science',
    label: 'Computer Science',
    tagline: 'Binary · Conversions · Logic Gates · Algorithms',
    icon: <Cpu className="w-7 h-7" />,
    accent: 'text-violet-400',
    gradientBorder: 'bg-gradient-to-br from-violet-500/40 via-violet-500/10 to-transparent',
    glow: 'shadow-[0_0_50px_rgba(139,92,246,0.18)]',
    badge: 'bg-violet-500/15 text-violet-300',
    badgeBorder: 'border-violet-500/30',
    accentHex: '#a78bfa',
    floatingColor: 'purple',
  },
];

interface BestScoreRecord {
  score: number;
  total: number;
  pct: number;
}

function getBestScoreKey(subject: Subject, difficulty: Difficulty): string {
  return `stemtective-best-score:${subject}:${difficulty}`;
}

function readBestScore(subject: Subject, difficulty: Difficulty): BestScoreRecord | null {
  try {
    const raw = window.localStorage.getItem(getBestScoreKey(subject, difficulty));
    return raw ? JSON.parse(raw) as BestScoreRecord : null;
  } catch {
    return null;
  }
}

function writeBestScore(subject: Subject, difficulty: Difficulty, record: BestScoreRecord) {
  try {
    window.localStorage.setItem(getBestScoreKey(subject, difficulty), JSON.stringify(record));
  } catch {
    // Local storage can be unavailable in restricted browser contexts.
  }
}

const TOPIC_SUGGESTIONS: Record<Subject, string[]> = {
  calculus: ['Derivatives', 'Integrals', 'Limits', 'Chain Rule', 'Related Rates', 'Optimization'],
  biology: ['Genetics', 'Cell Biology', 'Evolution', 'DNA & RNA', 'Ecosystems', 'Photosynthesis'],
  'computer-science': ['Python Basics', 'Recursion', 'Sorting Algorithms', 'Logic Gates', 'Big-O Notation', 'Data Structures'],
};

const SUBJECT_STYLES: Record<
  Subject | 'default',
  {
    accent: string; pulse: string; badgeText: string; badgeBg: string; badgeBorder: string;
    cardBg: string; cardBorder: string; borderSoft: string; bgSoft: string;
    termBg: string; termBorder: string; mcHover: string; barBg: string; accentHex: string;
    confettiColors: string[];
  }
> = {
  default: {
    accent: 'text-cyan-400', pulse: 'bg-cyan-500', badgeText: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10', badgeBorder: 'border-cyan-500/50', cardBg: 'bg-cyan-500/5',
    cardBorder: 'border-cyan-500/20', borderSoft: 'border-cyan-500/20', bgSoft: 'bg-cyan-500/5',
    termBg: 'bg-cyan-500/10', termBorder: 'border-cyan-500/20', mcHover: 'hover:border-cyan-500/50',
    barBg: 'bg-cyan-500', accentHex: '#22d3ee', confettiColors: ['#22d3ee', '#06b6d4', '#0891b2'],
  },
  calculus: {
    accent: 'text-cyan-400', pulse: 'bg-cyan-500', badgeText: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10', badgeBorder: 'border-cyan-500/50', cardBg: 'bg-cyan-500/5',
    cardBorder: 'border-cyan-500/20', borderSoft: 'border-cyan-500/20', bgSoft: 'bg-cyan-500/5',
    termBg: 'bg-cyan-500/10', termBorder: 'border-cyan-500/20', mcHover: 'hover:border-cyan-500/50',
    barBg: 'bg-cyan-500', accentHex: '#22d3ee', confettiColors: ['#22d3ee', '#06b6d4', '#67e8f9'],
  },
  biology: {
    accent: 'text-emerald-400', pulse: 'bg-emerald-500', badgeText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10', badgeBorder: 'border-emerald-500/50', cardBg: 'bg-emerald-500/5',
    cardBorder: 'border-emerald-500/20', borderSoft: 'border-emerald-500/20', bgSoft: 'bg-emerald-500/5',
    termBg: 'bg-emerald-500/10', termBorder: 'border-emerald-500/20', mcHover: 'hover:border-emerald-500/50',
    barBg: 'bg-emerald-500', accentHex: '#34d399', confettiColors: ['#34d399', '#10b981', '#6ee7b7'],
  },
  'computer-science': {
    accent: 'text-violet-400', pulse: 'bg-violet-500', badgeText: 'text-violet-400',
    badgeBg: 'bg-violet-500/10', badgeBorder: 'border-violet-500/50', cardBg: 'bg-violet-500/5',
    cardBorder: 'border-violet-500/20', borderSoft: 'border-violet-500/20', bgSoft: 'bg-violet-500/5',
    termBg: 'bg-violet-500/10', termBorder: 'border-violet-500/20', mcHover: 'hover:border-violet-500/50',
    barBg: 'bg-violet-500', accentHex: '#a78bfa', confettiColors: ['#a78bfa', '#7c3aed', '#c4b5fd'],
  },
};

function getStyles(subject: Subject | null) {
  return subject ? SUBJECT_STYLES[subject] : SUBJECT_STYLES.default;
}

function getFloatingColor(subject: Subject | null, view: GameState['view']): 'cyan' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' {
  if (view === 'conclusion') return 'yellow';
  if (view === 'difficulty-select') return 'orange';
  if (view === 'question-count') return 'purple';
  if (!subject) return 'cyan';
  const cfg = SUBJECT_CONFIG.find(c => c.subject === subject);
  return cfg?.floatingColor ?? 'cyan';
}

function getDetectiveScheme(subject: Subject | null, view: GameState['view']): 'cyan' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' {
  if (view === 'conclusion') return 'yellow';
  if (view === 'difficulty-select') return 'orange';
  if (view === 'question-count') return 'purple';
  if (!subject) return 'cyan';
  const cfg = SUBJECT_CONFIG.find(c => c.subject === subject);
  return cfg?.floatingColor ?? 'cyan';
}

// ─────────────────────────────────────────────────────────
// Investigation narrative (procedural story text)
// ─────────────────────────────────────────────────────────
function getInvestigationNarrative(caseIndex: number, total: number, isCorrect: boolean, score: number): string {
  const remaining = total - caseIndex - 1;
  const sessionAccuracy = Math.round(((isCorrect ? score : score) / (caseIndex + 1)) * 100);

  if (isCorrect) {
    if (total === 1) return 'Single-case operation complete. Evidence secured and filed with the department. Outstanding work, detective.';
    if (remaining === 0) return `All ${total} evidence files confirmed and filed. The prosecutor has an airtight case. The department commends your precision.`;
    if (remaining === 1) return `Case ${caseIndex + 1} of ${total} resolved. One final lead remains — stay sharp. The suspect is cornered.`;
    if (caseIndex === 0) return `First breakthrough logged. ${remaining} more leads to pursue before the case is airtight. You're off to a strong start.`;
    if (sessionAccuracy === 100) return `Flawless record — ${caseIndex + 1} for ${caseIndex + 1}. ${remaining} cases remain. The department is taking notice.`;
    return `Evidence ${caseIndex + 1} of ${total} confirmed. Session accuracy: ${sessionAccuracy}%. The trail grows clearer — ${remaining} more suspect${remaining !== 1 ? 's' : ''} to pursue.`;
  } else {
    if (remaining === 0) return 'The final case went cold. Review the evidence carefully and return sharper next time. The city still needs you.';
    if (caseIndex === 0) return `Rough start — but the investigation is far from over. ${remaining} more leads remain. Regroup and stay focused.`;
    if (sessionAccuracy < 50) return `Session accuracy at ${sessionAccuracy}%. The department is watching closely. ${remaining} leads left to turn this around.`;
    return `Setback on case ${caseIndex + 1}. ${remaining} lead${remaining !== 1 ? 's' : ''} remain — the case is still winnable. Don't let the suspect walk.`;
  }
}

// ─────────────────────────────────────────────────────────
// Exit confirmation modal
// ─────────────────────────────────────────────────────────
function ExitModal({ onResume, onExit }: { onResume: () => void; onExit: () => void }) {
  return (
    <motion.div
      key="exit-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(2,6,23,0.85)' }}
      onClick={onResume}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-px rounded-3xl bg-gradient-to-br from-amber-500/40 via-amber-500/10 to-transparent">
          <div className="rounded-3xl bg-slate-950 p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <LogOut className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl uppercase tracking-tight">Abort Mission?</h3>
                  <p className="text-slate-500 text-xs font-mono mt-0.5">Progress will be lost</p>
                </div>
              </div>
              <button
                onClick={() => { playPop(); onResume(); }}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              You're currently mid-investigation. Exiting now will discard your progress and return
              you to subject selection. Are you sure you want to leave?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => { playPop(); onResume(); }}
                className="w-full py-3.5 rounded-2xl bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white font-bold tracking-wide transition-all text-sm uppercase"
              >
                Resume Investigation
              </button>
              <button
                onClick={() => { playPop(); onExit(); }}
                className="w-full py-3.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 text-red-300 font-bold tracking-wide transition-all text-sm uppercase"
              >
                Exit to Subject Select
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-600 font-mono mt-5 tracking-widest">
              PRESS ESC TO RESUME
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// Score ring
// ─────────────────────────────────────────────────────────
function ScoreRing({ pct, accentHex }: { pct: number; accentHex: string }) {
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const color = pct === 100 ? '#22c55e' : pct >= 50 ? accentHex : '#ef4444';
  return (
    <div className="relative flex items-center justify-center">
      <svg width="130" height="130" viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${(pct / 100) * circumference} ${circumference}` }}
          transition={{ duration: 1.4, delay: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-white leading-none">{pct}%</span>
        <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Accuracy</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────
const INITIAL_STATE: GameState = {
  subject: null,
  difficulty: null,
  questionLimit: null,
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
  const [showExitModal, setShowExitModal] = useState(false);
  const [bestScore, setBestScore] = useState<BestScoreRecord | null>(null);

  const activeCases = gameState.activeCases;
  const currentCase = activeCases[gameState.currentCaseIndex] ?? null;
  const subjectMeta = gameState.subject ? getSubjectMeta(gameState.subject) : null;
  const S = getStyles(gameState.subject);

  // ── Keyboard shortcuts ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      if (e.key === 'Escape') {
        if (showExitModal) { setShowExitModal(false); return; }
        if (gameState.view === 'investigation') { setShowExitModal(true); return; }
      }
      if (isTyping || showExitModal) return;

      if (gameState.view === 'investigation' && currentCase) {
        if (e.key === 'Enter' && gameState.isCorrect !== null) {
          e.preventDefault();
          playPop();
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
          return;
        }
        if (currentCase.problem.type !== 'code-fill' && gameState.isCorrect === null) {
          const idx = parseInt(e.key) - 1;
          if (idx >= 0 && idx < currentCase.problem.options.length) {
            e.preventDefault();
            playPop();
            const option = currentCase.problem.options[idx];
            const isCorrect = option === currentCase.problem.correctAnswer;
            if (isCorrect) fireConfetti(S.confettiColors);
            setGameState(prev => ({
              ...prev,
              selectedOption: option,
              isCorrect,
              score: isCorrect ? prev.score + 1 : prev.score,
              caseResults: [...prev.caseResults, {
                title: currentCase.title,
                topic: currentCase.problem.topic,
                correct: isCorrect,
                youtubeUrl: currentCase.problem.youtubeUrl,
              }],
            }));
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentCase, showExitModal, activeCases, S.confettiColors]);

  useEffect(() => {
    if (!gameState.subject || !gameState.difficulty) {
      setBestScore(null);
      return;
    }

    setBestScore(readBestScore(gameState.subject, gameState.difficulty));
  }, [gameState.subject, gameState.difficulty]);

  useEffect(() => {
    if (gameState.view !== 'conclusion' || !gameState.subject || !gameState.difficulty || activeCases.length === 0) return;

    const nextBest = {
      score: gameState.score,
      total: activeCases.length,
      pct: Math.round((gameState.score / activeCases.length) * 100),
    };
    const savedBest = readBestScore(gameState.subject, gameState.difficulty);
    const isNewBest = !savedBest ||
      nextBest.pct > savedBest.pct ||
      (nextBest.pct === savedBest.pct && nextBest.score > savedBest.score);

    if (isNewBest) {
      writeBestScore(gameState.subject, gameState.difficulty, nextBest);
      setBestScore(nextBest);
    } else {
      setBestScore(savedBest);
    }
  }, [gameState.view, gameState.subject, gameState.difficulty, gameState.score, activeCases.length]);

  // ── Confetti ────────────────────────────────────────────
  function fireConfetti(colors: string[]) {
    const opts = { colors, disableForReducedMotion: false, ticks: 220, gravity: 0.75 };
    void confetti({ ...opts, particleCount: 110, spread: 80, origin: { y: 0.65 } });
    setTimeout(() => {
      void confetti({ ...opts, particleCount: 55, angle: 55, spread: 60, origin: { x: 0, y: 0.7 } });
      void confetti({ ...opts, particleCount: 55, angle: 125, spread: 60, origin: { x: 1, y: 0.7 } });
    }, 140);
  }

  // ── Navigation handlers ─────────────────────────────────
  const goToSubjectSelect = () => {
    playPop();
    setTopicInput('');
    setGeminiStatus(null);
    setShowExitModal(false);
    setGameState({ ...INITIAL_STATE, view: 'subject-select' });
  };

  const selectSubject = (subject: Subject) => {
    playPop();
    setTopicInput('');
    setGameState({ ...INITIAL_STATE, subject, view: 'difficulty-select' });
  };

  const selectDifficulty = (difficulty: Difficulty) => {
    playPop();
    setGameState(prev => ({ ...prev, difficulty, view: 'question-count' }));
  };

  const selectQuestionLimit = (limit: QuestionLimit) => {
    playPop();
    setGameState(prev => ({ ...prev, questionLimit: limit, view: 'topic-input' }));
  };

  const handleTopicSkip = () => {
    playPop();
    if (!gameState.subject) return;
    const diff = gameState.difficulty ?? 'medium';
    setGeminiStatus(null);
    const cases = buildActiveCases(gameState.subject, diff, gameState.questionLimit);
    setGameState(prev => ({
      ...prev, userTopic: null, activeCases: cases, currentCaseIndex: 0, score: 0,
      isGameOver: false, view: 'investigation', selectedOption: null, isCorrect: null,
      codeInput: '', caseResults: [],
    }));
  };

  const selectTopic = async (topic: string) => {
    if (!gameState.subject || !topic.trim()) return;
    playPop();
    const subject = gameState.subject;
    const diff = gameState.difficulty ?? 'medium';
    const trimmed = topic.trim();
    const geminiCount = gameState.questionLimit ?? 4;
    setGeminiStatus(null);
    setGameState(prev => ({ ...prev, view: 'loading', userTopic: trimmed }));

    let geminiCases: ActiveCase[] | null = null;
    if (isGeminiAvailable()) {
      try {
        geminiCases = await generateTopicCases(subject, trimmed, diff, geminiCount);
      } catch { geminiCases = null; }
    }

    if (geminiCases && geminiCases.length > 0) {
      setGeminiStatus('success');
      setGameState(prev => ({
        ...prev, activeCases: geminiCases!, currentCaseIndex: 0, score: 0,
        isGameOver: false, view: 'investigation', selectedOption: null, isCorrect: null,
        codeInput: '', caseResults: [],
      }));
    } else {
      setGeminiStatus('fallback');
      const cases = buildActiveCases(subject, diff, gameState.questionLimit);
      setGameState(prev => ({
        ...prev, activeCases: cases, currentCaseIndex: 0, score: 0,
        isGameOver: false, view: 'investigation', selectedOption: null, isCorrect: null,
        codeInput: '', caseResults: [],
      }));
    }
  };

  const tryHarderDifficulty = () => {
    playPop();
    if (!gameState.subject) return;
    const nextDiff: Difficulty = gameState.difficulty === 'easy' ? 'medium' : 'hard';
    const cases = buildActiveCases(gameState.subject, nextDiff, gameState.questionLimit);
    setGeminiStatus(null);
    setTopicInput('');
    setGameState(prev => ({
      ...INITIAL_STATE, subject: prev.subject, difficulty: nextDiff, questionLimit: prev.questionLimit,
      activeCases: cases, currentCaseIndex: 0, score: 0, isGameOver: false, view: 'investigation',
      selectedOption: null, isCorrect: null, codeInput: '', caseResults: [],
    }));
  };

  const handleOptionSelect = (option: string) => {
    if (gameState.isCorrect !== null || !currentCase) return;
    playPop();
    const isCorrect = option === currentCase.problem.correctAnswer;
    if (isCorrect) fireConfetti(S.confettiColors);
    setGameState(prev => ({
      ...prev, selectedOption: option, isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
      caseResults: [...prev.caseResults, {
        title: currentCase.title,
        topic: currentCase.problem.topic,
        correct: isCorrect,
        youtubeUrl: currentCase.problem.youtubeUrl,
      }],
    }));
  };

  const handleCodeSubmit = () => {
    if (gameState.isCorrect !== null || !currentCase) return;
    const input = gameState.codeInput.trim();
    if (!input) return;
    playPop();
    const normalise = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    const isCorrect = normalise(input) === normalise(currentCase.problem.correctAnswer);
    if (isCorrect) fireConfetti(S.confettiColors);
    setGameState(prev => ({
      ...prev, selectedOption: input, isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
      caseResults: [...prev.caseResults, {
        title: currentCase.title,
        topic: currentCase.problem.topic,
        correct: isCorrect,
        youtubeUrl: currentCase.problem.youtubeUrl,
      }],
    }));
  };

  const nextStep = () => {
    playPop();
    if (gameState.currentCaseIndex < activeCases.length - 1) {
      setGameState(prev => ({
        ...prev, currentCaseIndex: prev.currentCaseIndex + 1,
        selectedOption: null, isCorrect: null, codeInput: '',
      }));
    } else {
      setGameState(prev => ({ ...prev, isGameOver: true, view: 'conclusion' }));
    }
  };

  const answeredCount = gameState.caseResults.length;
  const accuracyPct = answeredCount > 0 ? ((gameState.score / answeredCount) * 100).toFixed(1) : '—';
  const displayedStreak = gameState.caseResults
    .slice()
    .reverse()
    .findIndex(result => !result.correct);
  const currentStreak = displayedStreak === -1 ? gameState.caseResults.length : displayedStreak;
  const resetGame = () => { playPop(); setGameState(INITIAL_STATE); };

  const detectiveScheme = getDetectiveScheme(gameState.subject, gameState.view);
  const floatingColor = getFloatingColor(gameState.subject, gameState.view);
  const detectiveSearching = gameState.view !== 'conclusion' && gameState.view !== 'topic-input' && gameState.view !== 'question-count';
  const detectivePosition: 'left' | 'right' | 'center' =
    gameState.view === 'start' ? 'center' :
    gameState.view === 'subject-select' ? 'left' :
    gameState.view === 'difficulty-select' ? 'right' :
    gameState.view === 'question-count' ? 'left' :
    gameState.view === 'topic-input' ? 'right' :
    gameState.view === 'loading' ? 'center' :
    gameState.view === 'investigation' ? (gameState.currentCaseIndex % 2 === 0 ? 'left' : 'right') :
    'center';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative isolate overflow-x-hidden selection:bg-cyan-500/30 cursor-none">

      {/* ── Floating shapes (Figma Make) ─────────────────── */}
      <FloatingShapes colorScheme={floatingColor} subject={gameState.subject} />

      {/* ── Background ───────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_15%,_#0f172a_0%,_#020617_100%)]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <DetectiveSilhouette />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.10, 0.18, 0.10], x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-cyan-500/20 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.13, 0.08], x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] bg-violet-500/15 rounded-full blur-[140px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] z-[100] bg-[length:100%_2px] pointer-events-none opacity-10" />
      </div>

      {/* ── Detective character ───────────────────────────── */}
      <Detective
        position={detectivePosition}
        searching={detectiveSearching}
        colorScheme={detectiveScheme}
      />

      {/* ── Exit Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showExitModal && (
          <ExitModal onResume={() => setShowExitModal(false)} onExit={goToSubjectSelect} />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto p-5 md:p-8 min-h-screen flex flex-col">

        {/* ── Investigation / Conclusion Header ─────────── */}
        {(gameState.view === 'investigation' || gameState.view === 'conclusion') && (
          <motion.header
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-7 gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                'shadow-[0_0_20px_rgba(6,182,212,0.5)]', S.pulse,
              )}>
                <Search className="w-5 h-5 text-slate-950" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-black tracking-tight text-white uppercase leading-none">
                  {subjectMeta?.title} STEM-tective
                </h1>
                <p className={cn('text-[9px] font-mono tracking-[0.18em] uppercase opacity-60 mt-0.5', S.accent)}>
                  Intel Division · {subjectMeta?.title}
                  {gameState.difficulty && (
                    <span className="ml-2 opacity-80">· {gameState.difficulty.toUpperCase()}</span>
                  )}
                  {gameState.questionLimit !== null
                    ? <span className="ml-2 opacity-80">· {gameState.questionLimit} CASES</span>
                    : <span className="ml-2 opacity-80">· {activeCases.length} CASES</span>
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0">
              {/* Progress dots */}
              <div className="hidden sm:flex flex-col items-end gap-1.5">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Progress</p>
                <div className="flex gap-1.5 flex-wrap max-w-[200px] justify-end">
                  {activeCases.map((_, i) => {
                    const result = gameState.caseResults[i];
                    return (
                      <div
                        key={i}
                        className={cn(
                          'w-2.5 h-2.5 rounded-full transition-all duration-300',
                          result
                            ? result.correct
                              ? 'bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                              : 'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                            : i === gameState.currentCaseIndex
                            ? cn('animate-pulse', S.pulse)
                            : 'bg-white/15',
                        )}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Streak */}
              <div className="hidden md:block text-right">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Streak</p>
                <p className={cn('text-lg font-mono font-black leading-none', currentStreak > 0 ? 'text-green-400' : 'text-slate-500')}>
                  {currentStreak}
                </p>
              </div>

              {/* Best score */}
              {bestScore && (
                <div className="hidden lg:block text-right">
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Best</p>
                  <p className="text-lg font-mono font-black leading-none text-amber-300">
                    {bestScore.pct}%
                  </p>
                </div>
              )}

              {/* Accuracy */}
              <div className="text-right">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Accuracy</p>
                <p className={cn('text-lg font-mono font-black leading-none', S.accent)}>
                  {accuracyPct === '—' ? '—' : `${accuracyPct}%`}
                </p>
              </div>

              {gameState.view === 'investigation' && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { playPop(); setShowExitModal(true); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/45 text-red-400 text-xs font-bold uppercase tracking-widest transition-all group"
                >
                  <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline">Exit</span>
                </motion.button>
              )}
            </div>
          </motion.header>
        )}

        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════════════════════
              START SCREEN
          ═══════════════════════════════════════════════ */}
          {gameState.view === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="p-px rounded-[28px] bg-gradient-to-br from-cyan-500/50 via-cyan-500/15 to-transparent">
                    <div className="w-36 h-36 rounded-[27px] bg-slate-950 flex items-center justify-center">
                      <div className="w-20 h-20 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] relative">
                        <GraduationCap className="w-11 h-11 text-slate-950" />
                        <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-slate-950/30 rounded-full flex items-center justify-center">
                          <Target className="w-3 h-3 text-slate-950/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-3 -right-3 bg-red-500/20 border border-red-500/40 rounded-lg px-2.5 py-1 flex items-center gap-1.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-[9px] text-red-400 font-black tracking-widest uppercase">LIVE</span>
                </motion.div>
              </div>

              <div className="space-y-5">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
                  STEM-{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                    tective
                  </span>
                </h1>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-lg">
                  Deploy mathematical and scientific intelligence to intercept suspects and analyse crime scenes.
                  Choose your field of expertise and crack the case.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { playPop(); goToSubjectSelect(); }}
                className="relative group bg-cyan-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                Begin Investigation
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {[
                  { icon: <BookOpen className="w-4 h-4" />, label: '3 Subjects', sub: 'Calculus · Biology · CS' },
                  { icon: <Shield className="w-4 h-4" />, label: '3 Difficulty Levels', sub: 'Easy → Medium → Hard' },
                  { icon: <Zap className="w-4 h-4" />, label: 'AI-Generated Cases', sub: 'Powered by Gemini' },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/4 border border-white/8 backdrop-blur-md">
                    <span className="text-slate-400">{icon}</span>
                    <div className="text-left">
                      <p className="text-white text-sm font-bold leading-none">{label}</p>
                      <p className="text-slate-500 text-xs font-mono mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              SUBJECT SELECT
          ═══════════════════════════════════════════════ */}
          {gameState.view === 'subject-select' && (
            <motion.div
              key="subject-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center space-y-10"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Intelligence Division
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                  Choose Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                    Field
                  </span>
                </h2>
                <p className="text-slate-400 max-w-sm mx-auto text-base">
                  Each subject presents unique investigation cases. No two sessions are alike.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl">
                {SUBJECT_CONFIG.map((cfg, i) => (
                  <motion.div
                    key={cfg.subject}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-px rounded-3xl cursor-pointer"
                  >
                    <div className={cn('p-px rounded-3xl', cfg.gradientBorder, cfg.glow)}>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectSubject(cfg.subject)}
                        className="group w-full h-full rounded-[23px] bg-slate-950/95 p-7 flex flex-col items-start gap-5 text-left backdrop-blur-xl"
                      >
                        <div className="self-end">
                          <span className={cn('px-2 py-0.5 rounded-md text-[9px] font-black border tracking-[0.2em] uppercase', cfg.badge, cfg.badgeBorder)}>
                            ACTIVE
                          </span>
                        </div>
                        <div className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center border transition-all',
                          cfg.badgeBorder, cfg.accent,
                        )}
                          style={{ background: `${cfg.accentHex}18` }}
                        >
                          {cfg.icon}
                        </div>
                        <div className="space-y-2 flex-1">
                          <h3 className={cn('text-2xl font-black uppercase tracking-tight', cfg.accent)}>
                            {cfg.label}
                          </h3>
                          <p className="text-slate-500 text-base leading-relaxed">{cfg.tagline}</p>
                        </div>
                        <div className={cn('flex items-center gap-2 text-sm font-black uppercase tracking-widest', cfg.accent)}>
                          Start Investigation
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={resetGame}
                className="text-slate-600 hover:text-slate-300 text-sm uppercase tracking-widest font-bold flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Back to Start
              </button>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              DIFFICULTY SELECT
          ═══════════════════════════════════════════════ */}
          {gameState.view === 'difficulty-select' && gameState.subject && (() => {
            const cfg = SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!;
            const diffs = [
              {
                level: 'easy' as const,
                label: 'Easy',
                tagline: 'Fundamental concepts · Beginner-friendly · Multiple choice only',
                icon: '🔍',
                gradientBorder: 'bg-gradient-to-br from-green-500/40 via-green-500/10 to-transparent',
                glow: 'shadow-[0_0_40px_rgba(34,197,94,0.12)]',
                accent: 'text-green-400',
                badge: 'bg-green-500/15 text-green-300',
                badgeBorder: 'border-green-500/30',
              },
              {
                level: 'medium' as const,
                label: 'Medium',
                tagline: 'Mixed concepts · Randomised questions · Standard challenge',
                icon: '🎯',
                gradientBorder: 'bg-gradient-to-br from-amber-500/40 via-amber-500/10 to-transparent',
                glow: 'shadow-[0_0_40px_rgba(245,158,11,0.12)]',
                accent: 'text-amber-400',
                badge: 'bg-amber-500/15 text-amber-300',
                badgeBorder: 'border-amber-500/30',
              },
              {
                level: 'hard' as const,
                label: 'Hard',
                tagline: 'Advanced applications · Complex reasoning · Code challenges',
                icon: '⚡',
                gradientBorder: 'bg-gradient-to-br from-red-500/40 via-red-500/10 to-transparent',
                glow: 'shadow-[0_0_40px_rgba(239,68,68,0.12)]',
                accent: 'text-red-400',
                badge: 'bg-red-500/15 text-red-300',
                badgeBorder: 'border-red-500/30',
              },
            ] as const;
            return (
              <motion.div
                key="difficulty-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col items-center justify-center space-y-10"
              >
                <div className="text-center space-y-4">
                  <div className={cn(
                    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.25em] uppercase',
                    cfg.badge, cfg.badgeBorder,
                  )}>
                    {cfg.label} Division
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Choose{' '}
                    <span className={cn('text-transparent bg-clip-text bg-gradient-to-r', cfg.accent)}>
                      Difficulty
                    </span>
                  </h2>
                  <p className="text-slate-400 max-w-sm mx-auto text-base">
                    Pick a challenge level that matches your current knowledge.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
                  {diffs.map((d, i) => (
                    <motion.div
                      key={d.level}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className={cn('p-px rounded-3xl', d.gradientBorder, d.glow)}>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectDifficulty(d.level)}
                          className="group w-full rounded-[23px] bg-slate-950/95 p-7 flex flex-col items-start gap-5 text-left backdrop-blur-xl"
                        >
                          <div className="text-4xl">{d.icon}</div>
                          <div className="space-y-2 flex-1">
                            <h3 className={cn('text-2xl font-black uppercase tracking-tight', d.accent)}>{d.label}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{d.tagline}</p>
                          </div>
                          <div className={cn('flex items-center gap-2 text-sm font-black uppercase tracking-widest', d.accent)}>
                            Select
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={goToSubjectSelect}
                  className="text-slate-600 hover:text-slate-300 text-sm uppercase tracking-widest font-bold flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Back to Subject Select
                </button>
              </motion.div>
            );
          })()}

          {/* ═══════════════════════════════════════════════
              QUESTION COUNT SELECT
          ═══════════════════════════════════════════════ */}
          {gameState.view === 'question-count' && gameState.subject && (() => {
            const cfg = SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!;
            const counts: {
              limit: QuestionLimit;
              label: string;
              sub: string;
              description: string;
              icon: React.ReactNode;
              gradientBorder: string;
              glow: string;
              accent: string;
              badge: string;
              badgeBorder: string;
            }[] = [
              {
                limit: 5,
                label: '5 Cases',
                sub: 'Quick Strike',
                description: 'A focused burst of 5 targeted cases. Fast, sharp, efficient.',
                icon: <FileText className="w-7 h-7" />,
                gradientBorder: 'bg-gradient-to-br from-sky-500/40 via-sky-500/10 to-transparent',
                glow: 'shadow-[0_0_40px_rgba(14,165,233,0.12)]',
                accent: 'text-sky-400',
                badge: 'bg-sky-500/15 text-sky-300',
                badgeBorder: 'border-sky-500/30',
              },
              {
                limit: 10,
                label: '10 Cases',
                sub: 'Full Operation',
                description: 'A comprehensive 10-case deep dive. The full detective experience.',
                icon: <Layers className="w-7 h-7" />,
                gradientBorder: 'bg-gradient-to-br from-violet-500/40 via-violet-500/10 to-transparent',
                glow: 'shadow-[0_0_40px_rgba(139,92,246,0.12)]',
                accent: 'text-violet-400',
                badge: 'bg-violet-500/15 text-violet-300',
                badgeBorder: 'border-violet-500/30',
              },
              {
                limit: null,
                label: 'Unlimited',
                sub: 'Marathon Session',
                description: 'Every available case in the dossier. No shortcuts, no mercy.',
                icon: <InfinityIcon className="w-7 h-7" />,
                gradientBorder: 'bg-gradient-to-br from-amber-500/40 via-amber-500/10 to-transparent',
                glow: 'shadow-[0_0_40px_rgba(245,158,11,0.12)]',
                accent: 'text-amber-400',
                badge: 'bg-amber-500/15 text-amber-300',
                badgeBorder: 'border-amber-500/30',
              },
            ];

            return (
              <motion.div
                key="question-count"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col items-center justify-center space-y-10"
              >
                <div className="text-center space-y-4">
                  <div className={cn(
                    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.25em] uppercase',
                    cfg.badge, cfg.badgeBorder,
                  )}>
                    {cfg.label} · {gameState.difficulty?.toUpperCase()}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Case{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
                      Load
                    </span>
                  </h2>
                  <p className="text-slate-400 max-w-sm mx-auto text-base">
                    How many cases do you want in this session? Each case presents one evidence-based problem.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
                  {counts.map((c, i) => (
                    <motion.div
                      key={String(c.limit)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className={cn('p-px rounded-3xl', c.gradientBorder, c.glow)}>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectQuestionLimit(c.limit)}
                          className="group w-full rounded-[23px] bg-slate-950/95 p-7 flex flex-col items-start gap-5 text-left backdrop-blur-xl"
                        >
                          <div className={cn(
                            'w-14 h-14 rounded-2xl flex items-center justify-center border transition-all',
                            c.badgeBorder, c.accent,
                          )}
                            style={{ background: 'rgba(255,255,255,0.05)' }}
                          >
                            {c.icon}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <h3 className={cn('text-2xl font-black uppercase tracking-tight', c.accent)}>{c.label}</h3>
                            <p className={cn('text-xs font-black uppercase tracking-widest', c.badge.split(' ')[1])}>{c.sub}</p>
                            <p className="text-slate-500 text-sm leading-relaxed mt-2">{c.description}</p>
                          </div>
                          <div className={cn('flex items-center gap-2 text-sm font-black uppercase tracking-widest', c.accent)}>
                            Select
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={() => { playPop(); setGameState(prev => ({ ...prev, view: 'difficulty-select' })); }}
                  className="text-slate-600 hover:text-slate-300 text-sm uppercase tracking-widest font-bold flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Back to Difficulty Select
                </button>
              </motion.div>
            );
          })()}

          {/* ═══════════════════════════════════════════════
              TOPIC INPUT
          ═══════════════════════════════════════════════ */}
          {gameState.view === 'topic-input' && gameState.subject && (() => {
            const cfg = SUBJECT_CONFIG.find(c => c.subject === gameState.subject)!;
            return (
              <motion.div
                key="topic-input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-2xl mx-auto w-full"
              >
                <div className="text-center space-y-4">
                  <div className={cn(
                    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.25em] uppercase',
                    cfg.badge, cfg.badgeBorder,
                  )}>
                    {cfg.label} · {gameState.difficulty?.toUpperCase()} · {gameState.questionLimit ?? 'ALL'} CASES
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Specify Your{' '}
                    <span className={cfg.accent}>Focus</span>
                  </h2>
                  <p className="text-slate-400 text-base max-w-sm mx-auto">
                    Type any topic and Gemini will build a full investigation around it. Or skip to use standard cases.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <div className={cn('p-px rounded-2xl', cfg.gradientBorder)}>
                    <div className="rounded-[15px] bg-slate-950/95 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-black/30">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        <span className="text-[9px] text-slate-600 font-mono ml-2 uppercase tracking-widest">
                          topic_input.sh
                        </span>
                      </div>
                      <div className="flex items-center gap-3 px-5">
                        <span className={cn('shrink-0 font-mono text-sm', cfg.accent)}>›</span>
                        <input
                          type="text"
                          value={topicInput}
                          onChange={e => setTopicInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && topicInput.trim() && selectTopic(topicInput)}
                          placeholder={`e.g. ${TOPIC_SUGGESTIONS[gameState.subject][0]}, ${TOPIC_SUGGESTIONS[gameState.subject][1]}…`}
                          autoFocus
                          className="flex-1 bg-transparent text-white text-base font-mono outline-none placeholder:text-slate-700 py-4"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {TOPIC_SUGGESTIONS[gameState.subject].map(s => (
                      <button
                        key={s}
                        onClick={() => { setTopicInput(s); selectTopic(s); }}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-sm font-bold border transition-all hover:opacity-80',
                          cfg.badge, cfg.badgeBorder,
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => topicInput.trim() && selectTopic(topicInput)}
                    disabled={!topicInput.trim()}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all border',
                      topicInput.trim()
                        ? cn(cfg.badge, cfg.badgeBorder, 'hover:opacity-90')
                        : 'bg-white/3 border-white/8 text-slate-600 cursor-not-allowed',
                    )}
                  >
                    <Brain className="w-4 h-4" />
                    Generate with Gemini
                  </motion.button>
                  <button
                    onClick={handleTopicSkip}
                    className="px-6 py-4 rounded-2xl text-slate-500 hover:text-slate-300 text-sm uppercase tracking-widest font-bold border border-white/8 hover:border-white/20 transition-all"
                  >
                    Use Standard Cases
                  </button>
                </div>

                <button
                  onClick={() => { playPop(); setGameState(prev => ({ ...prev, view: 'question-count' })); }}
                  className="text-slate-600 hover:text-slate-400 text-sm uppercase tracking-widest font-bold flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Back to Case Load
                </button>
              </motion.div>
            );
          })()}

          {/* ═══════════════════════════════════════════════
              LOADING
          ═══════════════════════════════════════════════ */}
          {gameState.view === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-10 text-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  className={cn(
                    'w-20 h-20 rounded-3xl flex items-center justify-center border',
                    S.termBg, S.termBorder,
                  )}
                >
                  <Search className={cn('w-9 h-9', S.accent)} />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={cn('absolute inset-[-16px] rounded-[40px] border', S.termBorder)}
                />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  Building Your Investigation
                </h2>
                <p className={cn('text-sm font-mono', S.accent)}>
                  Generating{' '}
                  {gameState.questionLimit !== null ? `${gameState.questionLimit} ` : ''}
                  custom cases on{' '}
                  <span className="font-bold">"{gameState.userTopic}"</span>…
                </p>
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold mt-4">
                  Powered by Gemini AI
                </p>
              </div>
              <div className="flex gap-2.5">
                {[0, 1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.25 }}
                    className={cn('w-2 h-2 rounded-full', S.pulse)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════
              INVESTIGATION
          ═══════════════════════════════════════════════ */}
          {gameState.view === 'investigation' && currentCase && (
            <motion.div
              key={`investigation-${gameState.currentCaseIndex}-${currentCase.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="flex-1 flex flex-col gap-5"
            >
              {/* AI status banners */}
              {geminiStatus === 'fallback' && gameState.userTopic && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono"
                >
                  <span className="font-black uppercase tracking-widest shrink-0">⚠ Gemini fallback</span>
                  <span className="text-amber-400/60">
                    Could not generate "{gameState.userTopic}" cases — showing standard cases instead.
                  </span>
                </motion.div>
              )}
              {geminiStatus === 'success' && gameState.currentCaseIndex === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl border text-xs font-mono', S.bgSoft, S.borderSoft, S.accent)}
                >
                  <span className="font-black uppercase tracking-widest shrink-0">✦ AI Generated</span>
                  <span className="opacity-50">{activeCases.length} custom cases on "{gameState.userTopic}" — powered by Gemini</span>
                </motion.div>
              )}

              <div className="grid grid-cols-12 gap-5 flex-1">
                {/* ── Left: Briefing Panel ── */}
                <div className="col-span-12 lg:col-span-4 flex flex-col">
                  <motion.section
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 }}
                    className="flex-1 flex flex-col"
                  >
                    <div className={cn('p-px rounded-3xl flex-1 flex flex-col', S.badgeBorder.replace('border-', 'bg-').replace('/50', '/20'))}>
                      <div className="flex-1 rounded-[23px] bg-slate-950/95 backdrop-blur-xl p-6 flex flex-col">
                        <div className="mb-5">
                          <motion.span
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="inline-block px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-[9px] font-black border border-red-500/25 uppercase tracking-wider mb-4"
                          >
                            Case {gameState.currentCaseIndex + 1} of {activeCases.length}
                          </motion.span>
                          <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-black text-white leading-tight uppercase mb-3 tracking-tight"
                          >
                            {currentCase.title}
                          </motion.h2>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-400 text-base leading-relaxed italic"
                          >
                            "{currentCase.description}"
                          </motion.p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-2.5 mb-6"
                        >
                          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-cyan-400 shrink-0">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs text-slate-600 uppercase font-black tracking-wider">Coordinates</div>
                              <div className="text-sm font-mono text-slate-300 truncate">{currentCase.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center text-violet-400 shrink-0">
                              <Brain className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs text-slate-600 uppercase font-black tracking-wider">Analysis Mode</div>
                              <div className="text-sm font-mono text-slate-300 truncate">{currentCase.problem.topic}</div>
                            </div>
                          </div>
                        </motion.div>

                        {/* AI Partner hint */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.65 }}
                          className={cn('mt-auto p-4 rounded-2xl border', S.borderSoft, S.bgSoft)}
                        >
                          <div className={cn('flex items-center gap-1.5 mb-2', S.accent)}>
                            <span className="text-xs font-black uppercase tracking-[0.2em]">AI Partner</span>
                            <span className="text-xs font-mono opacity-50">✦ live</span>
                          </div>
                          <p className="text-sm text-slate-400 leading-relaxed italic">
                            "{currentCase.hint ?? `Analyze the ${currentCase.evidenceType} carefully. Your knowledge of ${currentCase.problem.topic} is the key.`}"
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.section>
                </div>

                {/* ── Right: Forensic Workspace ── */}
                <div className="col-span-12 lg:col-span-8 flex flex-col">
                  <motion.section
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex-1 bg-slate-900/60 backdrop-blur-xl border border-white/8 rounded-3xl p-7 flex flex-col min-h-[460px]"
                  >
                    <div className="flex items-center justify-between mb-7">
                      <h3 className="text-base font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <div className={cn('w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px]', S.pulse)} />
                        Forensic Workspace
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 text-[9px] border border-white/8 rounded-lg bg-white/4 font-black tracking-widest text-slate-500 uppercase">
                          SECURE
                        </div>
                      </div>
                    </div>

                    {/* Formula / topic badge */}
                    {currentCase.problem.formula ? (
                      <motion.div
                        key={currentCase.id + '-formula'}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-950/60 rounded-2xl p-8 border border-white/5 mb-7 flex flex-col items-center justify-center relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />
                        <p className={cn('text-[9px] uppercase font-mono mb-4 tracking-[0.2em] relative z-10', S.accent)}>
                          Detected Data Matrix
                        </p>
                        <div className="text-2xl md:text-4xl text-white relative z-10 group-hover:scale-105 transition-transform duration-500">
                          <BlockMath math={currentCase.problem.formula} />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={currentCase.id + '-topic'}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-slate-950/60 rounded-2xl p-6 border border-white/5 mb-7 flex items-center gap-5"
                      >
                        <div className={cn('w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0', S.termBorder)}
                          style={{ background: `${S.accentHex}12` }}
                        >
                          {gameState.subject === 'biology'
                            ? <Dna className={cn('w-7 h-7', S.accent)} />
                            : <Cpu className={cn('w-7 h-7', S.accent)} />}
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-600 uppercase font-mono tracking-[0.2em] mb-1">Analysis Mode</p>
                          <p className={cn('text-xl font-black uppercase tracking-tight', S.accent)}>
                            {currentCase.problem.topic}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Question */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="flex items-start gap-4 mb-7"
                    >
                      <div className={cn('w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5', S.termBg, S.termBorder)}>
                        <TerminalIcon className={cn('w-4 h-4', S.accent)} />
                      </div>
                      <p className="text-lg md:text-xl text-white font-medium tracking-tight leading-snug">
                        {currentCase.problem.question}
                      </p>
                    </motion.div>

                    {/* Answer input area */}
                    <div className="flex-1">
                      {currentCase.problem.type === 'code-fill' ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.55 }}
                          className="space-y-3"
                        >
                          {currentCase.problem.codeTemplate && (() => {
                            const parts = currentCase.problem.codeTemplate.split('___');
                            return (
                              <div className="bg-slate-950/80 rounded-2xl border border-violet-500/20 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2 border-b border-violet-500/10 bg-black/20">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                  <span className="text-[9px] text-slate-600 font-mono ml-2 uppercase tracking-widest">evidence.py</span>
                                </div>
                                <pre className="font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed p-4">
                                  {parts[0]}
                                  <span className={cn(
                                    'inline-block min-w-[3ch] border-b-2 text-center px-1 transition-colors font-bold',
                                    gameState.isCorrect === null ? 'border-violet-400 text-violet-400'
                                      : gameState.isCorrect ? 'border-green-400 text-green-300'
                                      : 'border-red-400 text-red-300',
                                  )}>
                                    {gameState.isCorrect !== null ? gameState.codeInput : '   '}
                                  </span>
                                  {parts[1]}
                                </pre>
                              </div>
                            );
                          })()}
                          <div className={cn(
                            'flex items-center gap-2 rounded-2xl border transition-colors overflow-hidden',
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
                              className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-slate-700 py-4"
                            />
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={handleCodeSubmit}
                              disabled={gameState.isCorrect !== null || !gameState.codeInput.trim()}
                              className={cn(
                                'px-5 py-4 font-mono text-xs font-black uppercase tracking-widest transition-all shrink-0',
                                gameState.isCorrect !== null || !gameState.codeInput.trim()
                                  ? 'text-slate-700 cursor-not-allowed'
                                  : 'text-violet-300 hover:text-violet-100',
                              )}
                            >
                              Run
                            </motion.button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.55 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                          {currentCase.problem.options.map((option, idx) => {
                            const isSelected = gameState.selectedOption === option;
                            const isCorrectOption = option === currentCase.problem.correctAnswer;
                            const isAnswered = gameState.isCorrect !== null;
                            return (
                              <motion.button
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + idx * 0.08 }}
                                key={option}
                                onClick={() => handleOptionSelect(option)}
                                disabled={isAnswered}
                                className={cn(
                                  'group relative min-h-16 h-auto rounded-2xl border transition-all duration-200 overflow-hidden text-left px-5 py-4',
                                  isSelected
                                    ? isCorrectOption
                                      ? 'bg-green-500/20 border-green-500/60 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                                      : 'bg-red-500/20 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                                    : isAnswered && isCorrectOption
                                    ? 'bg-green-500/10 border-green-500/40'
                                    : cn('bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/20', S.mcHover),
                                )}
                              >
                                <div className="flex items-center justify-between gap-3 relative z-10">
                                  <span className={cn(
                                    'flex-shrink-0 w-5 h-5 rounded-md text-[9px] font-black flex items-center justify-center border transition-colors',
                                    isSelected
                                      ? isCorrectOption ? 'bg-green-500/30 border-green-500/40 text-green-300' : 'bg-red-500/30 border-red-500/40 text-red-300'
                                      : 'bg-white/5 border-white/10 text-slate-600 group-hover:border-white/20',
                                  )}>
                                    {idx + 1}
                                  </span>
                                  <span className={cn(
                                    'font-mono text-sm font-bold tracking-wide leading-snug flex-1',
                                    isSelected
                                      ? isCorrectOption ? 'text-green-300' : 'text-red-300'
                                      : isAnswered && isCorrectOption ? 'text-green-300' : 'text-slate-200',
                                  )}>
                                    {option}
                                  </span>
                                  {isSelected && (
                                    isCorrectOption
                                      ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                      : <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                  )}
                                  {!isSelected && isAnswered && isCorrectOption && (
                                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                  )}
                                </div>
                                <div className={cn('absolute inset-x-0 bottom-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-40', S.barBg)} />
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>

                    {gameState.isCorrect === null && currentCase.problem.type !== 'code-fill' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-[9px] text-slate-700 font-mono mt-4 text-right tracking-widest"
                      >
                        Press 1–4 to select · ESC to exit
                      </motion.p>
                    )}
                    {gameState.isCorrect !== null && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[9px] text-slate-700 font-mono mt-2 text-right tracking-widest"
                      >
                        Press ENTER for next stage
                      </motion.p>
                    )}

                    {/* ── Enhanced Feedback Panel ── */}
                    <AnimatePresence>
                      {gameState.isCorrect !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: 4, height: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className={cn(
                            'mt-6 rounded-2xl border overflow-hidden',
                            gameState.isCorrect
                              ? 'bg-green-500/8 border-green-500/30'
                              : 'bg-red-500/8 border-red-500/30',
                          )}
                        >
                          <div className="p-5 space-y-5">
                            {/* Result header */}
                            <div className={cn(
                              'font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2',
                              gameState.isCorrect ? 'text-green-400' : 'text-red-400',
                            )}>
                              {gameState.isCorrect
                                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                                : <XCircle className="w-4 h-4 shrink-0" />}
                              {gameState.isCorrect ? 'Evidence Secured' : 'Case Compromised'}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                              <div className="flex-1 min-w-0 space-y-4">
                                {/* Case narrative */}
                                <div>
                                  <p className="text-xs text-slate-600 uppercase font-black tracking-widest mb-2">
                                    Case Narrative
                                  </p>
                                  <p className="text-base text-slate-300 leading-relaxed italic border-l-2 border-white/10 pl-3">
                                    {gameState.isCorrect ? currentCase.successStory : currentCase.failureStory}
                                  </p>
                                </div>

                                {/* Theoretical justification */}
                                <div className="pt-3 border-t border-white/8">
                                  <p className="text-xs text-slate-600 uppercase font-black tracking-widest mb-2">
                                    Field Notes
                                  </p>
                                  <p className="text-sm text-slate-500 font-mono leading-relaxed">
                                    {currentCase.problem.explanation}
                                  </p>
                                </div>

                                {/* Correct answer (on failure, code-fill) */}
                                {currentCase.problem.type === 'code-fill' && !gameState.isCorrect && (
                                  <div className="pt-3 border-t border-white/8">
                                    <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest mb-1">Correct Answer</p>
                                    <p className="text-sm text-green-400 font-mono font-black">{currentCase.problem.correctAnswer}</p>
                                  </div>
                                )}

                                {/* Investigation log — procedural narrative */}
                                <div className={cn(
                                  'pt-3 border-t rounded-xl p-3 mt-1',
                                  gameState.isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5',
                                )}>
                                  <p className="text-xs text-slate-600 uppercase font-black tracking-widest mb-1.5">
                                    Investigation Log
                                  </p>
                                  <p className={cn('text-sm leading-relaxed font-medium', gameState.isCorrect ? 'text-green-300/80' : 'text-red-300/80')}>
                                    {getInvestigationNarrative(
                                      gameState.currentCaseIndex,
                                      activeCases.length,
                                      gameState.isCorrect,
                                      gameState.score,
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex flex-col gap-2.5 shrink-0 sm:w-44">
                                <a
                                  href={currentCase.problem.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => playPop()}
                                  className="flex items-center justify-center gap-2 h-11 rounded-xl bg-red-600/15 hover:bg-red-600/30 border border-red-500/25 hover:border-red-500/50 text-red-300 font-bold transition-all text-sm uppercase tracking-widest group"
                                >
                                  <Youtube className="w-4 h-4" />
                                  Tutorial
                                  <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={nextStep}
                                  className="flex-1 bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/25 text-white rounded-xl font-black flex items-center justify-center gap-2 transition-all group uppercase tracking-widest text-sm"
                                >
                                  {gameState.currentCaseIndex < activeCases.length - 1 ? 'Next Stage' : 'Conclude'}
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

          {/* ═══════════════════════════════════════════════
              CONCLUSION
          ═══════════════════════════════════════════════ */}
          {gameState.view === 'conclusion' && (() => {
            const total = activeCases.length;
            const score = gameState.score;
            const pct = total > 0 ? Math.round((score / total) * 100) : 0;
            const rank =
              score === total ? 'Master Analyst' :
              score >= total - 1 ? 'Senior Specialist' :
              score >= total - 2 ? 'Field Operative' :
              score === 1 ? 'Junior Trainee' :
              'Rookie Recruit';
            const rankMsg =
              score === total
                ? 'Flawless. Every suspect apprehended, every clue decoded. The city is safer because of you.'
                : score >= total - 1
                ? 'Outstanding work. One slip won\'t define you — the department is impressed.'
                : score >= total - 2
                ? 'Solid performance. Review the cases you missed and come back sharper.'
                : score === 1
                ? 'A single resolve. The field is unforgiving — study hard before the next assignment.'
                : 'The suspects walked free this time. Hit the books, Detective. The city needs you ready.';
            const missedResults = gameState.caseResults.filter((r: CaseResult) => !r.correct);
            const reviewSource = missedResults.length > 0 ? missedResults : gameState.caseResults;
            const seenVideoUrls = new Set<string>();
            const recommendedVideos = reviewSource
              .filter((r: CaseResult) => {
                if (!r.youtubeUrl || seenVideoUrls.has(r.youtubeUrl)) return false;
                seenVideoUrls.add(r.youtubeUrl);
                return true;
              })
              .slice(0, 4);
            const reviewTitle = missedResults.length > 0 ? 'Recommended Review' : 'Reinforcement Videos';
            const reviewSubtitle = missedResults.length > 0
              ? 'Focused on the questions that went cold.'
              : 'Clean case file. Keep these topics sharp.';
            return (
              <motion.div
                key="conclusion"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-10"
              >
                <div className="space-y-4">
                  <div className={cn(
                    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.3em] uppercase',
                    S.badgeBg, S.badgeBorder, S.badgeText,
                  )}>
                    <div className={cn('w-1.5 h-1.5 rounded-full', S.pulse)} />
                    Investigation Complete
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
                    Case{' '}
                    <span className={cn('text-transparent bg-clip-text bg-gradient-to-r', S.accent)}>
                      Closed
                    </span>
                  </h2>
                  {subjectMeta && (
                    <p className="text-slate-600 uppercase tracking-widest text-[10px] font-black">
                      {subjectMeta.title} Division
                    </p>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full max-w-4xl"
                >
                  <div className="md:col-span-4">
                    <div className="p-px rounded-3xl bg-gradient-to-br from-white/15 via-white/5 to-transparent">
                      <div className="rounded-[23px] bg-slate-950/95 p-7 flex flex-col items-center gap-4">
                        <ScoreRing pct={pct} accentHex={S.accentHex} />
                        <div>
                          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black mb-1">Score</p>
                          <motion.p
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 120, delay: 0.5 }}
                            className="text-5xl font-black text-white leading-none"
                          >
                            {score}<span className="text-xl text-slate-600">/{total}</span>
                          </motion.p>
                          {bestScore && (
                            <p className="text-[10px] text-amber-300 font-mono font-bold mt-2">
                              BEST {bestScore.score}/{bestScore.total} ({bestScore.pct}%)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8">
                    <div className={cn('p-px rounded-3xl', S.badgeBorder.replace('border-', 'bg-').replace('/50', '/30'))}>
                      <div className={cn('rounded-[23px] p-7 flex flex-col justify-center text-left h-full', S.cardBg)}>
                        <div className={cn('text-[9px] uppercase tracking-[0.3em] font-black mb-5 pb-3 border-b flex items-center gap-2', S.accent, S.cardBorder)}>
                          <Shield className="w-3 h-3" />
                          Final Performance Audit
                        </div>
                        <div className="text-3xl font-black text-white mb-3 italic uppercase tracking-tight">{rank}</div>
                        <p className="text-slate-400 leading-relaxed italic text-base max-w-sm">{rankMsg}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Case breakdown */}
                {gameState.caseResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-4xl"
                  >
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black mb-4 text-left">
                      Case Breakdown
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {gameState.caseResults.map((r: CaseResult, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.06 }}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-2xl border',
                            r.correct
                              ? 'bg-green-500/5 border-green-500/20'
                              : 'bg-red-500/5 border-red-500/20',
                          )}
                        >
                          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', r.correct ? 'bg-green-500/20' : 'bg-red-500/20')}>
                            {r.correct
                              ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                              : <XCircle className="w-4 h-4 text-red-400" />}
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-xs font-bold text-white truncate">{r.title}</p>
                            <p className="text-[10px] text-slate-600 font-mono">{r.topic}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Recommended videos */}
                {recommendedVideos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full max-w-4xl"
                  >
                    <div className="flex items-end justify-between gap-4 mb-4">
                      <div className="text-left">
                        <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black mb-1">
                          {reviewTitle}
                        </p>
                        <p className="text-xs text-slate-500">{reviewSubtitle}</p>
                      </div>
                      <div className={cn('hidden sm:flex items-center gap-2 text-[9px] uppercase tracking-widest font-black', S.accent)}>
                        <Youtube className="w-3.5 h-3.5" />
                        Tutorial Queue
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recommendedVideos.map((r: CaseResult, i: number) => (
                        <motion.a
                          key={`${r.youtubeUrl}-${i}`}
                          href={r.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playPop()}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.07 }}
                          className="group flex items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/8 hover:bg-red-500/14 hover:border-red-500/40 p-4 text-left transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0 text-red-300 group-hover:text-red-200">
                            <Youtube className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={cn('rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest', S.badgeBg, S.badgeBorder, S.badgeText)}>
                                {r.topic}
                              </span>
                              {!r.correct && (
                                <span className="rounded-md border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-red-300">
                                  Missed
                                </span>
                              )}
                            </div>
                            <p className="truncate text-sm font-bold text-white">{r.title}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-red-300 shrink-0 transition-colors" />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Try Harder banner */}
                {gameState.difficulty !== 'hard' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-4xl"
                  >
                    <div className="p-px rounded-2xl bg-gradient-to-r from-amber-500/30 via-amber-500/10 to-transparent">
                      <div className="rounded-[15px] bg-slate-950/90 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-left">
                          <p className="text-amber-300 font-black text-sm uppercase tracking-widest mb-1">
                            Ready for more?
                          </p>
                          <p className="text-slate-400 text-xs">
                            Try{' '}
                            <span className="text-amber-300 font-bold">
                              {gameState.difficulty === 'easy' ? 'Medium' : 'Hard'}
                            </span>{' '}
                            difficulty — same subject and case count, tougher questions.
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={tryHarderDifficulty}
                          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 hover:border-amber-500/60 text-amber-300 font-black text-xs uppercase tracking-widest transition-all"
                        >
                          Try {gameState.difficulty === 'easy' ? 'Medium' : 'Hard'}
                          <ChevronRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goToSubjectSelect}
                    className="flex items-center justify-center gap-3 px-10 py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.12)] group uppercase tracking-widest text-sm"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    New Investigation
                  </motion.button>
                  <button
                    onClick={resetGame}
                    className="flex items-center justify-center gap-3 px-10 py-4 bg-white/6 hover:bg-white/12 border border-white/10 hover:border-white/20 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-sm"
                  >
                    Return to Start
                  </button>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* ── Footer ───────────────────────────────────── */}
        <footer className="mt-auto pt-10 pb-5 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/5">
          <div className="flex gap-5">
            {[
              { color: 'bg-green-500', label: 'Neural Link: ACTIVE' },
              { color: 'bg-violet-500', label: 'Encryption: HIGH' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={cn('w-1.5 h-1.5 rounded-full animate-pulse', color)} />
                <span className="text-[9px] text-slate-600 font-mono font-bold uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-slate-700 font-mono tracking-widest">
            V.7.0.0-STABLE // SCIENCE_INTEL_SYSTEMS_GLOBAL
          </p>
        </footer>
      </div>
    </div>
  );
}
