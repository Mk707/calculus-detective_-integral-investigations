import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DetectiveProps {
  position?: 'left' | 'right' | 'center';
  searching?: boolean;
  colorScheme?: 'cyan' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
}

const quotes = [
  'Analyze the evidence!',
  'Think logically!',
  'Eureka!',
  'Crack the case!',
  'Stay curious!',
  'Math is key!',
  'Follow the data!',
  'Debug the clues!',
  'The answer is near!',
  'Trust the science!',
];

const colorThemes = {
  cyan:   { head: 'bg-cyan-300',   headBorder: 'border-cyan-600',   hat: 'bg-cyan-700',   hatBrim: 'bg-cyan-600',   pocket: 'bg-cyan-500',   glow: 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' },
  green:  { head: 'bg-green-300',  headBorder: 'border-green-600',  hat: 'bg-green-700',  hatBrim: 'bg-green-600',  pocket: 'bg-green-500',  glow: 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]' },
  yellow: { head: 'bg-yellow-300', headBorder: 'border-yellow-600', hat: 'bg-yellow-700', hatBrim: 'bg-yellow-600', pocket: 'bg-yellow-500', glow: 'text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]' },
  red:    { head: 'bg-red-300',    headBorder: 'border-red-600',    hat: 'bg-red-700',    hatBrim: 'bg-red-600',    pocket: 'bg-red-500',    glow: 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' },
  purple: { head: 'bg-purple-300', headBorder: 'border-purple-600', hat: 'bg-purple-700', hatBrim: 'bg-purple-600', pocket: 'bg-purple-500', glow: 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]' },
  orange: { head: 'bg-orange-300', headBorder: 'border-orange-600', hat: 'bg-orange-700', hatBrim: 'bg-orange-600', pocket: 'bg-orange-500', glow: 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' },
};

export function Detective({ position = 'left', searching = false, colorScheme = 'cyan' }: DetectiveProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [colorScheme]);

  const positions = {
    left: 'left-6',
    right: 'right-6',
    center: 'left-1/2 -translate-x-1/2',
  };

  const theme = colorThemes[colorScheme];

  return (
    <motion.div
      key={colorScheme}
      className={`fixed bottom-6 ${positions[position]} z-50 hidden lg:block pointer-events-none`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: [0, -8, 0], opacity: 1 }}
      transition={{
        y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        opacity: { duration: 0.5 },
      }}
    >
      <div className="relative">
        {/* Speech bubble */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white rounded-lg px-3 py-2 shadow-lg whitespace-nowrap"
          >
            <div className="text-xs font-bold text-gray-800">{quote}</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
          </motion.div>
        )}

        {/* Character */}
        <div className="w-20 h-28 relative">
          {/* Head */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 ${theme.head} rounded-full border-4 ${theme.headBorder}`}>
            {/* Graduation cap */}
            <div className={`absolute -top-7 left-1/2 -translate-x-1/2 w-18 h-2 ${theme.hat} rounded-sm`} style={{ width: '4.5rem' }} />
            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-9 h-4 ${theme.hatBrim} rounded-t-sm`} />
            {/* Tassel */}
            <div className="absolute -top-7 right-1 w-0.5 h-5 bg-yellow-400" />
            <div className="absolute -top-3 right-0 w-2 h-2 bg-yellow-400 rounded-full" />
            {/* Glasses */}
            <div className="absolute top-4 left-1.5 w-4 h-4 border-2 border-gray-900 rounded-full bg-white/80" />
            <div className="absolute top-4 right-1.5 w-4 h-4 border-2 border-gray-900 rounded-full bg-white/80" />
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-900" />
            {/* Smile */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-2.5 border-b-2 border-gray-900 rounded-full" />
          </div>

          {/* Body */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-18 h-12 bg-gray-100 rounded-b-lg border-4 border-gray-300" style={{ width: '4.5rem' }}>
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-9 bg-gray-400" />
            {/* Python logo */}
            <div className="absolute top-1.5 right-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C10.8 2 9.8 2.3 9 2.8C8.2 3.3 7.5 4 7 4.9V7H10V8H6C5.5 8 5 8.2 4.6 8.6C4.2 9 4 9.5 4 10V14C4 14.5 4.2 15 4.6 15.4C5 15.8 5.5 16 6 16H8V13C8 12.4 8.2 11.9 8.6 11.5C9 11.1 9.5 10.9 10 10.9H14C14.5 10.9 15 10.7 15.4 10.3C15.8 9.9 16 9.4 16 8.9V5C16 4.4 15.8 3.9 15.4 3.5C15 3.1 14.5 2.9 14 2.9L12 2Z" fill="#3776AB"/>
                <circle cx="9" cy="5" r="1" fill="white"/>
                <path d="M12 22C13.2 22 14.2 21.7 15 21.2C15.8 20.7 16.5 20 17 19.1V17H14V16H18C18.5 16 19 15.8 19.4 15.4C19.8 15 20 14.5 20 14V10C20 9.5 19.8 9 19.4 8.6C19 8.2 18.5 8 18 8H16V11C16 11.6 15.8 12.1 15.4 12.5C15 12.9 14.5 13.1 14 13.1H10C9.5 13.1 9 13.3 8.6 13.7C8.2 14.1 8 14.6 8 15.1V19C8 19.6 8.2 20.1 8.6 20.5C9 20.9 9.5 21.1 10 21.1L12 22Z" fill="#FFD43B"/>
                <circle cx="15" cy="19" r="1" fill="white"/>
              </svg>
            </div>
            {/* Pocket protector */}
            <div className={`absolute top-1.5 left-1.5 w-3 h-5 ${theme.pocket} rounded-sm`} />
          </div>

          {/* Legs */}
          <div className="absolute bottom-0 left-1/3 w-2.5 h-5 bg-gray-600 rounded-b" />
          <div className="absolute bottom-0 right-1/3 w-2.5 h-5 bg-gray-600 rounded-b" />
        </div>

        {/* Magnifying glass */}
        {searching && (
          <motion.div
            className="absolute -right-3 top-10"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Search className={`w-7 h-7 ${theme.glow}`} strokeWidth={3} />
          </motion.div>
        )}

        {/* Floating clue indicators */}
        {searching && (
          <>
            <motion.div
              className={`absolute -top-3 -left-2 ${theme.glow.split(' ')[0]} text-lg font-black`}
              animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >?</motion.div>
            <motion.div
              className="absolute -top-1 right-0 text-purple-400 text-base font-black"
              animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >!</motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
