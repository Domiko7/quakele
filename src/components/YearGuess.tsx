import { useState } from "react";

interface Props {
  answer: number;
  maxGuesses?: number;
  onComplete: (guesses: number[], won: boolean) => void;
}

export const YearGuess = ({ answer, maxGuesses = 5, onComplete }: Props) => {
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<number[]>([]);

  const remaining = maxGuesses - guesses.length;
  const won = guesses.includes(answer);
  const lost = !won && remaining <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(input, 10);
    if (!year || won || lost) return;
    const newGuesses = [...guesses, year];
    setGuesses(newGuesses);
    setInput("");
    const correct = year === answer;
    if (correct) onComplete(newGuesses, true);
    else if (newGuesses.length >= maxGuesses) onComplete(newGuesses, false);
  };

  return (
    <div className="section-card">
      <p className="section-label">Year</p>

      <form className="input-row" onSubmit={handleSubmit}>
        <input
          className="guess-input"
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 2010"
          min={1000}
          max={new Date().getUTCFullYear()}
          disabled={won || lost}
        />
        <button className="guess-btn" type="submit" disabled={won || lost}>
          Guess
        </button>
      </form>

      <p className="remaining">
        {remaining} guess{remaining !== 1 ? "es" : ""} remaining
      </p>

      <ul className="guess-list">
        {guesses.map((g, i) => {
          const diff = Math.abs(g - answer);
          const { label, cls } = (() => {
            if (diff === 0) return { label: "correct!", cls: "correct" };
            if (diff <= 3)  return { label: "scorching (1-3 yrs off)", cls: "temp-scorching" };
            if (diff <= 7)  return { label: "hot (4-7 yrs off)", cls: "temp-hot" };
            if (diff <= 15) return { label: "warm (8-15 yrs off)", cls: "temp-warm" };
            if (diff <= 25) return { label: "cold (16-25 yrs off)", cls: "temp-cold" };
            if (diff <= 40) return { label: "very cold (26-40 yrs off)", cls: "temp-very-cold" };
            return { label: "freezing (40+ yrs off)", cls: "temp-freezing" };
          })();
          return (
            <li key={i} className={`guess-item ${cls}`}>
              <span className="guess-name">{g}</span>
              <span className="guess-hint">{label}</span>
            </li>
          );
        })}
      </ul>

      {won && (
        <div className="result-banner success">
          Correct — the earthquake was in {answer}
        </div>
      )}
      {lost && (
        <div className="result-banner failure">
          The answer was <strong>{answer}</strong>
        </div>
      )}
    </div>
  );
};
