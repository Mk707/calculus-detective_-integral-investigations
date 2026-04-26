import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type MascotState = 'idle' | 'thinking' | 'correct' | 'wrong';

interface DetectiveMascotProps {
  state: MascotState;
}

const lines: Record<MascotState, string[]> = {
  idle: [
    '"Another case. Another variable to isolate."',
    '"The city runs on derivatives. So do I."',
    '"I\'ve seen things you wouldn\'t believe. Integrals, mostly."',
  ],
  thinking: [
    '"Hmm. The slope at this point suggests..."',
    '"Give me a moment. I\'m reading the trail."',
    '"The rate of change doesn\'t lie."',
  ],
  correct: [
    '"Heh. Knew it. The derivative never lies."',
    '"Suspect apprehended. Clean work, detxective."',
    '"That\'s what calculus does. Cuts right through the noise."',
  ],
  wrong: [
    '"...That was embarrassing. For you."',
    '"The suspect got away. Because of that answer."',
    '"I\'ve seen rookies do better. Actually, no I haven\'t."',
  ],
};

const brows: Record<MascotState, { left: string; right: string }> = {
  idle:     { left: 'M37 36 Q41 34 45 36', right: 'M55 36 Q59 34 63 36' },
  thinking: { left: 'M37 35 Q41 37 45 35', right: 'M55 35 Q59 37 63 35' },
  correct:  { left: 'M37 37 Q41 35 45 37', right: 'M55 37 Q59 35 63 37' },
  wrong:    { left: 'M37 38 Q41 35 45 38', right: 'M55 38 Q59 35 63 38' },
};

const mouths: Record<MascotState, string> = {
  idle:     'M44 52 Q50 55 56 52',
  thinking: 'M45 53 Q50 53 55 53',
  correct:  'M43 52 Q50 58 57 52',
  wrong:    'M44 56 Q50 52 56 56',
};

const bodyAnimations: Record<MascotState, string> = {
  idle:     'animate-[idle-bob_2.5s_ease-in-out_infinite]',
  thinking: 'animate-[thinking-tilt_1.8s_ease-in-out_infinite]',
  correct:  'animate-[correct-jump_0.6s_ease-out_forwards]',
  wrong:    'animate-[wrong-shake_0.5s_ease-in-out_forwards]',
};

