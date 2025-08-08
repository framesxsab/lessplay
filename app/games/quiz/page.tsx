import React, { useState } from 'react';

const questions = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'London', 'Paris', 'Madrid'],
    answer: 2,
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    answer: 1,
  },
  {
    question: 'Who wrote Hamlet?',
    options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'],
    answer: 1,
  },
];

export default function QuizGame() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptionClick = (idx: number) => {
    try {
      if (showResult) return;
      if (idx === questions[current].answer) {
        setScore(score + 1);
      }
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setShowResult(true);
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz Game</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {showResult ? (
        <div className="text-center">
          <p className="mb-4">Your score: {score} / {questions.length}</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleRestart}>
            Restart
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4 font-medium">{questions[current].question}</p>
          <div className="grid gap-2">
            {questions[current].options.map((opt, idx) => (
              <button
                key={idx}
                className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-blue-200 dark:bg-gray-700 dark:hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => handleOptionClick(idx)}
                aria-label={`Answer option ${opt}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
