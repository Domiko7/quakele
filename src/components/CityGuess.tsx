import { useState } from "react";
import type { NearbyCity } from "../types";

interface Props {
  cities: NearbyCity[];
  maxGuesses?: number;
  onComplete: (guesses: string[], won: boolean) => void;
  onGuess?: (guesses: string[]) => void;
}

export const CityGuess = ({ cities, maxGuesses = 5, onComplete, onGuess }: Props) => {
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);

  const answer = cities[0];
  const remaining = maxGuesses - guesses.length;
  const won = guesses.some((g) => g.toLowerCase() === answer.name.toLowerCase());
  const lost = !won && remaining <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || won || lost) return;
    const newGuesses = [...guesses, trimmed];
    setGuesses(newGuesses);
    setInput("");
    onGuess?.(newGuesses);
    const correct = trimmed.toLowerCase() === answer.name.toLowerCase();
    if (correct) onComplete(newGuesses, true);
    else if (newGuesses.length >= maxGuesses) onComplete(newGuesses, false);
  };

  return (
    <div className="section-card">
      <p className="section-label">City</p>

      <form className="input-row" onSubmit={handleSubmit}>
        <input
          className="guess-input"
          list="city-options"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nearest major city…"
          disabled={won || lost}
          autoComplete="off"
        />
        <datalist id="city-options">
          {cities.map((c) => (
            <option key={c.name} value={c.name} />
          ))}
        </datalist>
        <button className="guess-btn" type="submit" disabled={won || lost}>
          Guess
        </button>
      </form>

      <p className="remaining">
        {remaining} guess{remaining !== 1 ? "es" : ""} remaining
      </p>

      <ul className="guess-list">
        {guesses.map((g, i) => {
          const correct = g.toLowerCase() === answer.name.toLowerCase();
          const match = cities.find((c) => c.name.toLowerCase() === g.toLowerCase());
          const hint = correct
            ? `${answer.distanceKm.toLocaleString()} km from epicenter`
            : match
              ? `${match.distanceKm.toLocaleString()} km — try closer`
              : "not in today's city list";
          return (
            <li key={i} className={`guess-item ${correct ? "correct" : "wrong"}`}>
              <span className="guess-name">{g}</span>
              <span className="guess-hint">{hint}</span>
            </li>
          );
        })}
      </ul>

      {won && (
        <div className="result-banner success">
          {answer.name}, {answer.country} — {answer.distanceKm.toLocaleString()} km from the epicenter
        </div>
      )}
      {lost && (
        <div className="result-banner failure">
          The nearest city was <strong>{answer.name}, {answer.country}</strong> ({answer.distanceKm.toLocaleString()} km)
        </div>
      )}
    </div>
  );
};
