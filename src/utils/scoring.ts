import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import {
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import type {
  Difficulty,
  DifficultyConfig,
  GameMode,
  LeaderboardEntry,
  PersonalBest,
  PersonalBestMap,
  PlayerAlignment,
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
export const PLAYER_ALIGNMENT_STORAGE_KEY = 'mirrorbound_player_alignment_v1';
export const PLAYER_ID_STORAGE_KEY = 'mirrorbound_player_id_v1';
export const LOCAL_LEADERBOARD_FALLBACK_KEY = 'mirrorbound_local_lb_v1';

// Blueprint validation constants synced with firebase-blueprint.json & firestore.rules
export const BLUEPRINT_LIMITS = {
  USER_ID_MAX_LEN: 128,
  ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
  PLAYER_NAME_MIN_LEN: 1,
  PLAYER_NAME_MAX_LEN: 24,
  THEME_NAME_MIN_LEN: 1,
  THEME_NAME_MAX_LEN: 28,
  SCORE_MIN: 0,
  SCORE_MAX: 50000,
  MOVES_MIN: 6,
  MOVES_MAX: 500,
  TIME_MIN: 1,
  TIME_MAX: 7200,
  STREAK_MIN: 1,
  STREAK_MAX: 24,
} as const;

export function getBestKey(mode: GameMode, difficulty: Difficulty): string {
  return `${mode}:${difficulty}`;
}

export function getBracketKey(mode: GameMode, difficulty: Difficulty): string {
  return `${mode}_${difficulty}`;
}

export function getOrCreateLocalPlayerId(): string {
  try {
    const existing = localStorage.getItem(PLAYER_ID_STORAGE_KEY);
    if (existing && BLUEPRINT_LIMITS.ID_PATTERN.test(existing) && existing.length <= 64) {
      return existing;
    }
    const generated = `player_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(PLAYER_ID_STORAGE_KEY, generated);
    return generated;
  } catch {
    return `player_${Date.now().toString(36)}`;
  }
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
    localStorage.setItem(
      PLAYER_NAME_STORAGE_KEY,
      name.trim().slice(0, BLUEPRINT_LIMITS.PLAYER_NAME_MAX_LEN)
    );
  } catch {
    // Ignore storage errors
  }
}

export function loadSavedAlignment(): PlayerAlignment {
  try {
    const val = localStorage.getItem(PLAYER_ALIGNMENT_STORAGE_KEY);
    return val === 'Rebel' ? 'Rebel' : 'Royal';
  } catch {
    return 'Royal';
  }
}

export function savePlayerAlignment(alignment: PlayerAlignment): void {
  try {
    localStorage.setItem(PLAYER_ALIGNMENT_STORAGE_KEY, alignment);
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

export function sortLeaderboardEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.timeSeconds - b.timeSeconds;
  });
}

function parseFirestoreEntry(docId: string, data: Record<string, unknown>): LeaderboardEntry {
  const createdVal = data.createdAt;
  let createdAtIso = new Date().toISOString();
  if (createdVal instanceof Timestamp) {
    createdAtIso = createdVal.toDate().toISOString();
  } else if (typeof createdVal === 'string') {
    createdAtIso = createdVal;
  }

  return {
    id: docId,
    userId: typeof data.userId === 'string' ? data.userId : undefined,
    playerName: typeof data.playerName === 'string' ? data.playerName : 'Player',
    alignment: data.alignment === 'Rebel' ? 'Rebel' : 'Royal',
    score: Number(data.score) || 0,
    mode: data.mode === 'timed' ? 'timed' : 'classic',
    difficulty:
      data.difficulty === 'easy' || data.difficulty === 'hard' ? data.difficulty : 'medium',
    moves: Number(data.moves) || 6,
    timeSeconds: Number(data.timeSeconds) || 1,
    bestStreak: Number(data.bestStreak) || 1,
    themeName: typeof data.themeName === 'string' ? data.themeName : 'Ever After Cast',
    createdAt: createdAtIso,
  };
}

/**
 * Subscribes in real-time to the Firestore `/leaderboard_entries` collection for a given mode & difficulty bracket.
 */
export function subscribeGlobalLeaderboard(
  mode: GameMode,
  difficulty: Difficulty,
  onUpdate: (payload: { entries: LeaderboardEntry[]; totalCount: number; isLive: boolean }) => void,
  onError?: (err: Error) => void
): () => void {
  const bracket = getBracketKey(mode, difficulty);
  const path = 'leaderboard_entries';
  const q = query(
    collection(db, path),
    where('bracket', '==', bracket),
    limit(60)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const firestoreEntries: LeaderboardEntry[] = snapshot.docs.map((d) =>
        parseFirestoreEntry(d.id, d.data() as Record<string, unknown>)
      );
      const sorted = sortLeaderboardEntries(firestoreEntries);
      onUpdate({
        entries: sorted.slice(0, 40),
        totalCount: sorted.length,
        isLive: true,
      });
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (structuredErr) {
        if (onError && structuredErr instanceof Error) {
          onError(structuredErr);
        }
      }
    }
  );

  return unsubscribe;
}

export async function submitGlobalScore(payload: {
  playerName: string;
  alignment: PlayerAlignment;
  score: number;
  mode: GameMode;
  difficulty: Difficulty;
  moves: number;
  timeSeconds: number;
  bestStreak: number;
  themeName: string;
}): Promise<{
  entry: LeaderboardEntry;
  rank: number;
  totalCount: number;
  source: 'firebase' | 'global' | 'local';
}> {
  // Enforce defensive payload constraints from firebase-blueprint.json
  const sanitizedName = payload.playerName
    .trim()
    .replace(/[^\p{L}\p{N}\s._'-]/gu, '')
    .slice(0, BLUEPRINT_LIMITS.PLAYER_NAME_MAX_LEN)
    .trim();

  if (sanitizedName.length < BLUEPRINT_LIMITS.PLAYER_NAME_MIN_LEN) {
    throw new Error('Please enter a valid player name (1–24 characters).');
  }

  const alignment: PlayerAlignment = payload.alignment === 'Rebel' ? 'Rebel' : 'Royal';
  const localPlayerId = getOrCreateLocalPlayerId();

  const clampedScore = Math.min(
    BLUEPRINT_LIMITS.SCORE_MAX,
    Math.max(BLUEPRINT_LIMITS.SCORE_MIN, Math.round(payload.score))
  );
  const clampedMoves = Math.min(
    BLUEPRINT_LIMITS.MOVES_MAX,
    Math.max(BLUEPRINT_LIMITS.MOVES_MIN, Math.round(payload.moves))
  );
  const clampedTime = Math.min(
    BLUEPRINT_LIMITS.TIME_MAX,
    Math.max(BLUEPRINT_LIMITS.TIME_MIN, Math.round(payload.timeSeconds))
  );
  const clampedStreak = Math.min(
    BLUEPRINT_LIMITS.STREAK_MAX,
    Math.max(BLUEPRINT_LIMITS.STREAK_MIN, Math.round(payload.bestStreak))
  );
  const sanitizedTheme =
    payload.themeName
      .trim()
      .replace(/[^\p{L}\p{N}\s'-]/gu, '')
      .slice(0, BLUEPRINT_LIMITS.THEME_NAME_MAX_LEN)
      .trim() || 'Ever After Cast';

  const bracket = getBracketKey(payload.mode, payload.difficulty);
  const entryId = `${localPlayerId}_${Date.now()}`.slice(0, BLUEPRINT_LIMITS.USER_ID_MAX_LEN);
  const path = 'leaderboard_entries';

  try {
    await setDoc(doc(db, path, entryId), {
      userId: localPlayerId,
      playerName: sanitizedName,
      alignment,
      score: clampedScore,
      mode: payload.mode,
      difficulty: payload.difficulty,
      bracket,
      moves: clampedMoves,
      timeSeconds: clampedTime,
      bestStreak: clampedStreak,
      themeName: sanitizedTheme,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${entryId}`);
  }

  // Compute live rank in the bracket
  let rank = 1;
  let totalCount = 1;
  try {
    const q = query(collection(db, path), where('bracket', '==', bracket), limit(100));
    const snap = await getDocs(q);
    const allEntries = sortLeaderboardEntries(
      snap.docs.map((d) => parseFirestoreEntry(d.id, d.data() as Record<string, unknown>))
    );
    totalCount = Math.max(1, allEntries.length);
    const foundIdx = allEntries.findIndex((e) => e.id === entryId);
    rank = foundIdx >= 0 ? foundIdx + 1 : totalCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  const createdEntry: LeaderboardEntry = {
    id: entryId,
    userId: localPlayerId,
    playerName: sanitizedName,
    alignment,
    score: clampedScore,
    mode: payload.mode,
    difficulty: payload.difficulty,
    moves: clampedMoves,
    timeSeconds: clampedTime,
    bestStreak: clampedStreak,
    themeName: sanitizedTheme,
    createdAt: new Date().toISOString(),
  };

  return {
    entry: createdEntry,
    rank,
    totalCount,
    source: 'firebase',
  };
}
