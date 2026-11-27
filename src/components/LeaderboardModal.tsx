import React, { useEffect, useState } from 'react';
import { Crown, Heart, Trophy, X } from 'lucide-react';
import type {
  Difficulty,
  GameMode,
  LeaderboardEntry,
  PersonalBestMap,
  PlayerAlignment,
} from '../types/game';
import {
  DIFFICULTY_CONFIGS,
  formatTime,
  getBestKey,
  getOrCreateLocalPlayerId,
  subscribeGlobalLeaderboard,
} from '../utils/scoring';
import { soundEngine } from '../utils/sound';

interface LeaderboardModalProps {
  initialMode: GameMode;
  initialDifficulty: Difficulty;
  personalBests: PersonalBestMap;
  playerName?: string;
  playerAlignment?: PlayerAlignment;
  highlightEntryId?: string | null;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  initialMode,
  initialDifficulty,
  personalBests,
  playerName,
  playerAlignment,
  highlightEntryId,
  onClose,
}) => {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [alignmentFilter, setAlignmentFilter] = useState<'all' | PlayerAlignment>('all');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const localPlayerId = getOrCreateLocalPlayerId();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = subscribeGlobalLeaderboard(
      mode,
      difficulty,
      (payload) => {
        setEntries(payload.entries);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.message.includes('Quota exceeded')) {
          setError('Daily Firebase free-tier quota reached. Quota resets tomorrow.');
        } else {
          setError('Unable to stream real-time leaderboard right now.');
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [mode, difficulty]);

  const personalBest = personalBests[getBestKey(mode, difficulty)];
  const visibleEntries =
    alignmentFilter === 'all'
      ? entries
      : entries.filter((e) => e.alignment === alignmentFilter);

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
                Real-Time Global Leaderboard
              </h2>
              <p className="mt-0.5 text-xs text-[#e5d2eb]/75">
                Live Royal &amp; Rebel rankings across Classic and Timed Blitz tables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {playerName && (
              <span className="hidden text-xs text-[#e5d2eb] sm:inline">
                Playing as <strong className="font-semibold text-[#f7dca0]">{playerName}</strong>
                {playerAlignment ? ` · ${playerAlignment}` : ''}
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              aria-label="Close Leaderboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#fffaf2]/15 text-[#fffaf2]/80 transition-colors hover:bg-[#fffaf2]/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#fffaf2]/10 px-6 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg bg-[#14071a] p-1">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setMode('classic');
                }}
                className={[
                  'rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
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
                  'rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                  mode === 'timed'
                    ? 'bg-[#7d173b] text-white'
                    : 'text-[#d9c3e0] hover:text-white',
                ].join(' ')}
              >
                Timed Blitz
              </button>
            </div>

            {/* Alignment Filter: All / Royal / Rebel */}
            <div className="inline-flex rounded-lg bg-[#14071a] p-1">
              {(['all', 'Royal', 'Rebel'] as const).map((filterVal) => (
                <button
                  key={filterVal}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setAlignmentFilter(filterVal);
                  }}
                  className={[
                    'rounded-md px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                    alignmentFilter === filterVal
                      ? 'bg-[#3f194d] text-[#f7dca0]'
                      : 'text-[#d9c3e0] hover:text-white',
                  ].join(' ')}
                >
                  {filterVal === 'all' ? 'All' : filterVal}
                </button>
              ))}
            </div>
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
        <div className="storybook-scroll flex-1 overflow-y-auto px-6 py-4 sm:px-8">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#d6bfd9]">
              Streaming live standings from Firebase...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-[#fca5a5]">{error}</div>
          ) : visibleEntries.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#d6bfd9]">
              No scores recorded in this bracket yet. Click Start Game, choose Royal or Rebel, and clear a round to claim Rank #1!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#fffaf2]/12 text-xs text-[#cbb3d4]">
                    <th className="py-2.5 pl-4 pr-3 font-medium">Rank</th>
                    <th className="py-2.5 px-3 font-medium">Player</th>
                    <th className="py-2.5 px-3 font-medium">Destiny</th>
                    <th className="hidden py-2.5 px-3 font-medium sm:table-cell">Deck Theme</th>
                    <th className="py-2.5 px-3 text-right font-medium">Moves</th>
                    <th className="py-2.5 px-3 text-right font-medium">Time</th>
                    <th className="py-2.5 pl-3 pr-4 text-right font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#fffaf2]/8">
                  {visibleEntries.map((entry, idx) => {
                    const rank = idx + 1;
                    const isCurrentUser =
                      highlightEntryId === entry.id || entry.userId === localPlayerId;
                    const isRebel = entry.alignment === 'Rebel';

                    return (
                      <tr
                        key={entry.id}
                        className={
                          isCurrentUser
                            ? 'bg-[#d9a236]/15 text-white'
                            : 'transition-colors hover:bg-[#fffaf2]/5'
                        }
                      >
                        <td className="rounded-l-lg py-3 pl-4 pr-3 font-mono text-xs font-semibold tabular-nums">
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
                        <td className="py-3 px-3 font-semibold text-[#fffaf2]">
                          {entry.playerName}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs font-normal text-[#f7cf63]">(You)</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-xs font-semibold">
                          <span
                            className={[
                              'inline-flex items-center gap-1',
                              isRebel ? 'text-[#d896ff]' : 'text-[#f5c85c]',
                            ].join(' ')}
                          >
                            {isRebel ? (
                              <Heart className="h-3.5 w-3.5" />
                            ) : (
                              <Crown className="h-3.5 w-3.5" />
                            )}
                            {entry.alignment}
                          </span>
                        </td>
                        <td className="hidden py-3 px-3 text-xs text-[#cbb3d4] sm:table-cell">
                          {entry.themeName}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-xs tabular-nums text-[#e5d2eb]">
                          {entry.moves}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-xs tabular-nums text-[#e5d2eb]">
                          {formatTime(entry.timeSeconds)}
                        </td>
                        <td className="rounded-r-lg py-3 pl-3 pr-4 text-right font-mono text-sm font-semibold tabular-nums text-[#f7dca0]">
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
