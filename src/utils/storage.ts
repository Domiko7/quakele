import { getPuzzleNumber } from "./seed";
import type { GamePhase } from "../types";

export interface SavedState {
  puzzleNumber: number;
  phase: GamePhase;
  cityGuesses: string[];
  cityResult: { guesses: string[]; won: boolean } | null;
  yearGuesses: number[];
  yearResult: { guesses: number[]; won: boolean } | null;
}

export const loadGameState = (): SavedState | null => {
  try {
    const raw = localStorage.getItem("state");
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
    localStorage.setItem("state", JSON.stringify({ ...state, puzzleNumber: getPuzzleNumber() }));
  } catch {}
};
