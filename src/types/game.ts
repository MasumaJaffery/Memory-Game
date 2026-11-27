export type GamePhase = 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'TIME_UP';
export type GameMode = 'classic' | 'timed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type PlayerAlignment = 'Royal' | 'Rebel';

export type SymbolPackId = 'portraits' | 'storybook' | 'wonderland' | 'celestial' | 'botanical';
export type BackPatternId = 'filigree' | 'diamond' | 'lattice' | 'starburst';
export type AccentId = 'crimson' | 'plum' | 'teal' | 'amber' | 'sapphire' | 'emerald';
export type FaceTintId = 'ivory' | 'frost' | 'rosewater' | 'obsidian';

export interface DeckTheme {
  id: string;
  name: string;
  subtitle: string;
  symbolPack: SymbolPackId;
  backPattern: BackPatternId;
  accentId: AccentId;
  faceTint: FaceTintId;
  isCustom?: boolean;
}

export interface CardItem {
  uid: string;
  pairId: string;
  symbolIndex: number;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  gridLabel: string;
  cols: number;
  rows: number;
  pairs: number;
  timedSeconds: number;
  scoreMultiplier: number;
}

export interface PersonalBest {
  score: number;
  moves: number;
  timeSeconds: number;
  bestStreak: number;
  updatedAt: string;
}

export type PersonalBestMap = Record<string, PersonalBest>;

export interface PlayerProfile {
  name: string;
  alignment: PlayerAlignment;
}

export interface LeaderboardEntry {
  id: string;
  userId?: string;
  playerName: string;
  alignment: PlayerAlignment;
  score: number;
  mode: GameMode;
  difficulty: Difficulty;
  moves: number;
  timeSeconds: number;
  bestStreak: number;
  themeName: string;
  createdAt: string;
}

export interface RoundBreakdown {
  basePoints: number;
  efficiencyBonus: number;
  timeBonus: number;
  hintPenalty: number;
  difficultyMultiplier: number;
  finalScore: number;
  isNewPersonalBest: boolean;
}
