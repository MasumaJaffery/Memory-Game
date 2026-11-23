import type {
  Difficulty,
  DifficultyConfig,
  GameMode,
  LeaderboardEntry,
  PersonalBest,
  PersonalBestMap,
  RoundBreakdown,
} from '../types/game';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Quick',
    gridLabel: '4 × 3',
    cols: 4,
    rows: 3,
    pairs: 6,
    timedSeconds: 50,
    scoreMultiplier: 1.0,
  },
  medium: {
    id: 'medium',
    label: 'Standard',
    gridLabel: '4 × 4',
    cols: 4,
    rows: 4,
    pairs: 8,
    timedSeconds: 70,
    scoreMultiplier: 1.25,
  },
  hard: {
    id: 'hard',
    label: 'Master',
    gridLabel: '5 × 4',
    cols: 5,
    rows: 4,
    pairs: 10,
    timedSeconds: 95,
    scoreMultiplier: 1.55,
  },
};

export const PERSONAL_BEST_STORAGE_KEY = 'mirrorbound_personal_bests_v1';
export const PLAYER_NAME_STORAGE_KEY = 'mirrorbound_player_name_v1';
export const LOCAL_LEADERBOARD_FALLBACK_KEY = 'mirrorbound_local_lb_v1';

export function getBestKey(mode: GameMode, difficulty: Difficulty): string {
  return `${mode}:${difficulty}`;
}

export function loadPersonalBests(): PersonalBestMap {
  try {
    const raw = localStorage.getItem(PERSONAL_BEST_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as PersonalBestMap) : {};
  } catch {
    return {};
  }
}

export function savePersonalBest(
  mode: GameMode,
  difficulty: Difficulty,
  candidate: Omit<PersonalBest, 'updatedAt'>
): { map: PersonalBestMap; isNewBest: boolean } {
  const map = loadPersonalBests();
  const key = getBestKey(mode, difficulty);
  const existing = map[key];
  const isNewBest =
    !existing ||
    candidate.score > existing.score ||
    (candidate.score === existing.score && candidate.moves < existing.moves);

  if (isNewBest) {
    map[key] = {
      ...candidate,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(PERSONAL_BEST_STORAGE_KEY, JSON.stringify(map));
    } catch {
      // Ignore storage errors
    }
  }
  return { map, isNewBest };
}

export function loadSavedPlayerName(): string {
  try {
    return localStorage.getItem(PLAYER_NAME_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name.trim().slice(0, 24));
  } catch {
    // Ignore storage errors
  }
}

export function calculateMatchPoints(streak: number): number {
  const streakMultiplier = 1 + Math.max(0, streak - 1) * 0.35;
  return Math.round(120 * streakMultiplier);
}

export function calculateRoundBreakdown(params: {
  mode: GameMode;
  difficulty: Difficulty;
  basePoints: number;
  moves: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  hintsUsed: number;
  previousBestScore: number | null;
}): RoundBreakdown {
  const cfg = DIFFICULTY_CONFIGS[params.difficulty];
  const idealMoves = cfg.pairs;
  const moveRatio = Math.min(1, idealMoves / Math.max(idealMoves, params.moves));
  const efficiencyBonus = Math.round(moveRatio * 550);

  const timeBonus =
    params.mode === 'timed'
      ? Math.max(0, params.remainingSeconds) * 24
      : Math.max(0, Math.round((cfg.pairs * 12 - params.elapsedSeconds) * 6));

  const hintPenalty = params.hintsUsed * 75;
  const subtotal = Math.max(100, params.basePoints + efficiencyBonus + timeBonus - hintPenalty);
  const finalScore = Math.round(subtotal * cfg.scoreMultiplier);
  const isNewPersonalBest = params.previousBestScore === null || finalScore > params.previousBestScore;

  return {
    basePoints: params.basePoints,
    efficiencyBonus,
    timeBonus,
    hintPenalty,
    difficultyMultiplier: cfg.scoreMultiplier,
    finalScore,
    isNewPersonalBest,
  };
}

export function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function fetchGlobalLeaderboard(
  mode: GameMode,
  difficulty: Difficulty
): Promise<{ entries: LeaderboardEntry[]; totalCount: number; source: 'global' | 'local' }> {
  try {
    const res = await fetch(`/api/leaderboard?mode=${mode}&difficulty=${difficulty}&limit=40`);
    if (!res.ok) throw new Error('Failed to load leaderboard');
    const data = (await res.json()) as { entries: LeaderboardEntry[]; totalCount: number };
    return { entries: data.entries, totalCount: data.totalCount, source: 'global' };
  } catch {
    // Graceful local fallback if server unreachable
    try {
      const raw = localStorage.getItem(LOCAL_LEADERBOARD_FALLBACK_KEY);
      const all: LeaderboardEntry[] = raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
      const filtered = all
        .filter((e) => e.mode === mode && e.difficulty === difficulty)
        .sort((a, b) => b.score - a.score || a.moves - b.moves);
      return { entries: filtered, totalCount: filtered.length, source: 'local' };
    } catch {
      return { entries: [], totalCount: 0, source: 'local' };
    }
  }
}

export async function submitGlobalScore(payload: {
  playerName: string;
  score: number;
  mode: GameMode;
  difficulty: Difficulty;
  moves: number;
  timeSeconds: number;
  bestStreak: number;
  themeName: string;
}): Promise<{ entry: LeaderboardEntry; rank: number; totalCount: number; source: 'global' | 'local' }> {
  try {
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(errData.error || 'Could not submit score');
    }
    const data = (await res.json()) as { entry: LeaderboardEntry; rank: number; totalCount: number };
    return { ...data, source: 'global' };
  } catch (err) {
    // Fallback to local storage if network unavailable (but rethrow validation errors)
    if (err instanceof Error && err.message.includes('valid player name')) {
      throw err;
    }
    const entry: LeaderboardEntry = {
      id: `local-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    const raw = localStorage.getItem(LOCAL_LEADERBOARD_FALLBACK_KEY);
    const all: LeaderboardEntry[] = raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
    all.push(entry);
    localStorage.setItem(LOCAL_LEADERBOARD_FALLBACK_KEY, JSON.stringify(all));
    const bucket = all
      .filter((e) => e.mode === payload.mode && e.difficulty === payload.difficulty)
      .sort((a, b) => b.score - a.score || a.moves - b.moves);
    const rank = bucket.findIndex((e) => e.id === entry.id) + 1;
    return { entry, rank, totalCount: bucket.length, source: 'local' };
  }
}
