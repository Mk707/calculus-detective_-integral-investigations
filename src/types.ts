export type Difficulty = 'Beginner' | 'Intermediate' | 'Expert';

export type MathTopic = 'Derivative' | 'Integral' | 'Limit' | 'Differential Equation';

export interface MathProblem {
  formula: string;
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  topic: MathTopic;
}

export interface CrimeCase {
  id: string;
  title: string;
  description: string;
  location: string;
  evidenceType: string;
  problem: MathProblem;
  successStory: string;
  failureStory: string;
}

export interface GameState {
  currentCaseIndex: number;
  score: number;
  isGameOver: boolean;
  view: 'start' | 'investigation' | 'conclusion';
  selectedOption: string | null;
  isCorrect: boolean | null;
}
