const mulberry32 = (seed: number) => {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const getDailySeed = (): number => {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return parseInt(`${y}${m}${d}`, 10);
};

export const seededPick = <T>(arr: T[], seed: number): T => {
  const rng = mulberry32(seed);
  return arr[Math.floor(rng() * arr.length)];
};

export const getPuzzleNumber = (): number => {
  const epoch = Date.UTC(2026, 5, 24);
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((today - epoch) / 86400000) + 1;
};

