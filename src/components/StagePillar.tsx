import React from 'react';

interface StagePillarProps {
  side: 'left' | 'right';
}

export const StagePillar: React.FC<StagePillarProps> = ({ side }) => {
  const isLeft = side === 'left';

  return (
    <aside
      aria-hidden="true"
      className={[
        'pointer-events-none relative hidden h-full min-w-[28px] flex-1 select-none overflow-hidden lg:flex',
        isLeft
          ? 'border-r border-[#e5bd67]/45 shadow-[10px_0_30px_rgba(10,3,16,0.75)]'
          : 'border-l border-[#e5bd67]/45 shadow-[-10px_0_30px_rgba(10,3,16,0.75)]',
      ].join(' ')}
    >
      {/* Clean Cylindrical Architectural Column Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isLeft
            ? 'linear-gradient(90deg, #16071c 0%, #2a0e35 30%, #3b1548 52%, #280d32 78%, #17071d 100%)'
            : 'linear-gradient(90deg, #17071d 0%, #280d32 22%, #3b1548 48%, #2a0e35 70%, #16071c 100%)',
        }}
      />

      {/* Subtle Minimal Fluted Vertical Grooves */}
      <div
        className="absolute inset-x-4 inset-y-14 opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0px, transparent 14px, rgba(247, 216, 129, 0.14) 15px, rgba(12, 3, 18, 0.45) 17px, transparent 22px)',
        }}
      />

      {/* Minimal Hairline Gold Trim Lines */}
      <div className="absolute inset-y-12 left-3 w-px bg-gradient-to-b from-transparent via-[#e5bd67]/35 to-transparent" />
      <div className="absolute inset-y-12 right-3 w-px bg-gradient-to-b from-transparent via-[#e5bd67]/35 to-transparent" />

      {/* Minimal Top Capital Crown */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col">
        <div className="h-3.5 w-full border-b border-[#6e460b] bg-gradient-to-r from-[#8f5e14] via-[#ecc365] to-[#8f5e14]" />
        <div className="h-2.5 w-full border-b border-[#e5bd67]/40 bg-[#230b2c]" />
        <div className="mx-2 h-1.5 rounded-b border-x border-b border-[#e5bd67]/45 bg-gradient-to-r from-[#7d500f] via-[#dfa83c] to-[#7d500f]" />
      </div>

      {/* Minimal Center Diamond Accent */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-2.5 w-2.5 rotate-45 border border-[#e5bd67]/40 bg-[#230b2c]/80" />
      </div>

      {/* Minimal Bottom Plinth Base */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col">
        <div className="mx-2 h-1.5 rounded-t border-x border-t border-[#e5bd67]/45 bg-gradient-to-r from-[#7d500f] via-[#dfa83c] to-[#7d500f]" />
        <div className="h-2.5 w-full border-t border-[#e5bd67]/40 bg-[#230b2c]" />
        <div className="h-4 w-full border-t border-[#6e460b] bg-gradient-to-r from-[#8f5e14] via-[#ecc365] to-[#8f5e14]" />
      </div>

      {/* Soft Vertical Cylindrical Shading */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background:
            'linear-gradient(90deg, rgba(10,2,14,0.5) 0%, transparent 25%, rgba(255,235,175,0.04) 50%, transparent 75%, rgba(10,2,14,0.5) 100%)',
        }}
      />
    </aside>
  );
};
