import React, { useEffect, useRef, useState } from 'react';
import { Award, Clock, Crown, Heart, Play, RotateCcw, Send, Trophy, X } from 'lucide-react';
import type {
  Difficulty,
  GameMode,
  PlayerAlignment,
  RoundBreakdown,
} from '../types/game';
import {
  BLUEPRINT_LIMITS,
  DIFFICULTY_CONFIGS,
  formatTime,
  savePlayerAlignment,
  savePlayerName,
  submitGlobalScore,
} from '../utils/scoring';
import { soundEngine } from '../utils/sound';

interface DestinySetupModalProps {
  initialName: string;
  initialAlignment: PlayerAlignment;
  onConfirmStart: (playerName: string, alignment: PlayerAlignment) => void;
  onClose: () => void;
}

export const DestinySetupModal: React.FC<DestinySetupModalProps> = ({
  initialName,
  initialAlignment,
  onConfirmStart,
  onClose,
}) => {
  const [name, setName] = useState<string>(initialName);
  const [alignment, setAlignment] = useState<PlayerAlignment>(initialAlignment);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = name
      .trim()
      .replace(/[^\p{L}\p{N}\s._'-]/gu, '')
      .slice(0, BLUEPRINT_LIMITS.PLAYER_NAME_MAX_LEN)
      .trim();

    if (cleaned.length < BLUEPRINT_LIMITS.PLAYER_NAME_MIN_LEN) {
      setError('Please enter your name (1–24 characters) to begin.');
      return;
    }

    savePlayerName(cleaned);
    savePlayerAlignment(alignment);
    onConfirmStart(cleaned, alignment);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#120616]/82 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="destiny-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#e9c16b]/55 bg-[#210e29] p-6 text-[#fffaf2] shadow-[0_24px_70px_rgba(0,0,0,0.72)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="destiny-modal-title"
              className="text-2xl font-bold tracking-wide text-[#f7dca0]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Are you Royal or Rebel?
            </h2>
            <p className="mt-1 text-xs text-[#d6bfd9]">
              Choose your destiny and enter your name for the real-time leaderboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#fffaf2]/15 text-[#fffaf2]/80 transition-colors hover:bg-[#fffaf2]/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Royal vs Rebel Selector */}
          <div>
            <span className="block text-xs font-semibold text-[#f3d48c]">
              Select Your Alignment
            </span>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setAlignment('Royal');
                }}
                aria-pressed={alignment === 'Royal'}
                className={[
                  'flex flex-col items-center justify-center rounded-xl border-2 p-3.5 text-center transition-all duration-150',
                  alignment === 'Royal'
                    ? 'border-[#f4c962] bg-gradient-to-b from-[#6e1233] to-[#420a20] text-white shadow-[0_0_20px_rgba(244,201,98,0.28)]'
                    : 'border-[#fffaf2]/12 bg-[#16081d] text-[#d6bfd9] hover:border-[#e5bd67]/40 hover:bg-[#230d2c]',
                ].join(' ')}
              >
                <div
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-full border',
                    alignment === 'Royal'
                      ? 'border-[#f7d881] bg-[#8c1840] text-[#fae084]'
                      : 'border-[#fffaf2]/15 bg-[#240e2e] text-[#d9b86c]',
                  ].join(' ')}
                >
                  <Crown className="h-5 w-5" />
                </div>
                <span className="mt-2 text-sm font-bold tracking-wide">Royal</span>
                <span className="mt-0.5 text-[11px] text-[#e5d2eb]/75">
                  Claim your storybook crown
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setAlignment('Rebel');
                }}
                aria-pressed={alignment === 'Rebel'}
                className={[
                  'flex flex-col items-center justify-center rounded-xl border-2 p-3.5 text-center transition-all duration-150',
                  alignment === 'Rebel'
                    ? 'border-[#d896ff] bg-gradient-to-b from-[#4f186e] to-[#2c0b42] text-white shadow-[0_0_20px_rgba(216,150,255,0.28)]'
                    : 'border-[#fffaf2]/12 bg-[#16081d] text-[#d6bfd9] hover:border-[#d896ff]/40 hover:bg-[#230d2c]',
                ].join(' ')}
              >
                <div
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-full border',
                    alignment === 'Rebel'
                      ? 'border-[#e6beff] bg-[#66208f] text-[#f3d4ff]'
                      : 'border-[#fffaf2]/15 bg-[#240e2e] text-[#c799e6]',
                  ].join(' ')}
                >
                  <Heart className="h-5 w-5" />
                </div>
                <span className="mt-2 text-sm font-bold tracking-wide">Rebel</span>
                <span className="mt-0.5 text-[11px] text-[#e5d2eb]/75">
                  Rewrite your own destiny
                </span>
              </button>
            </div>
          </div>

          {/* Player Name Input */}
          <div>
            <label htmlFor="player-destiny-name" className="block text-xs font-semibold text-[#f3d48c]">
              Your Name
            </label>
            <input
              id="player-destiny-name"
              type="text"
              autoFocus
              maxLength={BLUEPRINT_LIMITS.PLAYER_NAME_MAX_LEN}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your name"
              className="mt-1.5 h-11 w-full rounded-xl border border-[#fffaf2]/20 bg-[#14071a] px-3.5 text-sm text-white placeholder:text-[#b69bbd]/60 focus:border-[#f0c869] focus:outline-none"
            />
            {error && <p className="mt-1.5 text-xs text-[#fca5a5]">{error}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="h-11 rounded-xl border border-[#fffaf2]/15 px-4 text-xs font-semibold text-[#d6bfd9] whitespace-nowrap transition-colors hover:bg-[#fffaf2]/10 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#f0c55d] to-[#cf9323] px-5 text-sm font-bold text-[#210c24] whitespace-nowrap shadow-[0_6px_18px_rgba(217,162,54,0.35)] transition-transform duration-150 hover:brightness-105 active:scale-[0.99]"
            >
              <Play className="h-4 w-4 fill-current" />
              Start Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onExitToTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onExitToTitle,
}) => (
  <div
    className="fixed inset-0 z-40 flex items-center justify-center bg-[#120616]/75 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="pause-modal-title"
  >
    <div className="w-full max-w-sm rounded-2xl border border-[#e5bd67]/45 bg-[#210e29] p-6 text-center text-[#fffaf2] shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
      <h2
        id="pause-modal-title"
        className="text-2xl font-bold tracking-wide text-[#f7dca0]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Game Paused
      </h2>
      <p className="mt-1.5 text-xs text-[#d6bfd9]">
        The mirror clock is paused. Cards remain concealed until you resume.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onResume();
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#d9a236] px-5 text-sm font-bold text-[#210d24] transition-colors hover:bg-[#e8b449]"
        >
          <Play className="h-4 w-4 fill-current" />
          Resume Game
        </button>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onRestart();
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#fffaf2]/18 bg-[#2e1538] px-5 text-sm font-semibold text-[#fffaf2] transition-colors hover:bg-[#3c1c4a]"
        >
          <RotateCcw className="h-4 w-4" />
          Restart Round
        </button>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onExitToTitle();
          }}
          className="inline-flex h-10 items-center justify-center rounded-xl text-xs font-semibold text-[#d6bfd9] transition-colors hover:text-white"
        >
          Return to Title Screen
        </button>
      </div>
    </div>
  </div>
);

