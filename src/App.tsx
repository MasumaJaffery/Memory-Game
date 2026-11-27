import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  Flame,
  Lightbulb,
  Music,
  Palette,
  Pause,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type {
  CardItem,
  DeckTheme,
  Difficulty,
  GameMode,
  GamePhase,
  PersonalBestMap,
  PlayerAlignment,
  RoundBreakdown,
} from './types/game';
import {
  ACCENT_SPECS,
  CardBackArt,
  CHARACTER_CARD_IMAGES,
  loadActiveThemeId,
  loadCustomTheme,
  PRESET_THEMES,
  saveActiveThemeId,
  saveCustomTheme,
  SYMBOL_PACKS,
} from './data/deckThemes';
import {
  calculateMatchPoints,
  calculateRoundBreakdown,
  DIFFICULTY_CONFIGS,
  formatTime,
  getBestKey,
  loadPersonalBests,
  loadSavedAlignment,
  loadSavedPlayerName,
  savePersonalBest,
  savePlayerAlignment,
  savePlayerName,
} from './utils/scoring';
import { soundEngine } from './utils/sound';
import { TitleLockup } from './components/TitleLockup';
import { StagePillar } from './components/StagePillar';
import { MemoryCard } from './components/MemoryCard';
import { DeckStudioModal } from './components/DeckStudioModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { VictoryParticles } from './components/VictoryParticles';
import {
  DestinySetupModal,
  PauseModal,
  TimeUpModal,
  VictoryModal,
} from './components/GameModals';

const BG_IMAGE_URL = '/assets/aistudio/Enchanted_Forest_Game_Screen_480b1825.png';
const MAX_HINTS = 2;

