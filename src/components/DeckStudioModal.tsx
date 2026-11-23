import React, { useState } from 'react';
import { Check, RotateCw, X } from 'lucide-react';
import type {
  AccentId,
  BackPatternId,
  DeckTheme,
  FaceTintId,
  SymbolPackId,
} from '../types/game';
import {
  ACCENT_SPECS,
  BACK_PATTERNS,
  CardBackArt,
  FACE_TINT_SPECS,
  PRESET_THEMES,
  SYMBOL_PACK_META,
  SYMBOL_PACKS,
} from '../data/deckThemes';
import { soundEngine } from '../utils/sound';

interface DeckStudioModalProps {
  activeTheme: DeckTheme;
  customTheme: DeckTheme;
  onSelectTheme: (theme: DeckTheme) => void;
  onSaveCustomTheme: (theme: DeckTheme) => void;
  onClose: () => void;
}

export const DeckStudioModal: React.FC<DeckStudioModalProps> = ({
  activeTheme,
  customTheme,
  onSelectTheme,
  onSaveCustomTheme,
  onClose,
}) => {
  const [tab, setTab] = useState<'presets' | 'custom'>(activeTheme.isCustom ? 'custom' : 'presets');
  const [draft, setDraft] = useState<DeckTheme>(customTheme);
  const [previewFlipped, setPreviewFlipped] = useState(false);

  const previewTheme = tab === 'custom' ? draft : activeTheme;
  const previewAccent = ACCENT_SPECS[previewTheme.accentId];
  const previewFace = FACE_TINT_SPECS[previewTheme.faceTint];
  const previewPack = SYMBOL_PACKS[previewTheme.symbolPack];

  const handleApplyCustom = () => {
    soundEngine.playMatch(2);
    const cleaned: DeckTheme = {
      ...draft,
      id: 'custom-studio',
      name: draft.name.trim().slice(0, 26) || 'My Custom Deck',
      subtitle: 'Custom crafted deck',
      isCustom: true,
    };
    onSaveCustomTheme(cleaned);
    onSelectTheme(cleaned);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#120616]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-studio-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#e5bd67]/40 bg-[#210e29] text-[#fffaf2] shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#fffaf2]/10 px-6 py-4">
          <div>
            <h2
              id="deck-studio-title"
              className="text-xl font-bold tracking-wide text-[#f7dca0]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Deck Themes
            </h2>
            <p className="mt-0.5 text-xs text-[#e5d2eb]/75">
              Choose a curated deck or craft your own card back, palette, and emblems.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            aria-label="Close Deck Themes"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#fffaf2]/15 text-[#fffaf2]/80 transition-colors hover:bg-[#fffaf2]/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c86b]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Segmented Mode Tabs */}
        <div className="flex items-center justify-between gap-4 border-b border-[#fffaf2]/10 px-6 py-3">
          <div className="inline-flex rounded-lg bg-[#14071a] p-1">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setTab('presets');
              }}
              className={[
                'rounded-md px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors',
                tab === 'presets'
                  ? 'bg-[#7d173b] text-[#fffaf2] shadow-sm'
                  : 'text-[#d9c3e0] hover:text-white',
              ].join(' ')}
            >
              Curated Decks
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setTab('custom');
              }}
              className={[
                'rounded-md px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors',
                tab === 'custom'
                  ? 'bg-[#7d173b] text-[#fffaf2] shadow-sm'
                  : 'text-[#d9c3e0] hover:text-white',
              ].join(' ')}
            >
              Custom Studio
            </button>
          </div>

          <span className="hidden text-xs text-[#e5d2eb]/70 sm:inline">
            Active: <strong className="font-semibold text-[#f7dca0]">{activeTheme.name}</strong>
          </span>
        </div>

        {/* Body */}
        <div className="storybook-scroll grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-[1fr_210px]">
          {tab === 'presets' ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PRESET_THEMES.map((theme) => {
                const isSelected = activeTheme.id === theme.id;
                const accent = ACCENT_SPECS[theme.accentId];
                const face = FACE_TINT_SPECS[theme.faceTint];
                const pack = SYMBOL_PACKS[theme.symbolPack];

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playFlip();
                      onSelectTheme(theme);
                    }}
                    className={[
                      'group flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-150',
                      isSelected
                        ? 'border-[#f0c869] bg-[#33163f]'
                        : 'border-[#fffaf2]/12 bg-[#1a0a21] hover:border-[#e5bd67]/45 hover:bg-[#271030]',
                    ].join(' ')}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#fffaf2]">{theme.name}</span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#f5d073]">
                          <Check className="h-3.5 w-3.5" /> Selected
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[#d6bfd9]">{theme.subtitle}</p>

                    {/* Mini card back + 3 sample cards/symbols */}
                    <div className="mt-3 flex w-full items-center gap-2.5">
                      <div className="h-14 w-10 shrink-0 overflow-hidden rounded-md shadow-sm">
                        <CardBackArt pattern={theme.backPattern} accent={accent} />
                      </div>
                      {pack[0]?.imageSrc ? (
                        <div className="flex flex-1 items-center justify-around gap-1.5 rounded-lg bg-[#120618]/80 px-2 py-1.5 border border-[#fffaf2]/10">
                          {pack.slice(0, 3).map((sym) => (
                            <div key={sym.key} className="aspect-[391/578] h-12 overflow-hidden rounded shadow-sm">
                              {sym.render('h-full w-full object-cover')}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-1 items-center justify-around rounded-lg px-2 py-2" style={{ backgroundColor: face.bg, border: `1px solid ${face.innerBorder}` }}>
                          {pack.slice(0, 3).map((sym) => (
                            <div key={sym.key} className="h-8 w-8">
                              {sym.render('h-full w-full')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Custom Name */}
              <div>
                <label htmlFor="custom-deck-name" className="block text-xs font-semibold text-[#f3d48c]">
                  Deck Name
                </label>
                <input
                  id="custom-deck-name"
                  type="text"
                  maxLength={26}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="My Custom Deck"
                  className="mt-1.5 w-full rounded-lg border border-[#fffaf2]/15 bg-[#15081b] px-3.5 py-2.5 text-sm text-[#fffaf2] placeholder:text-[#b69bbd]/60 focus:border-[#f0c869] focus:outline-none"
                />
              </div>

              {/* Symbol Pack */}
              <div>
                <span className="block text-xs font-semibold text-[#f3d48c]">Symbol Artwork</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {SYMBOL_PACK_META.map((pack) => {
                    const selected = draft.symbolPack === pack.id;
                    return (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDraft({ ...draft, symbolPack: pack.id as SymbolPackId });
                          setPreviewFlipped(true);
                        }}
                        className={[
                          'rounded-lg border px-3 py-2 text-left transition-colors',
                          selected
                            ? 'border-[#f0c869] bg-[#381745] text-white'
                            : 'border-[#fffaf2]/12 bg-[#16081d] text-[#d6bfd9] hover:border-[#fffaf2]/30',
                        ].join(' ')}
                      >
                        <div className="text-xs font-semibold">{pack.label}</div>
                        <div className="mt-0.5 truncate text-[11px] text-[#c3abc7]">{pack.blurb}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Back Pattern */}
              <div>
                <span className="block text-xs font-semibold text-[#f3d48c]">Card Back Pattern</span>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {BACK_PATTERNS.map((pat) => {
                    const selected = draft.backPattern === pat.id;
                    return (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setDraft({ ...draft, backPattern: pat.id as BackPatternId });
                          setPreviewFlipped(false);
                        }}
                        className={[
                          'rounded-lg border px-2.5 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                          selected
                            ? 'border-[#f0c869] bg-[#381745] text-white'
                            : 'border-[#fffaf2]/12 bg-[#16081d] text-[#d6bfd9] hover:border-[#fffaf2]/30',
                        ].join(' ')}
                      >
                        {pat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent & Face Tint Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <span className="block text-xs font-semibold text-[#f3d48c]">Back Velvet Color</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Object.keys(ACCENT_SPECS) as AccentId[]).map((id) => {
                      const spec = ACCENT_SPECS[id];
                      const selected = draft.accentId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setDraft({ ...draft, accentId: id });
                            setPreviewFlipped(false);
                          }}
                          title={spec.label}
                          aria-label={spec.label}
                          className={[
                            'flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-transform hover:scale-105',
                            selected ? 'border-[#f7d881] scale-105' : 'border-transparent',
                          ].join(' ')}
                          style={{ backgroundColor: spec.swatch }}
                        >
                          {selected && <Check className="h-4 w-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#f3d48c]">Card Face Surface</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Object.keys(FACE_TINT_SPECS) as FaceTintId[]).map((id) => {
                      const spec = FACE_TINT_SPECS[id];
                      const selected = draft.faceTint === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            soundEngine.playClick();
                            setDraft({ ...draft, faceTint: id });
                            setPreviewFlipped(true);
                          }}
                          title={spec.label}
                          aria-label={spec.label}
                          className={[
                            'flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-transform hover:scale-105',
                            selected ? 'border-[#f7d881] scale-105' : 'border-[#fffaf2]/25',
                          ].join(' ')}
                          style={{ backgroundColor: spec.swatch }}
                        >
                          {selected && (
                            <Check
                              className="h-4 w-4"
                              style={{ color: spec.isDark ? '#f7e9c8' : '#4a1d2d' }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Interactive 3D Card Preview */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#fffaf2]/10 bg-[#15071b] p-4">
            <span className="text-xs font-semibold text-[#f3d48c]">Live Preview</span>
            <p className="mt-0.5 text-[11px] text-[#c7b0cc]">Click card to flip</p>

            <button
              type="button"
              onClick={() => {
                soundEngine.playFlip();
                setPreviewFlipped((p) => !p);
              }}
              aria-label="Flip preview card"
              className="card-scene mt-4 h-44 w-32 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f2c86b]"
            >
              <div className={`card-inner rounded-xl ${previewFlipped ? 'is-flipped' : ''}`}>
                <div className="card-face overflow-hidden rounded-xl shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
                  <CardBackArt pattern={previewTheme.backPattern} accent={previewAccent} />
                </div>
                {previewPack[0].imageSrc ? (
                  <div
                    className="card-face card-face-front overflow-hidden rounded-xl shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                    style={{
                      border: `2px solid ${previewAccent.backBorder}`,
                    }}
                  >
                    {previewPack[0].render('h-full w-full object-cover')}
                  </div>
                ) : (
                  <div
                    className="card-face card-face-front flex flex-col items-center justify-center rounded-xl p-3 shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                    style={{
                      backgroundColor: previewFace.bg,
                      border: `2px solid ${previewAccent.backBorder}`,
                    }}
                  >
                    <div className="h-20 w-20">{previewPack[0].render('h-full w-full')}</div>
                    <span
                      className="mt-2 text-xs font-semibold"
                      style={{ color: previewFace.labelColor }}
                    >
                      {previewPack[0].label}
                    </span>
                  </div>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playFlip();
                setPreviewFlipped((p) => !p);
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#e5d2eb] transition-colors hover:text-[#f7dca0]"
            >
              <RotateCw className="h-3.5 w-3.5" />
              {previewFlipped ? 'Show Back' : 'Show Face'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#fffaf2]/10 px-6 py-3.5">
          {tab === 'custom' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#fffaf2]/15 px-4 py-2 text-xs font-semibold text-[#e5d2eb] whitespace-nowrap transition-colors hover:bg-[#fffaf2]/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="rounded-lg bg-[#d9a236] px-5 py-2 text-xs font-bold text-[#210d24] whitespace-nowrap shadow-sm transition-colors hover:bg-[#e8b449]"
              >
                Save & Use Deck
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="rounded-lg bg-[#d9a236] px-5 py-2 text-xs font-bold text-[#210d24] whitespace-nowrap shadow-sm transition-colors hover:bg-[#e8b449]"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
