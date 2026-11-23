import React, { useEffect, useState } from 'react';
import { RefreshCw, Trophy, X } from 'lucide-react';
import type {
  Difficulty,
  GameMode,
  LeaderboardEntry,
  PersonalBestMap,
} from '../types/game';
import {
  DIFFICULTY_CONFIGS,
  fetchGlobalLeaderboard,
  formatTime,
  getBestKey,
} from '../utils/scoring';
import { soundEngine } from '../utils/sound';

interface LeaderboardModalProps {
  initialMode: GameMode;
  initialDifficulty: Difficulty;
  personalBests: PersonalBestMap;
  highlightEntryId?: string | null;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  initialMode,
  initialDifficulty,
  personalBests,
  highlightEntryId,
  onClose,
}) => {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchGlobalLeaderboard(mode, difficulty)
      .then((res) => {
        if (!active) return;
        setEntries(res.entries);
      })
      .catch(() => {
        if (!active) return;
        setError('Unable to reach the global leaderboard right now.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mode, difficulty, refreshTick]);

  const personalBest = personalBests[getBestKey(mode, difficulty)];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#120616]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e5bd67]/40 bg-[#210e29] text-[#fffaf2] shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#fffaf2]/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-[#f2c86b]" />
            <div>
              <h2
                id="leaderboard-title"
                className="text-xl font-bold tracking-wide text-[#f7dca0]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Global Leaderboard
              </h2>
              <p className="mt-0.5 text-xs text-[#e5d2eb]/75">
                Compete for top rankings across Classic and Timed Blitz tables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setRefreshTick((t) => t + 1);
              }}
              aria-label="Refresh leaderboard"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#fffaf2]/15 text-[#fffaf2]/80 transition-colors hover:bg-[#fffaf2]/10 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              aria-label="Close Leaderboard"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#fffaf2]/15 text-[#fffaf2]/80 transition-colors hover:bg-[#fffaf2]/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#fffaf2]/10 px-6 py-3">
          <div className="inline-flex rounded-lg bg-[#14071a] p-1">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setMode('classic');
              }}
              className={[
                'rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                mode === 'classic'
                  ? 'bg-[#7d173b] text-white'
                  : 'text-[#d9c3e0] hover:text-white',
              ].join(' ')}
            >
              Classic
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setMode('timed');
              }}
              className={[
                'rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                mode === 'timed'
                  ? 'bg-[#7d173b] text-white'
                  : 'text-[#d9c3e0] hover:text-white',
              ].join(' ')}
            >
              Timed Blitz
            </button>
          </div>

          <div className="inline-flex rounded-lg bg-[#14071a] p-1">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => {
              const cfg = DIFFICULTY_CONFIGS[diff];
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setDifficulty(diff);
                  }}
                  className={[
                    'rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                    difficulty === diff
                      ? 'bg-[#d9a236] text-[#210d24]'
                      : 'text-[#d9c3e0] hover:text-white',
                  ].join(' ')}
                >
                  {cfg.label} {cfg.gridLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Personal Best Quiet Unboxed Strip */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[#fffaf2]/10 bg-[#18091f] px-6 py-2.5 text-xs text-[#e5d2eb]">
          <span className="font-semibold text-[#f3d48c]">Your Personal Best</span>
          <span aria-hidden="true" className="text-[#fffaf2]/30">·</span>
          {personalBest ? (
            <>
              <span className="font-mono tabular-nums font-semibold text-white">
                {personalBest.score.toLocaleString()} pts
              </span>
              <span aria-hidden="true" className="text-[#fffaf2]/30">·</span>
              <span className="font-mono tabular-nums">{personalBest.moves} moves</span>
              <span aria-hidden="true" className="text-[#fffaf2]/30">·</span>
              <span className="font-mono tabular-nums">{formatTime(personalBest.timeSeconds)}</span>
              <span aria-hidden="true" className="text-[#fffaf2]/30">·</span>
              <span className="font-mono tabular-nums">{personalBest.bestStreak}× best streak</span>
            </>
          ) : (
            <span className="text-[#c6accb]">No completed round in this bracket yet</span>
          )}
        </div>

        {/* Table */}
        <div className="storybook-scroll flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#d6bfd9]">
              Loading global rankings...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-[#fca5a5]">{error}</div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#d6bfd9]">
              No global scores recorded for this mode yet. Finish a round to claim Rank #1!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#fffaf2]/12 text-xs text-[#cbb3d4]">
                    <th className="py-2.5 pr-3 font-medium">Rank</th>
                    <th className="py-2.5 pr-3 font-medium">Player</th>
                    <th className="hidden py-2.5 pr-3 font-medium sm:table-cell">Deck Theme</th>
                    <th className="py-2.5 pr-3 text-right font-medium">Moves</th>
                    <th className="py-2.5 pr-3 text-right font-medium">Time</th>
                    <th className="py-2.5 text-right font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#fffaf2]/8">
                  {entries.map((entry, idx) => {
                    const rank = idx + 1;
                    const isHighlighted = highlightEntryId === entry.id;
                    return (
                      <tr
                        key={entry.id}
                        className={
                          isHighlighted
                            ? 'bg-[#d9a236]/15 text-white'
                            : 'transition-colors hover:bg-[#fffaf2]/5'
                        }
                      >
                        <td className="py-2.5 pr-3 font-mono text-xs font-semibold tabular-nums">
                          <span
                            className={
                              rank === 1
                                ? 'text-[#f7cf63]'
                                : rank === 2
                                ? 'text-[#dbe5f0]'
                                : rank === 3
                                ? 'text-[#e3a374]'
                                : 'text-[#bda4c4]'
                            }
                          >
                            #{rank}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 font-semibold text-[#fffaf2]">
                          {entry.playerName}
                          {isHighlighted && (
                            <span className="ml-2 text-xs font-normal text-[#f7cf63]">(You)</span>
                          )}
                        </td>
                        <td className="hidden py-2.5 pr-3 text-xs text-[#cbb3d4] sm:table-cell">
                          {entry.themeName}
                        </td>
                        <td className="py-2.5 pr-3 text-right font-mono text-xs tabular-nums text-[#e5d2eb]">
                          {entry.moves}
                        </td>
                        <td className="py-2.5 pr-3 text-right font-mono text-xs tabular-nums text-[#e5d2eb]">
                          {formatTime(entry.timeSeconds)}
                        </td>
                        <td className="py-2.5 text-right font-mono text-sm font-semibold tabular-nums text-[#f7dca0]">
                          {entry.score.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
