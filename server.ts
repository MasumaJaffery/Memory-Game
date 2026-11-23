import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type GameMode = 'classic' | 'timed';
type Difficulty = 'easy' | 'medium' | 'hard';

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  mode: GameMode;
  difficulty: Difficulty;
  moves: number;
  timeSeconds: number;
  bestStreak: number;
  themeName: string;
  createdAt: string;
}

const DATA_DIR = path.resolve(__dirname, 'data');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

const SEED_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    playerName: 'Clara Vance',
    score: 2640,
    mode: 'classic',
    difficulty: 'medium',
    moves: 11,
    timeSeconds: 34,
    bestStreak: 5,
    themeName: 'Royal Storybook',
    createdAt: '2026-11-18T14:20:00.000Z',
  },
  {
    id: 'seed-2',
    playerName: 'Rowan Mercer',
    score: 2380,
    mode: 'classic',
    difficulty: 'medium',
    moves: 13,
    timeSeconds: 41,
    bestStreak: 4,
    themeName: 'Celestial Arcana',
    createdAt: '2026-11-19T09:15:00.000Z',
  },
  {
    id: 'seed-3',
    playerName: 'Mina Solis',
    score: 2110,
    mode: 'classic',
    difficulty: 'medium',
    moves: 15,
    timeSeconds: 49,
    bestStreak: 3,
    themeName: 'Wonderland Tea',
    createdAt: '2026-11-20T18:40:00.000Z',
  },
  {
    id: 'seed-4',
    playerName: 'Aurelia Chen',
    score: 3290,
    mode: 'timed',
    difficulty: 'medium',
    moves: 11,
    timeSeconds: 29,
    bestStreak: 6,
    themeName: 'Royal Storybook',
    createdAt: '2026-11-21T11:05:00.000Z',
  },
  {
    id: 'seed-5',
    playerName: 'Julian Sterling',
    score: 2890,
    mode: 'timed',
    difficulty: 'medium',
    moves: 13,
    timeSeconds: 37,
    bestStreak: 4,
    themeName: 'Botanical Conservatory',
    createdAt: '2026-11-21T16:50:00.000Z',
  },
  {
    id: 'seed-6',
    playerName: 'Nadia Thorne',
    score: 2490,
    mode: 'timed',
    difficulty: 'medium',
    moves: 15,
    timeSeconds: 46,
    bestStreak: 3,
    themeName: 'Wonderland Tea',
    createdAt: '2026-11-22T08:30:00.000Z',
  },
  {
    id: 'seed-7',
    playerName: 'Elias Moreau',
    score: 1840,
    mode: 'classic',
    difficulty: 'easy',
    moves: 8,
    timeSeconds: 19,
    bestStreak: 4,
    themeName: 'Royal Storybook',
    createdAt: '2026-11-19T12:10:00.000Z',
  },
  {
    id: 'seed-8',
    playerName: 'Sora Takahashi',
    score: 1620,
    mode: 'classic',
    difficulty: 'easy',
    moves: 10,
    timeSeconds: 25,
    bestStreak: 3,
    themeName: 'Botanical Conservatory',
    createdAt: '2026-11-20T15:25:00.000Z',
  },
  {
    id: 'seed-9',
    playerName: 'Tessa Albright',
    score: 2460,
    mode: 'timed',
    difficulty: 'easy',
    moves: 8,
    timeSeconds: 17,
    bestStreak: 5,
    themeName: 'Wonderland Tea',
    createdAt: '2026-11-21T20:10:00.000Z',
  },
  {
    id: 'seed-10',
    playerName: 'Caspian Bell',
    score: 4820,
    mode: 'classic',
    difficulty: 'hard',
    moves: 17,
    timeSeconds: 58,
    bestStreak: 6,
    themeName: 'Celestial Arcana',
    createdAt: '2026-11-20T21:00:00.000Z',
  },
  {
    id: 'seed-11',
    playerName: 'Freya Lindqvist',
    score: 4310,
    mode: 'classic',
    difficulty: 'hard',
    moves: 20,
    timeSeconds: 69,
    bestStreak: 5,
    themeName: 'Royal Storybook',
    createdAt: '2026-11-22T10:45:00.000Z',
  },
  {
    id: 'seed-12',
    playerName: 'Devon Ashford',
    score: 5480,
    mode: 'timed',
    difficulty: 'hard',
    moves: 18,
    timeSeconds: 54,
    bestStreak: 7,
    themeName: 'Celestial Arcana',
    createdAt: '2026-11-22T17:30:00.000Z',
  },
];

