import React, { useState } from 'react';
import type { CardItem, DeckTheme } from '../types/game';
import {
  ACCENT_SPECS,
  CardBackArt,
  FACE_TINT_SPECS,
  SYMBOL_PACKS,
} from '../data/deckThemes';

interface MemoryCardProps {
  card: CardItem;
  theme: DeckTheme;
  isMismatch: boolean;
  isJustMatched: boolean;
  isHinted: boolean;
  isFocused: boolean;
  compact: boolean;
  disabled: boolean;
  onSelect: (card: CardItem) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  card,
  theme,
  isMismatch,
  isJustMatched,
  isHinted,
  isFocused,
  compact,
  disabled,
  onSelect,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const accent = ACCENT_SPECS[theme.accentId];
  const faceTint = FACE_TINT_SPECS[theme.faceTint];
  const pack = SYMBOL_PACKS[theme.symbolPack];
  const symbol = pack[card.symbolIndex % pack.length];
  const isRevealed = card.isFlipped || card.isMatched;
  const isPortraitCard = Boolean(symbol.imageSrc) && !imgFailed;

  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      disabled={disabled || isRevealed}
      title={isRevealed ? symbol.label : undefined}
      aria-label={isRevealed ? `${symbol.label}${card.isMatched ? ' matched' : ''}` : 'Face-down memory card'}
      aria-pressed={isRevealed}
      className={[
        'card-scene group relative min-h-[44px] min-w-[44px] rounded-xl focus:outline-none',
        'aspect-[391/578] w-full max-h-full sm:h-full sm:w-auto sm:max-w-full',
        'transition-transform duration-150 ease-out',
        !isRevealed && !disabled ? 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.97]' : 'cursor-default',
        isFocused ? 'ring-2 ring-[#f6d379] ring-offset-2 ring-offset-[#2d1236]' : 'focus-visible:ring-2 focus-visible:ring-[#f6d379]',
      ].join(' ')}
    >
      {/* Hint golden halo */}
      {isHinted && !isRevealed && (
        <span
          aria-hidden="true"
          className="card-hint-ring pointer-events-none absolute -inset-1 z-20 rounded-xl border-2 border-[#f7cf63] shadow-[0_0_16px_rgba(247,207,99,0.9)]"
        />
      )}

      {/* Match celebratory burst */}
      {isJustMatched && (
        <svg
          viewBox="0 0 100 100"
          aria-hidden="true"
          className="match-burst pointer-events-none absolute -inset-2 z-30 h-[calc(100%+16px)] w-[calc(100%+16px)]"
        >
          <path d="M50 4 L53 16 L50 22 L47 16 Z" fill="#fae084" />
          <path d="M50 96 L53 84 L50 78 L47 84 Z" fill="#fae084" />
          <path d="M4 50 L16 47 L22 50 L16 53 Z" fill="#fae084" />
          <path d="M96 50 L84 47 L78 50 L84 53 Z" fill="#fae084" />
          <circle cx="18" cy="18" r="3" fill="#fff5cc" />
          <circle cx="82" cy="18" r="3" fill="#fff5cc" />
          <circle cx="18" cy="82" r="3" fill="#fff5cc" />
          <circle cx="82" cy="82" r="3" fill="#fff5cc" />
        </svg>
      )}

      <div
        className={[
          'card-inner rounded-xl',
          isRevealed ? 'is-flipped' : '',
          isMismatch ? 'is-mismatch' : '',
          isJustMatched ? 'is-just-matched' : '',
        ].join(' ')}
      >
        {/* Card Back */}
        <div className="card-face overflow-hidden rounded-xl shadow-[0_4px_12px_rgba(24,8,30,0.34)] transition-shadow duration-150 group-hover:shadow-[0_6px_16px_rgba(24,8,30,0.46)]">
          <CardBackArt pattern={theme.backPattern} accent={accent} />
        </div>

        {/* Card Front */}
        {isPortraitCard ? (
          <div
            className="card-face card-face-front overflow-hidden rounded-xl bg-[#f7efe0]"
            style={{
              boxShadow: card.isMatched
                ? `0 0 0 2px ${accent.backBorder}, 0 4px 16px ${accent.matchGlow}`
                : '0 4px 12px rgba(24, 8, 30, 0.3)',
            }}
          >
            <img
              src={symbol.imageSrc}
              alt={symbol.label}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover select-none"
            />
          </div>
        ) : (
          <div
            className="card-face card-face-front flex flex-col items-center justify-center overflow-hidden rounded-xl p-1.5"
            style={{
              backgroundColor: faceTint.bg,
              border: `2px solid ${card.isMatched ? accent.backBorder : faceTint.innerBorder}`,
              boxShadow: card.isMatched
                ? `0 0 0 1px ${accent.backBorder}, 0 4px 14px ${accent.matchGlow}`
                : '0 4px 12px rgba(24, 8, 30, 0.25)',
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-1 rounded-lg border"
              style={{
                borderColor: card.isMatched ? accent.backBorder : faceTint.innerBorder,
                opacity: card.isMatched ? 0.85 : 0.45,
              }}
            />

            <div
              className={[
                'relative z-10 flex items-center justify-center',
                compact ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-11 w-11 sm:h-13 sm:w-13',
              ].join(' ')}
            >
              {symbol.imageSrc ? (
                <span
                  className="text-center text-xs font-bold leading-tight"
                  style={{ color: faceTint.labelColor }}
                >
                  {symbol.label}
                </span>
              ) : (
                symbol.render('h-full w-full drop-shadow-[0_2px_4px_rgba(24,8,30,0.16)]')
              )}
            </div>

            {!compact && !symbol.imageSrc && (
              <span
                className="relative z-10 mt-0.5 max-w-full truncate px-1 text-[10px] font-semibold leading-tight tracking-tight"
                style={{ color: faceTint.labelColor }}
              >
                {symbol.label}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
};
