import { STORAGE_KEYS } from "./constants";

export function getBestScore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEYS.bestScore);
  return stored ? parseInt(stored, 10) : 0;
}

export function saveBestScore(score: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.bestScore, String(score));
}

export function hasSeenTutorial(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.tutorialSeen) === "true";
}

export function markTutorialSeen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.tutorialSeen, "true");
}
