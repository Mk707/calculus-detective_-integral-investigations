import { motion } from 'motion/react';

interface FloatingShapesProps {
  colorScheme?: 'cyan' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  subject?: 'calculus' | 'biology' | 'computer-science' | null;
}

const colorSchemes = {
  cyan:   ['text-cyan-400',   'text-cyan-500',   'text-blue-400',    'text-cyan-300',   'text-blue-500'],
  green:  ['text-green-400',  'text-green-500',  'text-emerald-400', 'text-green-300',  'text-emerald-500'],
  yellow: ['text-yellow-400', 'text-yellow-500', 'text-amber-400',   'text-yellow-300', 'text-amber-500'],
  red:    ['text-red-400',    'text-red-500',    'text-rose-400',    'text-red-300',    'text-rose-500'],
  purple: ['text-purple-400', 'text-purple-500', 'text-violet-400',  'text-purple-300', 'text-violet-500'],
  orange: ['text-orange-400', 'text-orange-500', 'text-amber-400',   'text-orange-300', 'text-amber-500'],
};

type ShapeSize = 'xl' | 'lg' | 'md' | 'sm';

// These classes must be explicit strings so Tailwind's scanner includes them
const TEXT_SIZES: Record<ShapeSize, string> = {
  xl: 'text-6xl font-black',
  lg: 'text-4xl font-black',
  md: 'text-2xl font-bold',
  sm: 'text-lg font-semibold',
};

const OPACITY: Record<string, string> = {
  high:   'opacity-[0.28]',
  mid:    'opacity-[0.20]',
  low:    'opacity-[0.14]',
};

interface Shape {
  type: 'dna' | 'atom' | 'math' | 'code' | 'num';
  content: string;
  delay: number;
  x: string;
  duration: number;
  size: ShapeSize;
  spin?: boolean;
  op?: 'high' | 'mid' | 'low';
}