interface VictoryModalProps {
  mode: GameMode;
  difficulty: Difficulty;
  moves: number;
  elapsedSeconds: number;
  bestStreak: number;
  themeName: string;
  playerName: string;
  playerAlignment: PlayerAlignment;
  breakdown: RoundBreakdown;
  onUpdateProfile: (name: string, alignment: PlayerAlignment) => void;
  onPlayAgain: () => void;
  onExitToTitle: () => void;
  onOpenLeaderboard: (highlightId?: string) => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  mode,
  difficulty,
  moves,
  elapsedSeconds,
  bestStreak,
  themeName,
  playerName: initialPlayerName,
  playerAlignment: initialAlignment,
  breakdown,
  onUpdateProfile,
  onPlayAgain,
  onExitToTitle,
  onOpenLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState<string>(initialPlayerName);
  const [alignment, setAlignment] = useState<PlayerAlignment>(initialAlignment);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    entryId: string;
    rank: number;
    totalCount: number;
  } | null>(null);

  const autoPostedRef = useRef(false);
  const cfg = DIFFICULTY_CONFIGS[difficulty];

  const postScore = async (targetName: string, targetAlignment: PlayerAlignment) => {
    const cleaned = targetName
      .trim()
      .replace(/[^\p{L}\p{N}\s._'-]/gu, '')
      .slice(0, BLUEPRINT_LIMITS.PLAYER_NAME_MAX_LEN)
      .trim();

    if (cleaned.length < BLUEPRINT_LIMITS.PLAYER_NAME_MIN_LEN) {
      setSubmitError('Enter your name (1–24 characters) to save your score.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    savePlayerName(cleaned);
    savePlayerAlignment(targetAlignment);
    onUpdateProfile(cleaned, targetAlignment);

    try {
      const res = await submitGlobalScore({
        playerName: cleaned,
        alignment: targetAlignment,
        score: breakdown.finalScore,
        mode,
        difficulty,
        moves,
        timeSeconds: Math.max(1, elapsedSeconds),
        bestStreak: Math.max(1, bestStreak),
        themeName,
      });
      setSubmittedResult({
        entryId: res.entry.id,
        rank: res.rank,
        totalCount: res.totalCount,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to save score.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-save score to Firebase Leaderboard when player already chose Name + Royal/Rebel at Start Game
  useEffect(() => {
    if (autoPostedRef.current) return;
    const cleaned = initialPlayerName.trim();
    if (cleaned.length >= 1) {
      autoPostedRef.current = true;
      void postScore(cleaned, initialAlignment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    await postScore(playerName, alignment);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#120616]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#e9c16b]/55 bg-[#210e29] p-6 text-[#fffaf2] shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#f2c86b]/50 bg-[#3a1647] text-[#f7cf63]">
            <Award className="h-6 w-6" />
          </div>
          <h2
            id="victory-title"
            className="mt-3 text-2xl font-bold tracking-wide text-[#f7dca0]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Mirror Cleared
          </h2>
          <p className="mt-1 text-xs text-[#d6bfd9]">
            {playerName ? `${playerName} · ${alignment} · ` : ''}
            {mode === 'timed' ? 'Timed Blitz' : 'Classic'} · {cfg.label} ({cfg.gridLabel})
            {breakdown.isNewPersonalBest ? ' · New Personal Best' : ''}
          </p>

          <div className="mt-4 font-mono text-4xl font-bold tabular-nums text-[#f7cf63]">
            {breakdown.finalScore.toLocaleString()}
          </div>
          <div className="text-xs text-[#cbb3d4]">Final Score</div>
        </div>

        {/* Clean Score Breakdown */}
        <div className="mt-5 space-y-1.5 border-y border-[#fffaf2]/10 py-3.5 text-xs">
          <div className="flex justify-between text-[#e5d2eb]">
            <span>Match & Streak Points</span>
            <span className="font-mono tabular-nums">+{breakdown.basePoints.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#e5d2eb]">
            <span>Memory Efficiency ({moves} moves)</span>
            <span className="font-mono tabular-nums">+{breakdown.efficiencyBonus.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#e5d2eb]">
            <span>{mode === 'timed' ? 'Time Remaining Bonus' : `Speed Bonus (${formatTime(elapsedSeconds)})`}</span>
            <span className="font-mono tabular-nums">+{breakdown.timeBonus.toLocaleString()}</span>
          </div>
          {breakdown.hintPenalty > 0 && (
            <div className="flex justify-between text-[#fca5a5]">
              <span>Hints Used</span>
              <span className="font-mono tabular-nums">-{breakdown.hintPenalty.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 text-[#f3d48c]">
            <span>Difficulty Multiplier ({cfg.label})</span>
            <span className="font-mono tabular-nums">×{breakdown.difficultyMultiplier.toFixed(2)}</span>
          </div>
        </div>

        {/* Real-Time Leaderboard Status / Manual Form Fallback */}
        <div className="mt-4">
          {submittedResult ? (
            <div className="rounded-xl border border-[#f0c869]/35 bg-[#2d1338] p-3.5 text-center">
              <div className="text-sm font-semibold text-[#f7dca0]">
                Saved as {playerName} ({alignment}) — Rank #{submittedResult.rank} of {submittedResult.totalCount}
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenLeaderboard(submittedResult.entryId);
                }}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#fffaf2] underline decoration-[#f0c869]/60 underline-offset-4 hover:text-[#f7dca0]"
              >
                <Trophy className="h-3.5 w-3.5 text-[#f2c86b]" />
                View Real-Time Standings
              </button>
            </div>
          ) : submitting ? (
            <div className="rounded-xl border border-[#fffaf2]/12 bg-[#1a0a21] p-3.5 text-center text-xs text-[#e5d2eb]">
              Saving score for <strong className="text-[#f7dca0]">{playerName}</strong> ({alignment})...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="lb-player-name" className="text-xs font-semibold text-[#e5d2eb]">
                  Save to Real-Time Leaderboard
                </label>
                <div className="inline-flex rounded-lg bg-[#14071a] p-0.5">
                  {(['Royal', 'Rebel'] as PlayerAlignment[]).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setAlignment(choice)}
                      className={[
                        'rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors',
                        alignment === choice
                          ? choice === 'Royal'
                            ? 'bg-[#8c1b43] text-white'
                            : 'bg-[#5c2085] text-white'
                          : 'text-[#cbb3d4] hover:text-white',
                      ].join(' ')}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  id="lb-player-name"
                  type="text"
                  maxLength={BLUEPRINT_LIMITS.PLAYER_NAME_MAX_LEN}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your name"
                  className="h-10 flex-1 rounded-lg border border-[#fffaf2]/18 bg-[#15081b] px-3 text-sm text-white placeholder:text-[#b69bbd]/60 focus:border-[#f0c869] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#8c1b43] px-4 text-xs font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#a62251] disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  Save Score
                </button>
              </div>
              {submitError && <p className="text-xs text-[#fca5a5]">{submitError}</p>}
            </form>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onPlayAgain();
            }}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#d9a236] px-4 text-sm font-bold text-[#210d24] whitespace-nowrap transition-colors hover:bg-[#e8b449]"
          >
            <RotateCcw className="h-4 w-4" />
            Play Again
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onExitToTitle();
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-[#fffaf2]/18 bg-[#2e1538] px-4 text-xs font-semibold text-[#fffaf2] whitespace-nowrap transition-colors hover:bg-[#3c1c4a]"
          >
            Title Screen
          </button>
        </div>
      </div>
    </div>
  );
};

interface TimeUpModalProps {
  difficulty: Difficulty;
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  onRetry: () => void;
  onExitToTitle: () => void;
}

export const TimeUpModal: React.FC<TimeUpModalProps> = ({
  difficulty,
  matchedPairs,
  totalPairs,
  moves,
  onRetry,
  onExitToTitle,
}) => {
  const cfg = DIFFICULTY_CONFIGS[difficulty];
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#120616]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeup-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-[#e57373]/45 bg-[#210e29] p-6 text-center text-[#fffaf2] shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#f87171]/40 bg-[#471625] text-[#fca5a5]">
          <Clock className="h-6 w-6" />
        </div>
        <h2
          id="timeup-title"
          className="mt-3 text-2xl font-bold tracking-wide text-[#ffd6d6]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Time&apos;s Up
        </h2>
        <p className="mt-1.5 text-xs text-[#d6bfd9]">
          Timed Blitz · {cfg.label} ({cfg.gridLabel})
        </p>

        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-[#e5d2eb]">
          <span className="font-mono tabular-nums font-semibold text-[#f7dca0]">
            {matchedPairs}/{totalPairs} pairs matched
          </span>
          <span aria-hidden="true" className="text-[#fffaf2]/30">·</span>
          <span className="font-mono tabular-nums">{moves} moves</span>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onRetry();
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#d9a236] px-5 text-sm font-bold text-[#210d24] transition-colors hover:bg-[#e8b449]"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onExitToTitle();
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl text-xs font-semibold text-[#d6bfd9] transition-colors hover:text-white"
          >
            Return to Title Screen
          </button>
        </div>
      </div>
    </div>
  );
};
