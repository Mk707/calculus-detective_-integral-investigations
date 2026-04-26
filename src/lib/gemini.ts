import { GoogleGenAI } from '@google/genai';
import type { ActiveCase, Difficulty, Subject } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function isGeminiAvailable(): boolean {
  return Boolean(API_KEY);
}

const SUBJECT_CONTEXT: Record<Subject, string> = {
  calculus: 'calculus (derivatives, integrals, limits, differential equations)',
  biology: 'biology (cells, genetics, evolution, ecosystems)',
  'computer-science': 'computer science (binary numbers, logic gates, algorithms, programming)',
};

const DIFFICULTY_CONTEXT: Record<Difficulty, string> = {
  easy: 'beginner-level — all 4 cases should cover fundamental concepts only, use simple language, and avoid advanced calculations',
  medium: 'mixed — progress from beginner (case 1) to intermediate/advanced (case 4)',
  hard: 'advanced — all 4 cases should challenge with applied problems, edge cases, and complex reasoning',
};

export async function generateTopicCases(
  subject: Subject,
  topic: string,
  difficulty: Difficulty = 'medium',
  count: number = 4,
): Promise<ActiveCase[]> {
  if (!API_KEY) throw new Error('GEMINI_API_KEY is not set');

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const youtubeBase = `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' ' + subject + ' explained')}`;

  const prompt = `You are an educational game designer creating a detective-themed learning game about ${SUBJECT_CONTEXT[subject]}.

The player has chosen to study: "${topic}"
Difficulty level: ${DIFFICULTY_CONTEXT[difficulty]}

Generate exactly ${count} detective investigation cases about "${topic}" at the specified difficulty level.
Return ONLY a valid JSON object — no markdown fences, no extra text:

{
  "cases": [
    {
      "title": "creative detective case title",
      "description": "2-3 sentences describing the detective scenario and why ${topic} knowledge is needed",
      "location": "specific crime scene or location name",
      "evidenceType": "type of evidence being analyzed",
      "successStory": "1 sentence shown when the player answers correctly (detective narration)",
      "failureStory": "1 sentence shown when the player answers incorrectly (detective narration)",
      "question": "educational multiple-choice question about ${topic} (1-2 sentences)",
      "correctAnswer": "correct answer — must exactly match one of the four options",
      "options": ["option A", "option B", "option C", "option D"],
      "explanation": "1-2 sentence educational explanation of why the answer is correct",
      "hint": "1 sentence tip from the AI partner without giving away the answer, phrased as detective dialogue"
    }
  ]
}

Requirements:
- Exactly 4 cases in the array, each unique
- Case 1 = fundamental concept, Case 4 = applied or advanced concept
- Each correctAnswer must exactly match one of its four options
- All options must be plausible to a beginner
- Keep educational accuracy high`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const raw = (
    response.text ??
    response.candidates?.[0]?.content?.parts?.[0]?.text ??
    ''
  ).trim();

  if (!raw) throw new Error('Gemini returned an empty response');

  const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  const parsed = JSON.parse(json) as {
    cases: Array<{
      title: string;
      description: string;
      location: string;
      evidenceType: string;
      successStory: string;
      failureStory: string;
      question: string;
      correctAnswer: string;
      options: string[];
      explanation: string;
      hint: string;
    }>;
  };

  if (!Array.isArray(parsed.cases) || parsed.cases.length === 0) {
    throw new Error('Gemini response missing cases array');
  }

  const valid: ActiveCase[] = parsed.cases
    .filter(c =>
      typeof c.title === 'string' &&
      typeof c.question === 'string' &&
      typeof c.correctAnswer === 'string' &&
      Array.isArray(c.options) &&
      c.options.length >= 2 &&
      c.options.includes(c.correctAnswer),
    )
    .slice(0, count)
    .map((c, i) => ({
      id: String(i + 1),
      title: c.title,
      description: c.description,
      location: c.location,
      evidenceType: c.evidenceType,
      successStory: c.successStory,
      failureStory: c.failureStory,
      hint: c.hint,
      problem: {
        type: 'multiple-choice' as const,
        question: c.question,
        correctAnswer: c.correctAnswer,
        options: c.options,
        explanation: c.explanation,
        topic,
        youtubeUrl: youtubeBase,
      },
    }));

  if (valid.length === 0) throw new Error('No valid cases passed validation');

  return valid;
}