export default function DetectiveMascot({ state }: DetectiveMascotProps) {
  const [line, setLine] = useState(lines[state][0]);
  const [visible, setVisible] = useState(true);
  const [animKey, setAnimKey] = useState(0);

  // Rotate dialogue lines
  useEffect(() => {
    const stateLines = lines[state];
    let idx = 0;
    setLine(stateLines[idx]);
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        idx = (idx + 1) % stateLines.length;
        setLine(stateLines[idx]);
        setVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [state]);

  // Re-trigger body animation on state change
  useEffect(() => {
    setAnimKey(k => k + 1);
  }, [state]);

  return (
<div className="w-[180px] flex-shrink-0">      

      {/* Body */}
      <div className="flex flex-col items-center gap-3 p-3 min-h-[200px] justify-center">
  <AnimatePresence mode="wait">
    {visible && (
      <motion.div
        key={line}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
        className="bg-[#1a1a18] border border-[#2C2C2A] rounded-[10px] rounded-br-sm px-3 py-2 text-[10px] text-[#B4B2A9] leading-relaxed text-center w-full"
      >
        {line}
      </motion.div>
    )}
  </AnimatePresence>
  <div className="relative w-[100px] h-[120px]">
          <style>{`
            @keyframes idle-bob {
              0%,100%{transform:translateY(0px);}
              50%{transform:translateY(-3px);}
            }
            @keyframes correct-jump {
              0%{transform:translateY(0) rotate(0deg);}
              25%{transform:translateY(-14px) rotate(-5deg);}
              50%{transform:translateY(-18px) rotate(5deg);}
              75%{transform:translateY(-8px) rotate(-3deg);}
              100%{transform:translateY(0) rotate(0deg);}
            }
            @keyframes wrong-shake {
              0%,100%{transform:translateX(0) rotate(0deg);}
              20%{transform:translateX(-6px) rotate(-4deg);}
              40%{transform:translateX(6px) rotate(4deg);}
              60%{transform:translateX(-5px) rotate(-3deg);}
              80%{transform:translateX(5px) rotate(3deg);}
            }
            @keyframes thinking-tilt {
              0%,100%{transform:rotate(0deg);}
              33%{transform:rotate(-6deg);}
              66%{transform:rotate(4deg);}
            }
            @keyframes det-blink {
              0%,90%,100%{transform:scaleY(1);}
              95%{transform:scaleY(0.05);}
            }
            @keyframes magnify-pulse {
              0%,100%{transform:scale(1);}
              50%{transform:scale(1.15);}
            }
            @keyframes smoke-rise {
              0%{opacity:0.6;transform:translateY(0) scaleX(1);}
              100%{opacity:0;transform:translateY(-12px) scaleX(1.4);}
            }
            .det-blink { animation: det-blink 4s ease-in-out infinite; transform-origin: center; }
            .det-magnifier-idle { transform-origin: 78px 88px; animation: magnify-pulse 2.5s ease-in-out infinite; }
            .det-magnifier-thinking { transform-origin: 78px 88px; animation: magnify-pulse 0.8s ease-in-out infinite; }
            .smoke1 { animation: smoke-rise 1.5s ease-out infinite; }
            .smoke2 { animation: smoke-rise 1.5s ease-out 0.5s infinite; }
            .smoke3 { animation: smoke-rise 1.5s ease-out 1s infinite; }
          `}</style>

          <svg
            key={animKey}
            viewBox="0 0 100 120"
            width="100"
            height="120"
            style={{ overflow: 'visible' }}
          >
            <g style={{
              animation: state === 'idle'     ? 'idle-bob 2.5s ease-in-out infinite'
                        : state === 'thinking' ? 'thinking-tilt 1.8s ease-in-out infinite'
                        : state === 'correct'  ? 'correct-jump 0.6s ease-out forwards'
                        : 'wrong-shake 0.5s ease-in-out forwards'
            }}>
              {/* Shadow */}
              <ellipse cx="50" cy="118" rx="22" ry="4" fill="#000" opacity="0.3" />
              {/* Coat */}
              <path d="M22 75 Q20 110 18 118 L82 118 Q80 110 78 75 Z" fill="#2C2C2A" />
              <path d="M38 75 L50 90 L62 75 L58 68 L50 74 L42 68 Z" fill="#1a1a18" />
              <path d="M35 65 L42 68 L50 74 L58 68 L65 65 L60 58 L50 62 L40 58 Z" fill="#2C2C2A" />
              <rect x="22" y="88" width="56" height="4" rx="2" fill="#1a1a18" />
              <rect x="46" y="86" width="8" height="8" rx="1" fill="#444441" />
              {/* Neck */}
              <rect x="44" y="52" width="12" height="10" rx="3" fill="#B4B2A9" />
              {/* Head */}
              <rect x="30" y="28" width="40" height="34" rx="10" fill="#C8C6BC" />
              {/* Hat */}
              <rect x="24" y="30" width="52" height="5" rx="2" fill="#1a1a18" />
              <rect x="32" y="8" width="36" height="25" rx="6" fill="#2C2C2A" />
              <rect x="32" y="28" width="36" height="4" rx="1" fill="#444441" />
              <rect x="35" y="10" width="8" height="18" rx="3" fill="#3a3a38" opacity="0.5" />
              {/* Eyes */}
              <g className="det-blink" style={state === 'correct' ? { transform: 'scaleY(0.3)', transformOrigin: 'center' } : {}}>
                <ellipse cx="41" cy="42" rx="4" ry="4.5" fill="#1a1a18" />
                <ellipse cx="42.5" cy="40.5" rx="1.2" ry="1.2" fill="#fff" opacity="0.6" />
                <ellipse cx="59" cy="42" rx="4" ry="4.5" fill="#1a1a18" />
                <ellipse cx="60.5" cy="40.5" rx="1.2" ry="1.2" fill="#fff" opacity="0.6" />
              </g>
              {/* Brows */}
              <path d={brows[state].left} stroke="#1a1a18" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d={brows[state].right} stroke="#1a1a18" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              {/* Mouth */}
              <path d={mouths[state]} stroke="#888780" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              {/* Cigarette */}
              <rect x="56" y="53" width="14" height="2.5" rx="1.2" fill="#D3D1C7" />
              <rect x="67" y="52.5" width="4" height="3.5" rx="0.5" fill="#E24B4A" opacity="0.7" />
              <ellipse className="smoke1" cx="72" cy="51" rx="1.5" ry="2" fill="#888780" />
              <ellipse className="smoke2" cx="71" cy="50" rx="1.2" ry="1.8" fill="#888780" />
              <ellipse className="smoke3" cx="73" cy="51" rx="1" ry="1.5" fill="#888780" />
              {/* Magnifier */}
              <g className={state === 'idle' || state === 'correct' ? 'det-magnifier-idle' : 'det-magnifier-thinking'}>
                <circle cx="78" cy="88" r="10" fill="none" stroke="#888780" strokeWidth="2" />
                <circle cx="78" cy="88" r="7" fill="#1a3a4a" opacity="0.4" />
                <line x1="85" y1="95" x2="92" y2="104" stroke="#888780" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M73 83 Q75 81 78 82" stroke="#B4B2A9" strokeWidth="1" fill="none" opacity="0.5" />
              </g>
              {/* Arms */}
              <path d="M22 78 Q10 90 12 100" stroke="#2C2C2A" strokeWidth="8" fill="none" strokeLinecap="round" />
              <path d="M78 78 Q90 88 88 100" stroke="#2C2C2A" strokeWidth="8" fill="none" strokeLinecap="round" />
              <circle cx="12" cy="101" r="5" fill="#B4B2A9" />
              <circle cx="88" cy="101" r="5" fill="#B4B2A9" />
            </g>
          </svg>
        </div>

        {/* Speech bubble */}
        
      </div>
    </div>
  );
}
