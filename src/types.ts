export type Subject = 'calculus' | 'biology' | 'computer-science';

export interface QuestionVariant {
  formula?: string;
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
}

export interface GameState {
  subject: Subject | null;
  activeCases: ActiveCase[];
  currentCaseIndex: number;
  score: number;
  isGameOver: boolean;
  view: 'start' | 'subject-select' | 'investigation' | 'conclusion';
  selectedOption: string | null;
  isCorrect: boolean | null;
}