const shapes: Shape[] = [
  // ── DNA helixes (no spin — looks wrong when rotating) ───────────
  { type: 'dna',  content: '', delay: 0,   x: '5%',  duration: 14, size: 'lg', op: 'high' },
  { type: 'dna',  content: '', delay: 3.5, x: '44%', duration: 17, size: 'xl', op: 'mid'  },
  { type: 'dna',  content: '', delay: 6.5, x: '82%', duration: 13, size: 'lg', op: 'mid'  },
  { type: 'dna',  content: '', delay: 1.5, x: '63%', duration: 15, size: 'md', op: 'low'  },

  // ── Atoms ────────────────────────────────────────────────────────
  { type: 'atom', content: '', delay: 1,   x: '72%', duration: 14, size: 'lg', spin: true, op: 'mid'  },
  { type: 'atom', content: '', delay: 5,   x: '22%', duration: 12, size: 'md', spin: true, op: 'low'  },
  { type: 'atom', content: '', delay: 3,   x: '90%', duration: 16, size: 'sm', spin: true, op: 'low'  },

  // ── Math — large ─────────────────────────────────────────────────
  { type: 'math', content: '∫',  delay: 0.5, x: '16%', duration: 10, size: 'xl', spin: true, op: 'high' },
  { type: 'math', content: '∑',  delay: 2.5, x: '57%', duration: 12, size: 'xl', spin: true, op: 'mid'  },
  { type: 'math', content: 'π',  delay: 4.5, x: '29%', duration: 11, size: 'xl', spin: true, op: 'high' },
  { type: 'math', content: 'Δ',  delay: 1,   x: '79%', duration: 13, size: 'xl', spin: true, op: 'mid'  },
  { type: 'math', content: '∂',  delay: 6,   x: '93%', duration: 10, size: 'xl', spin: true, op: 'high' },

  // ── Math — medium ────────────────────────────────────────────────
  { type: 'math', content: '∇',  delay: 3,   x: '51%', duration: 9,  size: 'md', spin: true, op: 'mid'  },
  { type: 'math', content: '±',  delay: 0.8, x: '37%', duration: 10, size: 'md', spin: true, op: 'high' },
  { type: 'math', content: '∞',  delay: 2,   x: '65%', duration: 11, size: 'md', spin: true, op: 'mid'  },
  { type: 'math', content: '√',  delay: 5,   x: '84%', duration: 12, size: 'md', spin: true, op: 'mid'  },

  // ── Math — small ─────────────────────────────────────────────────
  { type: 'math', content: 'θ',  delay: 4,   x: '11%', duration: 8,  size: 'sm', spin: true, op: 'low'  },
  { type: 'math', content: 'λ',  delay: 2.8, x: '48%', duration: 9,  size: 'sm', spin: true, op: 'low'  },
  { type: 'math', content: '≠',  delay: 5.5, x: '26%', duration: 8,  size: 'sm', spin: true, op: 'low'  },
  { type: 'math', content: '∈',  delay: 1.5, x: '74%', duration: 10, size: 'sm', spin: true, op: 'low'  },
  { type: 'math', content: 'α',  delay: 3.5, x: '40%', duration: 9,  size: 'sm', spin: true, op: 'low'  },

  // ── Code — medium ────────────────────────────────────────────────
  { type: 'code', content: 'if',   delay: 0.3, x: '41%', duration: 8,  size: 'md', spin: true, op: 'high' },
  { type: 'code', content: '=>',   delay: 2,   x: '69%', duration: 9,  size: 'md', spin: true, op: 'mid'  },
  { type: 'code', content: '{}',   delay: 4,   x: '4%',  duration: 11, size: 'lg', spin: true, op: 'high' },
  { type: 'code', content: '</>',  delay: 5.5, x: '47%', duration: 11, size: 'lg', spin: true, op: 'mid'  },
  { type: 'code', content: '( )',  delay: 1.2, x: '13%', duration: 9,  size: 'md', spin: true, op: 'mid'  },

  // ── Code — small ─────────────────────────────────────────────────
  { type: 'code', content: '[]',   delay: 1.8, x: '55%', duration: 8,  size: 'sm', spin: true, op: 'low'  },
  { type: 'code', content: 'fn()', delay: 3.8, x: '34%', duration: 9,  size: 'sm', spin: true, op: 'low'  },
  { type: 'code', content: '===',  delay: 0.6, x: '88%', duration: 7,  size: 'sm', spin: true, op: 'low'  },
  { type: 'code', content: '&&',   delay: 2.5, x: '19%', duration: 8,  size: 'sm', spin: true, op: 'low'  },
  { type: 'code', content: 'def',  delay: 4.5, x: '76%', duration: 9,  size: 'sm', spin: true, op: 'low'  },
  { type: 'code', content: '//',   delay: 1,   x: '96%', duration: 10, size: 'sm', spin: true, op: 'low'  },
  { type: 'code', content: '||',   delay: 6,   x: '28%', duration: 9,  size: 'sm', spin: true, op: 'low'  },
  { type: 'code', content: '++',   delay: 3,   x: '61%', duration: 8,  size: 'sm', spin: true, op: 'low'  },

  // ── Numbers / binary ─────────────────────────────────────────────
  { type: 'num', content: '0',  delay: 0.2, x: '32%', duration: 9,  size: 'lg', spin: true, op: 'mid'  },
  { type: 'num', content: '1',  delay: 1.6, x: '53%', duration: 12, size: 'md', spin: true, op: 'low'  },
  { type: 'num', content: '42', delay: 3.2, x: '78%', duration: 8,  size: 'sm', spin: true, op: 'low'  },
  { type: 'num', content: '7',  delay: 5,   x: '8%',  duration: 11, size: 'md', spin: true, op: 'mid'  },
  { type: 'num', content: '10', delay: 2.2, x: '39%', duration: 9,  size: 'sm', spin: true, op: 'low'  },
];

// ── SVG renderers ─────────────────────────────────────────────────────

