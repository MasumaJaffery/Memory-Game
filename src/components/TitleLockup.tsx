import React from 'react';

interface TitleLockupProps {
  compact?: boolean;
}

export const TitleLockup: React.FC<TitleLockupProps> = ({ compact = false }) => {
  return (
    <div className="flex flex-col items-center select-none pointer-events-none">
      <svg
        viewBox="0 0 460 112"
        className={compact ? 'h-12 w-auto max-w-full drop-shadow-[0_4px_14px_rgba(32,10,36,0.55)]' : 'h-16 xl:h-[76px] w-auto max-w-full drop-shadow-[0_6px_22px_rgba(34,11,40,0.65)]'}
        role="img"
        aria-label="Mirrorbound"
      >
        <defs>
          <linearGradient id="gold-wordmark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff7d6" />
            <stop offset="48%" stopColor="#f2c45a" />
            <stop offset="100%" stopColor="#b57818" />
          </linearGradient>
          <linearGradient id="crest-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8c1539" stopOpacity="0" />
            <stop offset="16%" stopColor="#7a1233" stopOpacity="0.94" />
            <stop offset="50%" stopColor="#45124d" stopOpacity="0.96" />
            <stop offset="84%" stopColor="#7a1233" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#8c1539" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ornamental filigree crest backdrop */}
        <path
          d="M28 56 Q230 42 432 56 Q230 98 28 56 Z"
          fill="url(#crest-ribbon)"
        />
        <rect x="44" y="26" width="372" height="58" rx="29" fill="#260c2b" fillOpacity="0.88" stroke="#e9c16b" strokeWidth="1.6" />
        <rect x="50" y="31" width="360" height="48" rx="24" fill="none" stroke="#f5dfa2" strokeWidth="0.7" strokeOpacity="0.5" />

        {/* Crowned diamond crest at top center */}
        <path
          d="M214 25 L221 12 L230 19 L239 12 L246 25 Z"
          fill="url(#gold-wordmark)"
          stroke="#4d2407"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="230" cy="9" r="2.6" fill="#e6305d" stroke="#fff3c4" strokeWidth="1" />

        {/* Side filigree scrolls */}
        <path
          d="M20 55 C28 45 36 45 43 55 C36 65 28 65 20 55 Z"
          fill="#e9c16b"
          stroke="#4d2407"
          strokeWidth="1.2"
        />
        <path
          d="M440 55 C432 45 424 45 417 55 C424 65 432 65 440 55 Z"
          fill="#e9c16b"
          stroke="#4d2407"
          strokeWidth="1.2"
        />

        {/* Primary display title */}
        <text
          x="230"
          y="67"
          textAnchor="middle"
          fill="url(#gold-wordmark)"
          style={{
            fontFamily: '"Cinzel", Georgia, serif',
            fontWeight: 700,
            fontSize: '37px',
            letterSpacing: '0.11em',
          }}
        >
          MIRRORBOUND
        </text>
      </svg>
    </div>
  );
};