function ensureStore(): LeaderboardEntry[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LEADERBOARD_FILE)) {
      fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(SEED_ENTRIES, null, 2), 'utf-8');
      return [...SEED_ENTRIES];
    }
    const raw = fs.readFileSync(LEADERBOARD_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as LeaderboardEntry[];
    }
    return [...SEED_ENTRIES];
  } catch {
    return [...SEED_ENTRIES];
  }
}

function saveStore(entries: LeaderboardEntry[]): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpPath = `${LEADERBOARD_FILE}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(entries, null, 2), 'utf-8');
  fs.renameSync(tmpPath, LEADERBOARD_FILE);
}

function sortLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.timeSeconds - b.timeSeconds;
  });
}

let leaderboardCache: LeaderboardEntry[] = ensureStore();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', count: leaderboardCache.length });
  });

  app.get('/api/leaderboard', (req, res) => {
    const mode = req.query.mode;
    const difficulty = req.query.difficulty;
    const rawLimit = Number(req.query.limit ?? 30);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), 100) : 30;

    let filtered = leaderboardCache;
    if (mode === 'classic' || mode === 'timed') {
      filtered = filtered.filter((e) => e.mode === mode);
    }
    if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
      filtered = filtered.filter((e) => e.difficulty === difficulty);
    }

    const sorted = sortLeaderboard(filtered);
    res.json({
      entries: sorted.slice(0, limit),
      totalCount: sorted.length,
    });
  });

  app.post('/api/leaderboard', (req, res) => {
    const body = req.body as Record<string, unknown> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    const rawName = typeof body.playerName === 'string' ? body.playerName.trim() : '';
    const sanitizedName = rawName.replace(/[^\p{L}\p{N}\s._'-]/gu, '').slice(0, 24).trim();
    if (sanitizedName.length < 1) {
      res.status(400).json({ error: 'Please enter a valid player name (1–24 characters).' });
      return;
    }

    const mode = body.mode;
    const difficulty = body.difficulty;
    if (mode !== 'classic' && mode !== 'timed') {
      res.status(400).json({ error: 'Invalid game mode.' });
      return;
    }
    if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') {
      res.status(400).json({ error: 'Invalid difficulty.' });
      return;
    }

    const score = Math.round(Number(body.score));
    const moves = Math.round(Number(body.moves));
    const timeSeconds = Math.round(Number(body.timeSeconds));
    const bestStreak = Math.round(Number(body.bestStreak));
    const rawTheme = typeof body.themeName === 'string' ? body.themeName.trim() : 'Royal Storybook';
    const themeName = rawTheme.replace(/[^\p{L}\p{N}\s'-]/gu, '').slice(0, 28) || 'Royal Storybook';

    if (
      !Number.isFinite(score) || score < 0 || score > 50000 ||
      !Number.isFinite(moves) || moves < 6 || moves > 500 ||
      !Number.isFinite(timeSeconds) || timeSeconds < 1 || timeSeconds > 7200 ||
      !Number.isFinite(bestStreak) || bestStreak < 1 || bestStreak > 24
    ) {
      res.status(400).json({ error: 'Score parameters out of valid range.' });
      return;
    }

    const entry: LeaderboardEntry = {
      id: crypto.randomUUID(),
      playerName: sanitizedName,
      score,
      mode,
      difficulty,
      moves,
      timeSeconds,
      bestStreak,
      themeName,
      createdAt: new Date().toISOString(),
    };

    leaderboardCache.push(entry);

    // Keep up to 300 highest entries globally so storage stays lean
    if (leaderboardCache.length > 300) {
      leaderboardCache = sortLeaderboard(leaderboardCache).slice(0, 300);
    }

    try {
      saveStore(leaderboardCache);
    } catch {
      // Non-fatal if filesystem is read-only; keep in memory
    }

    const bucket = sortLeaderboard(
      leaderboardCache.filter((e) => e.mode === mode && e.difficulty === difficulty)
    );
    const rank = bucket.findIndex((e) => e.id === entry.id) + 1;

    res.status(201).json({
      entry,
      rank: rank > 0 ? rank : bucket.length,
      totalCount: bucket.length,
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT ?? 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mirrorbound server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
