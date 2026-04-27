<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# STEMtective

**A detective-themed STEM learning game powered by Gemini AI**

</div>

Solve crimes by answering STEM questions. Each case drops you into a detective scenario — a diamond heist, a cyber breach, a biology lab incident — where the only way to crack it is to apply real math, biology, or CS concepts. Answer correctly to close the case; get it wrong and the perp walks.

## Subjects

| Subject | Topics |
|---|---|
| **Calculus** | Derivatives · Integrals · Limits · Differential Equations |
| **Biology** | Cell Biology · Genetics · Evolution · Ecosystems |
| **Computer Science** | Binary · Logic Gates · Algorithms · Data Structures |

## Features

- **Detective narrative** — every question is a crime scene; answers drive the story forward
- **Three difficulty levels** — Easy (fundamentals), Medium (progressive), Hard (applied/advanced)
- **Custom AI topics** — enter any topic and Gemini 2.5 Flash generates a fresh set of cases on the fly
- **Question formats** — multiple-choice with LaTeX-rendered formulas, plus code-fill challenges
- **YouTube links** — every question links to relevant learning resources
- **Best score tracking** — personal bests saved per subject/difficulty in localStorage
- **Firebase auth** — sign in to persist progress
- **Animated UI** — custom crosshair cursor, floating shapes, confetti on correct answers, sound effects

## Tech Stack

- **React 18 + TypeScript** via Vite
- **Tailwind CSS** for styling
- **Framer Motion** (`motion/react`) for animations
- **KaTeX** (`react-katex`) for math rendering
- **Gemini 2.5 Flash** (`@google/genai`) for AI-generated cases
- **Firebase** (Auth + Firestore)
- **canvas-confetti** for celebration effects

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   > The app runs without a Gemini key — AI-generated topics are disabled but all built-in cases work normally.

3. Start the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/       # Detective, FloatingShapes UI components
├── data/             # Static question banks (calculus, biology, CS)
├── firebase/         # Auth and Firestore config
├── lib/              # Gemini AI, sound, utility helpers
├── types.ts          # Shared TypeScript types
└── App.tsx           # Main game logic and all views
```
