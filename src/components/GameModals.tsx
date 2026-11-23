import React, { useState } from 'react';
import { Award, Clock, Play, RotateCcw, Send, Trophy } from 'lucide-react';
import type { Difficulty, GameMode, RoundBreakdown } from '../types/game';
import {
  DIFFICULTY_CONFIGS,
  formatTime,
  loadSavedPlayerName,
  savePlayerName,
  submitGlobalScore,
} from '../utils/scoring';
import { soundEngine } from '../utils/sound';

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
  breakdown: RoundBreakdown;
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
  breakdown,
  onPlayAgain,
  onExitToTitle,
  onOpenLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState<string>(() => loadSavedPlayerName());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    entryId: string;
    rank: number;
    totalCount: number;
  } | null>(null);

  const cfg = DIFFICULTY_CONFIGS[difficulty];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = playerName.trim();
    if (!cleaned) {
      setSubmitError('Enter your name to post your score.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    savePlayerName(cleaned);
    try {
      const res = await submitGlobalScore({
        playerName: cleaned,
        score: breakdown.finalScore,
        mode,
        difficulty,
        moves,
        timeSeconds: Math.max(1, elapsedSeconds),
        bestStreak: Math.max(1, bestStreak),
        themeName,
      });
      soundEngine.playMatch(4);
      setSubmittedResult({
        entryId: res.entry.id,
        rank: res.rank,
        totalCount: res.totalCount,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit score.');
    } finally {
      setSubmitting(false);
    }
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

        {/* Global Leaderboard Submission */}
        <div className="mt-4">
          {submittedResult ? (
            <div className="rounded-xl border border-[#f0c869]/35 bg-[#2d1338] p-3.5 text-center">
              <div className="text-sm font-semibold text-[#f7dca0]">
                Posted to Global Leaderboard — Rank #{submittedResult.rank} of {submittedResult.totalCount}
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
                View Full Standings
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <label htmlFor="lb-player-name" className="block text-xs font-semibold text-[#e5d2eb]">
                Post to Global Leaderboard
              </label>
              <div className="flex gap-2">
                <input
                  id="lb-player-name"
                  type="text"
                  maxLength={24}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Your display name"
                  className="h-10 flex-1 rounded-lg border border-[#fffaf2]/18 bg-[#15081b] px-3 text-sm text-white placeholder:text-[#b69bbd]/60 focus:border-[#f0c869] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#8c1b43] px-4 text-xs font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#a62251] disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? 'Posting...' : 'Submit'}
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
