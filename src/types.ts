export type Subject = 'calculus' | 'biology' | 'computer-science';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuestionVariant {
  type?: 'multiple-choice' | 'code-fill';
  formula?: string;
  codeTemplate?: string;
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  topic: string;
  youtubeUrl: string;
}

export interface CaseLevel {
  id: string;
  title: string;
  description: string;
  location: string;
  evidenceType: string;
  successStory: string;
  failureStory: string;
  questions: QuestionVariant[];
}

export interface SubjectBank {
  subject: Subject;
  subjectTitle: string;
  subjectTagline: string;
  levels: CaseLevel[];
}

export interface ActiveCase {
  id: string;
  title: string;
  description: string;
  location: string;
  evidenceType: string;
  problem: QuestionVariant;
  successStory: string;
  failureStory: string;
  hint?: string;
}

export interface CaseResult {
  title: string;
  topic: string;
  correct: boolean;
}

export interface GameState {
  subject: Subject | null;
  userTopic: string | null;
  activeCases: ActiveCase[];
  currentCaseIndex: number;
  score: number;
  isGameOver: boolean;
  view: 'start' | 'subject-select' | 'difficulty-select' | 'topic-input' | 'loading' | 'investigation' | 'conclusion';
  difficulty: Difficulty | null;
  selectedOption: string | null;
  isCorrect: boolean | null;
  codeInput: string;
  caseResults: CaseResult[];
}