function createShuffledDeck(difficulty: Difficulty, theme: DeckTheme): CardItem[] {
  const { pairs } = DIFFICULTY_CONFIGS[difficulty];
  const symbols = SYMBOL_PACKS[theme.symbolPack];
  const indices = Array.from({ length: symbols.length }, (_, i) => i);

  // Fisher-Yates shuffle symbol indices so quick/standard rounds get fresh symbol mixes
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const chosen = indices.slice(0, pairs);
  const deck: CardItem[] = [];
  chosen.forEach((symIdx) => {
    const sym = symbols[symIdx];
    deck.push(
      {
        uid: `${sym.key}-a-${Math.random().toString(36).slice(2, 7)}`,
        pairId: sym.key,
        symbolIndex: symIdx,
        label: sym.label,
        isFlipped: false,
        isMatched: false,
      },
      {
        uid: `${sym.key}-b-${Math.random().toString(36).slice(2, 7)}`,
        pairId: sym.key,
        symbolIndex: symIdx,
        label: sym.label,
        isFlipped: false,
        isMatched: false,
      }
    );
  });

  // Fisher-Yates shuffle the cards
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

interface FloatingToast {
  id: number;
  text: string;
  accent: 'gold' | 'teal';
}

export default function App() {
  // Persisted theme, player destiny profile & high score state
  const [customTheme, setCustomTheme] = useState<DeckTheme>(() => loadCustomTheme());
  const [activeThemeId, setActiveThemeId] = useState<string>(() => loadActiveThemeId());
  const [personalBests, setPersonalBests] = useState<PersonalBestMap>(() => loadPersonalBests());
  const [playerName, setPlayerName] = useState<string>(() => loadSavedPlayerName());
  const [playerAlignment, setPlayerAlignment] = useState<PlayerAlignment>(() =>
    loadSavedAlignment()
  );
  const [muted, setMuted] = useState<boolean>(() => soundEngine.isMuted());
  const [musicOn, setMusicOn] = useState<boolean>(() => soundEngine.isMusicEnabled());

  // Game setup & phase
  const [phase, setPhase] = useState<GamePhase>('TITLE');
  const [mode, setMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  // Active round state
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [mismatchUids, setMismatchUids] = useState<string[]>([]);
  const [justMatchedUids, setJustMatchedUids] = useState<string[]>([]);
  const [hintUids, setHintUids] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [basePoints, setBasePoints] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(DIFFICULTY_CONFIGS.medium.timedSeconds);
  const [roundBreakdown, setRoundBreakdown] = useState<RoundBreakdown | null>(null);
  const [toast, setToast] = useState<FloatingToast | null>(null);

  // Keyboard grid focus
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Modals & Victory particle state
  const [showVictoryParticles, setShowVictoryParticles] = useState(false);
  const [showDestinyModal, setShowDestinyModal] = useState(false);
  const [showDeckStudio, setShowDeckStudio] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardHighlightId, setLeaderboardHighlightId] = useState<string | null>(null);

  // Background image fallback state
  const [bgLoadedError, setBgLoadedError] = useState(false);

  // Timers cleanup refs
  const mismatchTimerRef = useRef<number | null>(null);
  const matchPopTimerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const victoryTimerRef = useRef<number | null>(null);

  const activeTheme = useMemo<DeckTheme>(() => {
    if (activeThemeId === 'custom-studio') return customTheme;
    return PRESET_THEMES.find((t) => t.id === activeThemeId) ?? PRESET_THEMES[0];
  }, [activeThemeId, customTheme]);

  const diffCfg = DIFFICULTY_CONFIGS[difficulty];
  const currentBest = personalBests[getBestKey(mode, difficulty)] ?? null;
  const matchedPairs = useMemo(
    () => cards.filter((c) => c.isMatched).length / 2,
    [cards]
  );

  const clearPendingTimers = useCallback(() => {
    if (mismatchTimerRef.current !== null) {
      window.clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = null;
    }
    if (matchPopTimerRef.current !== null) {
      window.clearTimeout(matchPopTimerRef.current);
      matchPopTimerRef.current = null;
    }
    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    if (victoryTimerRef.current !== null) {
      window.clearTimeout(victoryTimerRef.current);
      victoryTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearPendingTimers, [clearPendingTimers]);

  // Preload all 10 character card portraits so flips are immediate with zero flicker
  useEffect(() => {
    CHARACTER_CARD_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Start soundtrack immediately on mount (and auto-unlock on first user gesture if browser requires interaction)
  useEffect(() => {
    soundEngine.ensureMusicPlaying();
  }, []);

  // Gently duck background soundtrack during pause or end-of-round modals
  useEffect(() => {
    soundEngine.setMusicDucked(phase === 'PAUSED' || phase === 'VICTORY' || phase === 'TIME_UP');
  }, [phase]);

  const pushToast = useCallback((text: string, accent: 'gold' | 'teal' = 'gold') => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ id: Date.now(), text, accent });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 950);
  }, []);

  const startNewGame = useCallback(
    (nextMode: GameMode = mode, nextDiff: Difficulty = difficulty) => {
      clearPendingTimers();
      soundEngine.playFlip();
      const cfg = DIFFICULTY_CONFIGS[nextDiff];
      setMode(nextMode);
      setDifficulty(nextDiff);
      setCards(createShuffledDeck(nextDiff, activeTheme));
      setFlippedUids([]);
      setMismatchUids([]);
      setJustMatchedUids([]);
      setHintUids([]);
      setIsLocked(false);
      setMoves(0);
      setStreak(0);
      setBestStreak(0);
      setBasePoints(0);
      setHintsLeft(MAX_HINTS);
      setElapsedSeconds(0);
      setRemainingSeconds(cfg.timedSeconds);
      setRoundBreakdown(null);
      setToast(null);
      setFocusedIndex(null);
      setShowVictoryParticles(false);
      setPhase('PLAYING');
    },
    [activeTheme, clearPendingTimers, difficulty, mode]
  );

  const handleRequestStartFromTitle = useCallback(() => {
    soundEngine.playClick();
    setShowDestinyModal(true);
  }, []);

  const handleConfirmDestinyAndStart = useCallback(
    (confirmedName: string, confirmedAlignment: PlayerAlignment) => {
      setPlayerName(confirmedName);
      setPlayerAlignment(confirmedAlignment);
      savePlayerName(confirmedName);
      savePlayerAlignment(confirmedAlignment);
      setShowDestinyModal(false);
      startNewGame(mode, difficulty);
    },
    [difficulty, mode, startNewGame]
  );

  // Sync card labels cleanly if the user switches themes mid-round
  const handleSelectTheme = useCallback((theme: DeckTheme) => {
    setActiveThemeId(theme.id);
    saveActiveThemeId(theme.id);
    const pack = SYMBOL_PACKS[theme.symbolPack];
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        label: pack[card.symbolIndex % pack.length].label,
      }))
    );
  }, []);

  const handleSaveCustomTheme = useCallback((theme: DeckTheme) => {
    setCustomTheme(theme);
    saveCustomTheme(theme);
  }, []);

  const handleToggleMute = useCallback(() => {
    const next = soundEngine.toggleMute();
    setMuted(next);
    if (!next) {
      soundEngine.playClick();
      soundEngine.ensureMusicPlaying();
    }
  }, []);

  const handleToggleMusic = useCallback(() => {
    const next = soundEngine.toggleMusic();
    setMusicOn(next);
    setMuted(soundEngine.isMuted());
    if (!soundEngine.isMuted()) {
      soundEngine.playClick();
    }
  }, []);

  // Round clock (pauses automatically when modal is open or phase != PLAYING)
  const isClockRunning = phase === 'PLAYING' && !showDeckStudio && !showLeaderboard;

  useEffect(() => {
    if (!isClockRunning) return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      if (mode === 'timed') {
        setRemainingSeconds((prev) => {
          const next = prev - 1;
          if (next > 0 && next <= 10) {
            soundEngine.playTickWarning();
          }
          if (next <= 0) {
            soundEngine.playTimeUp();
            setPhase('TIME_UP');
            return 0;
          }
          return next;
        });
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isClockRunning, mode]);

  // Card flip & match resolution
  const handleCardSelect = useCallback(
    (card: CardItem) => {
      if (phase !== 'PLAYING' || isLocked || card.isFlipped || card.isMatched) return;

      soundEngine.playFlip();
      const nextCards = cards.map((c) =>
        c.uid === card.uid ? { ...c, isFlipped: true } : c
      );
      const nextFlipped = [...flippedUids, card.uid];
      setCards(nextCards);
      setFlippedUids(nextFlipped);

      if (nextFlipped.length < 2) return;

      setIsLocked(true);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const firstCard = nextCards.find((c) => c.uid === nextFlipped[0]);
      const secondCard = nextCards.find((c) => c.uid === nextFlipped[1]);
      if (!firstCard || !secondCard) {
        setIsLocked(false);
        setFlippedUids([]);
        return;
      }

      if (firstCard.pairId === secondCard.pairId) {
        const nextStreak = streak + 1;
        const nextBestStreak = Math.max(bestStreak, nextStreak);
        const earned = calculateMatchPoints(nextStreak);
        const nextBasePoints = basePoints + earned;
        const timeBonusAdd = mode === 'timed' ? (nextStreak >= 2 ? 3 : 2) : 0;

        soundEngine.playMatch(nextStreak);
        setStreak(nextStreak);
        setBestStreak(nextBestStreak);
        setBasePoints(nextBasePoints);
        setHintUids([]);

        const matchedBoard = nextCards.map((c) =>
          c.pairId === firstCard.pairId ? { ...c, isMatched: true, isFlipped: true } : c
        );
        setCards(matchedBoard);
        setFlippedUids([]);
        setJustMatchedUids([firstCard.uid, secondCard.uid]);
        setIsLocked(false);

        let updatedRemaining = remainingSeconds;
        if (mode === 'timed') {
          const cap = DIFFICULTY_CONFIGS[difficulty].timedSeconds + 20;
          updatedRemaining = Math.min(cap, remainingSeconds + timeBonusAdd);
          setRemainingSeconds(updatedRemaining);
        }

        const toastParts = [`+${earned}`];
        if (nextStreak >= 2) toastParts.push(`${nextStreak}× Streak`);
        if (timeBonusAdd > 0) toastParts.push(`+${timeBonusAdd}s`);
        pushToast(toastParts.join(' · '), nextStreak >= 2 ? 'teal' : 'gold');

        matchPopTimerRef.current = window.setTimeout(() => {
          setJustMatchedUids([]);
          matchPopTimerRef.current = null;
        }, 380);

        // Check victory condition
        const allMatched = matchedBoard.every((c) => c.isMatched);
        if (allMatched) {
          const prevBestScore = personalBests[getBestKey(mode, difficulty)]?.score ?? null;
          const breakdown = calculateRoundBreakdown({
            mode,
            difficulty,
            basePoints: nextBasePoints,
            moves: nextMoves,
            elapsedSeconds: Math.max(1, elapsedSeconds),
            remainingSeconds: updatedRemaining,
            hintsUsed: MAX_HINTS - hintsLeft,
            previousBestScore: prevBestScore,
          });
          const saved = savePersonalBest(mode, difficulty, {
            score: breakdown.finalScore,
            moves: nextMoves,
            timeSeconds: Math.max(1, elapsedSeconds),
            bestStreak: nextBestStreak,
          });
          setPersonalBests(saved.map);
          setRoundBreakdown({ ...breakdown, isNewPersonalBest: saved.isNewBest });
          setShowVictoryParticles(true);

          victoryTimerRef.current = window.setTimeout(() => {
            soundEngine.playVictory();
            setPhase('VICTORY');
            victoryTimerRef.current = null;
          }, 340);
        }
      } else {
        // Mismatch
        setStreak(0);
        setMismatchUids([firstCard.uid, secondCard.uid]);
        soundEngine.playMismatch();

        mismatchTimerRef.current = window.setTimeout(() => {
          setCards((curr) =>
            curr.map((c) =>
              c.uid === firstCard.uid || c.uid === secondCard.uid
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedUids([]);
          setMismatchUids([]);
          setIsLocked(false);
          mismatchTimerRef.current = null;
        }, 620);
      }
    },
    [
      basePoints,
      bestStreak,
      cards,
      difficulty,
      elapsedSeconds,
      flippedUids,
      hintsLeft,
      isLocked,
      mode,
      moves,
      personalBests,
      phase,
      pushToast,
      remainingSeconds,
      streak,
    ]
  );

  // Hint: highlights one unmatched pair for 1100ms
  const handleTriggerHint = useCallback(() => {
    if (phase !== 'PLAYING' || hintsLeft <= 0 || isLocked) return;
    const unmatched = cards.filter((c) => !c.isMatched && !c.isFlipped);
    const byPair = new Map<string, CardItem[]>();
    unmatched.forEach((c) => {
      const list = byPair.get(c.pairId) ?? [];
      list.push(c);
      byPair.set(c.pairId, list);
    });
    const fullPairs = Array.from(byPair.values()).filter((pair) => pair.length === 2);
    if (fullPairs.length === 0) return;

    const picked = fullPairs[Math.floor(Math.random() * fullPairs.length)];
    soundEngine.playHint();
    setHintsLeft((h) => h - 1);
    setHintUids(picked.map((c) => c.uid));
    pushToast('Hint: Matching pair highlighted', 'teal');

    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
    }
    hintTimerRef.current = window.setTimeout(() => {
      setHintUids([]);
      hintTimerRef.current = null;
    }, 1150);
  }, [cards, hintsLeft, isLocked, phase, pushToast]);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        if (showDestinyModal) {
          setShowDestinyModal(false);
          return;
        }
        if (showDeckStudio) {
          setShowDeckStudio(false);
          return;
        }
        if (showLeaderboard) {
          setShowLeaderboard(false);
          return;
        }
        if (phase === 'PLAYING') {
          setPhase('PAUSED');
          return;
        }
        if (phase === 'PAUSED') {
          setPhase('PLAYING');
          return;
        }
      }

      if (showDestinyModal || showDeckStudio || showLeaderboard) return;

      const lower = e.key.toLowerCase();
      if (lower === 'm') {
        handleToggleMute();
        return;
      }

      if (phase === 'TITLE') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRequestStartFromTitle();
        } else if (lower === 't') {
          soundEngine.playClick();
          setShowDeckStudio(true);
        } else if (lower === 'l') {
          soundEngine.playClick();
          setShowLeaderboard(true);
        }
        return;
      }

      if (phase === 'PAUSED') {
        if (lower === 'p') {
          setPhase('PLAYING');
        }
        return;
      }

      if (phase === 'PLAYING') {
        if (lower === 'p') {
          setPhase('PAUSED');
          return;
        }
        if (lower === 'h') {
          handleTriggerHint();
          return;
        }
        if (lower === 'r') {
          startNewGame();
          return;
        }

        const total = cards.length;
        const cols = diffCfg.cols;
        if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key) && total > 0) {
          e.preventDefault();
          setFocusedIndex((prev) => {
            if (prev === null) return 0;
            if (e.key === 'ArrowRight') return (prev + 1) % total;
            if (e.key === 'ArrowLeft') return (prev - 1 + total) % total;
            if (e.key === 'ArrowDown') return (prev + cols) % total;
            if (e.key === 'ArrowUp') return (prev - cols + total) % total;
            return prev;
          });
          return;
        }
        if ((e.key === 'Enter' || e.key === ' ') && focusedIndex !== null && cards[focusedIndex]) {
          e.preventDefault();
          handleCardSelect(cards[focusedIndex]);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    cards,
    diffCfg.cols,
    focusedIndex,
    handleCardSelect,
    handleRequestStartFromTitle,
    handleToggleMute,
    handleTriggerHint,
    phase,
    showDeckStudio,
    showDestinyModal,
    showLeaderboard,
    startNewGame,
  ]);

  // Derived HUD metrics
  const liveScore = Math.round(basePoints * diffCfg.scoreMultiplier);
  const timeProgress =
    mode === 'timed'
      ? Math.max(0, Math.min(100, (remainingSeconds / diffCfg.timedSeconds) * 100))
      : 100;
  const isLowTime = mode === 'timed' && remainingSeconds <= 10;
  const isWarningTime = mode === 'timed' && remainingSeconds <= 18 && remainingSeconds > 10;

  const activeAccent = ACCENT_SPECS[activeTheme.accentId];

  // Shared HUD bar rendered in the calm sky zone above the mirror on desktop and top on mobile
  const renderHudBar = () => (
    <div className="pointer-events-auto flex w-full flex-col gap-1.5 rounded-2xl border border-[#e7be6a]/45 bg-[#220d26]/90 px-3.5 py-2 text-[#fffaf2] shadow-[0_10px_28px_rgba(18,5,24,0.52)]">
      <div className="flex items-center justify-between gap-2">
        {/* Metrics strip — unboxed tabular figures */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-[#d5badc]">Score</span>
            <span className="font-mono font-semibold tabular-nums text-[#f7d881]">
              {liveScore.toLocaleString()}
            </span>
          </div>

          <span aria-hidden="true" className="text-[#fffaf2]/25">·</span>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-[#d5badc]">Moves</span>
            <span className="font-mono font-semibold tabular-nums text-white">{moves}</span>
          </div>

          <span aria-hidden="true" className="text-[#fffaf2]/25">·</span>

          <div className="flex items-center gap-1.5">
            <Clock
              className={`h-3.5 w-3.5 ${
                isLowTime ? 'text-[#f87171]' : isWarningTime ? 'text-[#fbbf24]' : 'text-[#e9c16b]'
              }`}
            />
            <span
              className={`font-mono font-semibold tabular-nums ${
                isLowTime ? 'text-[#fca5a5]' : isWarningTime ? 'text-[#fde68a]' : 'text-white'
              }`}
            >
              {mode === 'timed' ? formatTime(remainingSeconds) : formatTime(elapsedSeconds)}
            </span>
            {isLowTime && (
              <span className="text-[11px] font-semibold text-[#fca5a5]">Low time</span>
            )}
          </div>

          {streak >= 2 && (
            <>
              <span aria-hidden="true" className="text-[#fffaf2]/25">·</span>
              <div className="flex items-center gap-1 text-[#7de2ea]">
                <Flame className="h-3.5 w-3.5" />
                <span className="font-mono text-xs font-semibold tabular-nums">{streak}×</span>
              </div>
            </>
          )}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleTriggerHint}
            disabled={hintsLeft <= 0 || phase !== 'PLAYING' || isLocked}
            title={`Hint (${hintsLeft} left)`}
            aria-label={`Use Hint (${hintsLeft} remaining)`}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#fffaf2]/15 bg-[#33153b] px-2 text-xs font-semibold text-[#f7dca0] whitespace-nowrap transition-colors hover:bg-[#451d50] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span className="font-mono tabular-nums">{hintsLeft}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowDeckStudio(true);
            }}
            title="Deck Themes"
            aria-label="Open Deck Themes"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#fffaf2]/15 bg-[#33153b] text-[#f3e3f8] transition-colors hover:bg-[#451d50]"
          >
            <Palette className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setLeaderboardHighlightId(null);
              setShowLeaderboard(true);
            }}
            title="Global Leaderboard"
            aria-label="Open Global Leaderboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#fffaf2]/15 bg-[#33153b] text-[#f7d881] transition-colors hover:bg-[#451d50]"
          >
            <Trophy className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleToggleMusic}
            title={musicOn && !muted ? 'Pause Music' : 'Play Music'}
            aria-label={musicOn && !muted ? 'Pause Music' : 'Play Music'}
            className={[
              'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
              musicOn && !muted
                ? 'border-[#e7be6a]/45 bg-[#3f194a] text-[#f7dca0] hover:bg-[#522161]'
                : 'border-[#fffaf2]/15 bg-[#33153b] text-[#9b84a6] hover:bg-[#451d50] hover:text-white',
            ].join(' ')}
          >
            <Music className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={muted ? 'Unmute Sound' : 'Mute Sound'}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#fffaf2]/15 bg-[#33153b] text-[#f3e3f8] transition-colors hover:bg-[#451d50]"
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setPhase((p) => (p === 'PAUSED' ? 'PLAYING' : 'PAUSED'));
            }}
            title="Pause Game"
            aria-label="Pause Game"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#fffaf2]/15 bg-[#33153b] text-[#f3e3f8] transition-colors hover:bg-[#451d50]"
          >
            <Pause className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => startNewGame()}
            title="Restart Round"
            aria-label="Restart Round"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#fffaf2]/15 bg-[#33153b] text-[#f3e3f8] transition-colors hover:bg-[#451d50]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Timed Blitz countdown bar OR Classic pairs progress bar */}
      <div className="flex items-center gap-2.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#fffaf2]/12">
          <div
            className="h-full rounded-full transition-transform duration-300 ease-out origin-left"
            style={{
              transform: `scaleX(${
                mode === 'timed'
                  ? timeProgress / 100
                  : matchedPairs / Math.max(1, diffCfg.pairs)
              })`,
              backgroundColor:
                mode === 'timed'
                  ? isLowTime
                    ? '#ef4444'
                    : isWarningTime
                    ? '#f59e0b'
                    : '#e7be6a'
                  : '#e7be6a',
            }}
          />
        </div>
        <span className="font-mono text-[11px] tabular-nums text-[#d8bfd9] whitespace-nowrap">
          {matchedPairs}/{diffCfg.pairs} pairs
        </span>
      </div>
    </div>
  );

  // Title Menu inside the mirror glass
  const renderTitleMirrorContent = () => (
    <div className="flex h-full w-full flex-col justify-between rounded-xl bg-[#210d27]/86 p-3.5 text-[#fffaf2] shadow-[inset_0_1px_0_rgba(255,250,242,0.12)] sm:p-5">
      {/* Mode & Grid Selectors */}
      <div className="space-y-3">
        {/* Game Mode */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#f3d48c]">Mode</span>
          <div className="inline-flex rounded-lg bg-[#140619] p-1">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setMode('classic');
              }}
              className={[
                'rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                mode === 'classic'
                  ? 'bg-[#8c1b43] text-white shadow-sm'
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
                  ? 'bg-[#8c1b43] text-white shadow-sm'
                  : 'text-[#d9c3e0] hover:text-white',
              ].join(' ')}
            >
              Timed Blitz
            </button>
          </div>
        </div>

        {/* Grid Difficulty */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#f3d48c]">Board</span>
          <div className="inline-flex rounded-lg bg-[#140619] p-1">
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
                    'rounded-md px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                    difficulty === diff
                      ? 'bg-[#d9a236] text-[#210d24]'
                      : 'text-[#d9c3e0] hover:text-white',
                  ].join(' ')}
                >
                  {cfg.gridLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Deck Theme Row */}
        <div className="flex items-center justify-between gap-2.5 rounded-xl border border-[#fffaf2]/10 bg-[#17081c]/90 px-3 py-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="h-9 w-7 shrink-0 overflow-hidden rounded shadow-sm">
              <CardBackArt pattern={activeTheme.backPattern} accent={activeAccent} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-[#fffaf2]">
                {activeTheme.name}
              </div>
              <div className="truncate text-[11px] text-[#cbb3d4]">
                {mode === 'timed'
                  ? `${diffCfg.timedSeconds}s countdown · +2s/3s per match`
                  : `${diffCfg.pairs} pairs · streak & efficiency scoring`}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowDeckStudio(true);
            }}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#e7be6a]/40 bg-[#2d1338] px-2.5 text-xs font-semibold text-[#f7dca0] whitespace-nowrap transition-colors hover:bg-[#3e1a4c]"
          >
            <Palette className="h-3.5 w-3.5" />
            Customize
          </button>
        </div>
      </div>

      {/* Primary CTA + Secondary Row */}
      <div className="mt-3 space-y-2.5">
        <button
          type="button"
          onClick={handleRequestStartFromTitle}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#f0c55d] to-[#cf9323] px-5 text-sm font-bold tracking-wide text-[#210c24] shadow-[0_6px_18px_rgba(217,162,54,0.35)] transition-transform duration-150 hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fff3c4]"
        >
          <Play className="h-4 w-4 fill-current" />
          Start Game
        </button>

        <div className="flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setLeaderboardHighlightId(null);
              setShowLeaderboard(true);
            }}
            className="inline-flex items-center gap-1.5 font-semibold text-[#f7dca0] whitespace-nowrap transition-colors hover:text-white"
          >
            <Trophy className="h-3.5 w-3.5 text-[#f2c86b]" />
            Global Leaderboard
          </button>

          <div className="flex items-center gap-1.5">
            {playerName && (
              <span className="hidden text-[11px] text-[#e5d2eb] sm:inline">
                {playerName} · <strong className="text-[#f7dca0]">{playerAlignment}</strong> ·
              </span>
            )}
            <span className="hidden font-mono text-[11px] tabular-nums text-[#d6bfd9] sm:inline">
              {currentBest ? `Best: ${currentBest.score.toLocaleString()}` : 'No best yet'}
            </span>
            <button
              type="button"
              onClick={handleToggleMusic}
              title={musicOn && !muted ? 'Pause Music' : 'Play Music'}
              aria-label={musicOn && !muted ? 'Pause Music' : 'Play Music'}
              className={[
                'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
                musicOn && !muted
                  ? 'border-[#e7be6a]/45 bg-[#3c1747] text-[#f7dca0] hover:text-white'
                  : 'border-[#fffaf2]/14 bg-[#2c1236] text-[#9b84a6] hover:text-white',
              ].join(' ')}
            >
              <Music className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleToggleMute}
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label={muted ? 'Unmute Sound' : 'Mute Sound'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#fffaf2]/14 bg-[#2c1236] text-[#e5d2eb] transition-colors hover:text-white"
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Active Memory Card Board inside the mirror glass
  const renderCardBoard = () => (
    <div className="relative h-full w-full p-2 sm:p-2.5">
      {/* Match Score Toast */}
      {toast && (
        <div
          key={toast.id}
          className={[
            'score-toast pointer-events-none absolute left-1/2 top-1 z-30 rounded-lg border px-3 py-1 text-xs font-semibold whitespace-nowrap shadow-lg',
            toast.accent === 'teal'
              ? 'border-[#67e8f9]/60 bg-[#0d3540]/95 text-[#ccfbf1]'
              : 'border-[#f2c86b]/60 bg-[#260d2e]/95 text-[#fce7a2]',
          ].join(' ')}
        >
          {toast.text}
        </div>
      )}

      <div
        className="grid h-full w-full place-items-center gap-1.5 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${diffCfg.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${diffCfg.rows}, minmax(0, 1fr))`,
        }}
      >
        {cards.map((card, index) => (
          <div key={card.uid} className="flex h-full w-full min-h-0 min-w-0 items-center justify-center">
            <MemoryCard
              card={card}
              theme={activeTheme}
              isMismatch={mismatchUids.includes(card.uid)}
              isJustMatched={justMatchedUids.includes(card.uid)}
              isHinted={hintUids.includes(card.uid)}
              isFocused={focusedIndex === index}
              compact={difficulty === 'hard'}
              disabled={phase !== 'PLAYING' || isLocked}
              onSelect={handleCardSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const controlHintLine =
    phase === 'TITLE'
      ? 'Enter / Space Start · T Deck Themes · L Leaderboard · M Mute'
      : 'Click or Arrows + Enter Flip · H Hint · P Pause · R Restart · M Mute';

  return (
    <div className="relative flex h-dvh w-screen items-center justify-center overflow-hidden bg-[#1a0b1f] select-none">
      {/* Ambient blurred edge wash for ultra-wide monitors */}
      {!bgLoadedError && (
        <img
          src={BG_IMAGE_URL}
          alt=""
          referrerPolicy="no-referrer"
          aria-hidden="true"
          onError={() => setBgLoadedError(true)}
          className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(20,7,26,0.72)_100%)]"
      />

      {/* LEFT ORNATE STORYBOOK PILLAR (fills left widescreen empty space) */}
      <StagePillar side="left" />

      {/* DESKTOP / LANDSCAPE STAGE: Pixel-aligned to the exact 1672x941 HD widescreen illustrated mirror backdrop */}
      <main
        className="relative hidden shrink-0 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.75)] lg:block"
        style={{
          width: 'min(100vw, calc(100dvh * 1672 / 941))',
          height: 'min(100dvh, calc(100vw * 941 / 1672))',
        }}
      >
        {/* User's attached HD Enchanted Forest Storybook Mirror Background */}
        {!bgLoadedError ? (
          <img
            src={BG_IMAGE_URL}
            alt="Enchanted forest storybook mirror stage"
            referrerPolicy="no-referrer"
            onError={() => setBgLoadedError(true)}
            className="pointer-events-none absolute inset-0 h-full w-full object-fill"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#3d174a] via-[#6b1a3f] to-[#240d2b]" />
        )}

        {/* Top Calm Sky Arch Zone: Title Lockup on TITLE, Compact HUD during PLAY */}
        <div
          className="pointer-events-none absolute z-20 flex flex-col items-center justify-center"
          style={{
            left: '50.1%',
            top: phase === 'TITLE' ? '2.2%' : '2.0%',
            width: '49%',
            transform: 'translateX(-50%)',
          }}
        >
          {phase === 'TITLE' ? <TitleLockup /> : renderHudBar()}
        </div>

        {/* Center Ornate Mirror Glass Viewport */}
        <section
          aria-label={phase === 'TITLE' ? 'Game Setup' : 'Memory Card Board'}
          className="absolute z-10 overflow-hidden rounded-2xl"
          style={{
            left: '25.9%',
            top: '26.4%',
            width: '48.4%',
            height: '49.0%',
          }}
        >
          {phase === 'TITLE' ? renderTitleMirrorContent() : renderCardBoard()}
        </section>

        {/* Bottom Quiet Control-Hint Strip beneath the mirror */}
        <footer
          className="pointer-events-none absolute z-20 flex justify-center"
          style={{
            left: '50.1%',
            bottom: '5.0%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="rounded-lg border border-[#e7be6a]/30 bg-[#200c25]/86 px-3.5 py-1 text-[11px] font-medium tracking-wide text-[#f7e6c4] whitespace-nowrap shadow-md">
            {controlHintLine}
          </div>
        </footer>
      </main>

      {/* RIGHT ORNATE STORYBOOK PILLAR (fills right widescreen empty space) */}
      <StagePillar side="right" />

      {/* MOBILE / TABLET RESPONSIVE FALLBACK (< 1024px) */}
      <main className="relative z-10 flex h-full w-full flex-col items-center justify-between gap-3 px-3 py-3 lg:hidden">
        {/* Full-bleed background with subtle scrim for readability */}
        {!bgLoadedError && (
          <img
            src={BG_IMAGE_URL}
            alt=""
            referrerPolicy="no-referrer"
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover opacity-55"
          />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#1e0b24]/75 via-[#1e0b24]/55 to-[#1e0b24]/85"
        />

        {/* Top Header / HUD */}
        <div className="w-full max-w-xl">
          {phase === 'TITLE' ? <TitleLockup compact /> : renderHudBar()}
        </div>

        {/* Gilded Mirror Play Frame */}
        <section
          aria-label={phase === 'TITLE' ? 'Game Setup' : 'Memory Card Board'}
          className="flex w-full max-w-xl flex-1 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#e5bd67]/75 bg-[#dff0fc]/85 p-1 shadow-[0_14px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="h-full w-full overflow-y-auto rounded-xl">
            {phase === 'TITLE' ? renderTitleMirrorContent() : renderCardBoard()}
          </div>
        </section>

        {/* Bottom Hint */}
        <div className="text-center text-[11px] font-medium text-[#f5e3be]/90">
          {phase === 'TITLE'
            ? 'Tap Start Game or customize your deck theme'
            : 'Tap two cards to reveal a matching pair'}
        </div>
      </main>

      {/* Celebratory Victory Particle Animation */}
      {(showVictoryParticles || phase === 'VICTORY') && (
        <VictoryParticles alignment={playerAlignment} />
      )}

      {/* Modals */}
      {showDestinyModal && (
        <DestinySetupModal
          initialName={playerName}
          initialAlignment={playerAlignment}
          onConfirmStart={handleConfirmDestinyAndStart}
          onClose={() => setShowDestinyModal(false)}
        />
      )}

      {phase === 'PAUSED' && !showDeckStudio && !showLeaderboard && (
        <PauseModal
          onResume={() => setPhase('PLAYING')}
          onRestart={() => startNewGame()}
          onExitToTitle={() => {
            clearPendingTimers();
            setShowVictoryParticles(false);
            setPhase('TITLE');
          }}
        />
      )}

      {phase === 'VICTORY' && roundBreakdown && !showDeckStudio && !showLeaderboard && (
        <VictoryModal
          mode={mode}
          difficulty={difficulty}
          moves={moves}
          elapsedSeconds={Math.max(1, elapsedSeconds)}
          bestStreak={Math.max(1, bestStreak)}
          themeName={activeTheme.name}
          playerName={playerName}
          playerAlignment={playerAlignment}
          breakdown={roundBreakdown}
          onUpdateProfile={(nextName, nextAlignment) => {
            setPlayerName(nextName);
            setPlayerAlignment(nextAlignment);
          }}
          onPlayAgain={() => startNewGame()}
          onExitToTitle={() => {
            clearPendingTimers();
            setShowVictoryParticles(false);
            setPhase('TITLE');
          }}
          onOpenLeaderboard={(entryId) => {
            setLeaderboardHighlightId(entryId ?? null);
            setShowLeaderboard(true);
          }}
        />
      )}

      {phase === 'TIME_UP' && !showDeckStudio && !showLeaderboard && (
        <TimeUpModal
          difficulty={difficulty}
          matchedPairs={matchedPairs}
          totalPairs={diffCfg.pairs}
          moves={moves}
          onRetry={() => startNewGame('timed', difficulty)}
          onExitToTitle={() => {
            clearPendingTimers();
            setPhase('TITLE');
          }}
        />
      )}

      {showDeckStudio && (
        <DeckStudioModal
          activeTheme={activeTheme}
          customTheme={customTheme}
          onSelectTheme={handleSelectTheme}
          onSaveCustomTheme={handleSaveCustomTheme}
          onClose={() => setShowDeckStudio(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          initialMode={mode}
          initialDifficulty={difficulty}
          personalBests={personalBests}
          playerName={playerName}
          playerAlignment={playerAlignment}
          highlightEntryId={leaderboardHighlightId}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}