function DnaHelix({ size }: { size: ShapeSize }) {
  const dims: Record<ShapeSize, [number, number]> = {
    xl: [64, 92], lg: [46, 66], md: [34, 48], sm: [24, 36],
  };
  const [w, h] = dims[size];
  const vw = w * 1.3;
  const vh = h * 1.15;
  const cx = vw / 2;
  const lx = cx - w * 0.27;
  const rx = cx + w * 0.27;
  const sw = w * 0.055;
  const rungs = 6;
  const stepH = vh / (rungs + 1);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${vw} ${vh}`} fill="none">
      <path
        d={`M${lx} ${stepH * 0.4} Q${cx - w * 0.4} ${stepH * 2} ${lx} ${stepH * 3.5} Q${cx - w * 0.4} ${stepH * 5} ${lx} ${stepH * 6.5}`}
        stroke="currentColor" strokeWidth={sw} fill="none"
      />
      <path
        d={`M${rx} ${stepH * 0.4} Q${cx + w * 0.4} ${stepH * 2} ${rx} ${stepH * 3.5} Q${cx + w * 0.4} ${stepH * 5} ${rx} ${stepH * 6.5}`}
        stroke="currentColor" strokeWidth={sw} fill="none"
      />
      {Array.from({ length: rungs }, (_, k) => (
        <line key={k} x1={lx} y1={stepH * (k + 1)} x2={rx} y2={stepH * (k + 1)}
          stroke="currentColor" strokeWidth={sw * 0.72} opacity="0.55" />
      ))}
    </svg>
  );
}

function AtomIcon({ size }: { size: ShapeSize }) {
  const s: Record<ShapeSize, number> = { xl: 72, lg: 54, md: 40, sm: 28 };
  const d = s[size];
  const c = d / 2;
  const r = d * 0.39;
  const ri = d * 0.17;
  const dot = d * 0.085;
  const sw = d * 0.042;
  return (
    <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} fill="none">
      <circle cx={c} cy={c} r={d * 0.09} fill="currentColor" />
      <ellipse cx={c} cy={c} rx={r} ry={ri} stroke="currentColor" strokeWidth={sw} fill="none" />
      <ellipse cx={c} cy={c} rx={ri} ry={r} stroke="currentColor" strokeWidth={sw} fill="none" />
      <ellipse cx={c} cy={c} rx={r * 0.76} ry={r * 0.76} stroke="currentColor" strokeWidth={sw} fill="none" />
      <circle cx={c + r} cy={c} r={dot} fill="currentColor" />
      <circle cx={c} cy={c - r} r={dot} fill="currentColor" />
      <circle cx={c - r} cy={c} r={dot} fill="currentColor" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────

const MATH_SYMBOLS_BY_SHAPE_INDEX: Record<number, string> = {
  7: '\u222b',
  8: '\u2211',
  9: '\u03c0',
  10: '\u0394',
  11: '\u2202',
  12: '\u2207',
  13: '\u00b1',
  14: '\u221e',
  15: '\u221a',
  16: '\u03b8',
  17: '\u03bb',
  18: '\u2260',
  19: '\u2208',
  20: '\u03b1',
};

function shouldShowShape(
  subject: FloatingShapesProps['subject'],
  type: Shape['type'],
) {
  if (!subject) return true;
  if (subject === 'calculus') return type === 'math' || type === 'num';
  if (subject === 'biology') return type === 'dna' || type === 'atom';
  return type === 'code' || type === 'num';
}

export function FloatingShapes({ colorScheme = 'cyan', subject = null }: FloatingShapesProps) {
  const colors = colorSchemes[colorScheme];
  const visibleShapes = shapes
    .map((shape, index) => ({ shape, index }))
    .filter(({ shape }) => shouldShowShape(subject, shape.type));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {visibleShapes.map(({ shape, index }, i) => {
        const colorClass = colors[i % colors.length];
        const opacityClass = OPACITY[shape.op ?? 'mid'];
        const displayedContent = shape.type === 'math'
          ? MATH_SYMBOLS_BY_SHAPE_INDEX[index] ?? shape.content
          : shape.content;

        // Build animate and transition separately — avoids the [0,0]/empty-object bug
        const animateObj = shape.spin
          ? { y: '108vh', rotate: 360, scale: [1, 1.14, 1] }
          : { y: '108vh', scale: [1, 1.14, 1] };

        const transitionObj = shape.spin
          ? {
              y:      { duration: shape.duration, repeat: Infinity, ease: 'linear' as const, delay: shape.delay },
              rotate: { duration: shape.duration * 0.8, repeat: Infinity, ease: 'linear' as const, delay: shape.delay },
              scale:  { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
            }
          : {
              y:     { duration: shape.duration, repeat: Infinity, ease: 'linear' as const, delay: shape.delay },
              scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
            };

        return (
          <motion.div
            key={`${colorScheme}-${subject ?? 'all'}-${index}`}
            className={`absolute ${colorClass} ${opacityClass}`}
            style={{ left: shape.x }}
            initial={{ y: '-8vh', rotate: 0, scale: 1 }}
            animate={animateObj}
            transition={transitionObj}
          >
            {shape.type === 'dna'  && <DnaHelix size={shape.size} />}
            {shape.type === 'atom' && <AtomIcon size={shape.size} />}
            {(shape.type === 'math' || shape.type === 'code' || shape.type === 'num') && (
              <div className={`${TEXT_SIZES[shape.size]} drop-shadow-[0_0_16px_currentColor]`}>{displayedContent}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
