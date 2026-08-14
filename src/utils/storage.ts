import { getPuzzleNumber } from "./seed";
import type { GamePhase } from "../types";

interface PhaseResult<T> {
  guesses: T[];
  won: boolean;
}

export interface SavedState {
  puzzleNumber: number;
  phase: GamePhase;
  cityGuesses: string[];
  cityResult: PhaseResult<string> | null;
  yearGuesses: number[];
  yearResult: PhaseResult<number> | null;
}

export interface PlayerStats {
  currentStreak: number;
  longestStreak: number;
  completedPuzzleNumbers: number[];
  attemptedPuzzleNumbers: number[];
}

const GAME_STATE_KEY = "state";
const PLAYER_STATS_KEY = "stats";

const createDefaultPlayerStats = (): PlayerStats => ({
  currentStreak: 0,
  longestStreak: 0,
  completedPuzzleNumbers: [],
  attemptedPuzzleNumbers: [],
});

export const loadGameState = (): SavedState | null => {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return null;
    const saved: SavedState = JSON.parse(raw);
    if (saved.puzzleNumber !== getPuzzleNumber()) return null;
    return saved;
  } catch {
    return null;
  }
};

export const saveGameState = (state: Omit<SavedState, "puzzleNumber">) => {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify({ ...state, puzzleNumber: getPuzzleNumber() }));
  } catch {}
};

export const loadPlayerStats = (): PlayerStats => {
  try {
    const raw = localStorage.getItem(PLAYER_STATS_KEY);
    if (!raw) return createDefaultPlayerStats();
    const saved = JSON.parse(raw) as Partial<PlayerStats>;
    return {
      currentStreak: saved.currentStreak ?? 0,
      longestStreak: saved.longestStreak ?? 0,
      completedPuzzleNumbers: saved.completedPuzzleNumbers ?? [],
      attemptedPuzzleNumbers: saved.attemptedPuzzleNumbers ?? [],
    };
  } catch {
    return createDefaultPlayerStats();
  }
};

export const savePlayerStats = (stats: PlayerStats) => {
  try {
    localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(stats));
  } catch {}
};

export const recordDailyResult = (won: boolean): PlayerStats => {
  const puzzleNumber = getPuzzleNumber();
  const stats = loadPlayerStats();
  const wasAttempted = stats.attemptedPuzzleNumbers.includes(puzzleNumber);
  const wasCompleted = stats.completedPuzzleNumbers.includes(puzzleNumber);

  if (wasAttempted && (!won || wasCompleted)) return stats;

  const attemptedPuzzleNumbers = [...new Set([...stats.attemptedPuzzleNumbers, puzzleNumber])]
    .sort((a, b) => a - b);
  const completedPuzzleNumbers = won || wasCompleted
    ? [...new Set([...stats.completedPuzzleNumbers, puzzleNumber])].sort((a, b) => a - b)
    : stats.completedPuzzleNumbers;

  let currentStreak = 0;
  if (completedPuzzleNumbers.includes(puzzleNumber)) {
    const completed = new Set(completedPuzzleNumbers);
    for (let puzzle = puzzleNumber; completed.has(puzzle); puzzle -= 1) {
      currentStreak += 1;
    }
  }

  const updated: PlayerStats = {
    currentStreak,
    longestStreak: Math.max(stats.longestStreak, currentStreak),
    completedPuzzleNumbers,
    attemptedPuzzleNumbers,
  };
  savePlayerStats(updated);
  return updated;
};
