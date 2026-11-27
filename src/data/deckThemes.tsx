import React from 'react';
import type {
  AccentId,
  BackPatternId,
  DeckTheme,
  FaceTintId,
  SymbolPackId,
} from '../types/game';

export interface AccentSpec {
  id: AccentId;
  label: string;
  backBg: string;
  backMid: string;
  backBorder: string;
  patternStroke: string;
  swatch: string;
  matchGlow: string;
  badgeColor: string;
}

export const ACCENT_SPECS: Record<AccentId, AccentSpec> = {
  crimson: {
    id: 'crimson',
    label: 'Royal Crimson',
    backBg: '#6e102b',
    backMid: '#9c1c42',
    backBorder: '#e9c372',
    patternStroke: '#f3d997',
    swatch: '#a61c43',
    matchGlow: 'rgba(233, 195, 114, 0.72)',
    badgeColor: '#9c1c42',
  },
  plum: {
    id: 'plum',
    label: 'Enchanted Plum',
    backBg: '#3a144e',
    backMid: '#63247f',
    backBorder: '#e2c2f5',
    patternStroke: '#ecd6fa',
    swatch: '#63247f',
    matchGlow: 'rgba(206, 152, 245, 0.72)',
    badgeColor: '#63247f',
  },
  teal: {
    id: 'teal',
    label: 'Teapot Teal',
    backBg: '#0c424c',
    backMid: '#156a78',
    backBorder: '#f0cf7b',
    patternStroke: '#f7dfa0',
    swatch: '#156a78',
    matchGlow: 'rgba(65, 204, 212, 0.65)',
    badgeColor: '#156a78',
  },
  amber: {
    id: 'amber',
    label: 'Gilded Amber',
    backBg: '#5e3409',
    backMid: '#965410',
    backBorder: '#fce194',
    patternStroke: '#fdeab3',
    swatch: '#b86c16',
    matchGlow: 'rgba(250, 204, 80, 0.72)',
    badgeColor: '#965410',
  },
  sapphire: {
    id: 'sapphire',
    label: 'Midnight Sapphire',
    backBg: '#122252',
    backMid: '#213c85',
    backBorder: '#e7c97a',
    patternStroke: '#f4dda0',
    swatch: '#244294',
    matchGlow: 'rgba(130, 175, 255, 0.7)',
    badgeColor: '#213c85',
  },
  emerald: {
    id: 'emerald',
    label: 'Conservatory Green',
    backBg: '#0e3d2b',
    backMid: '#186346',
    backBorder: '#ebd083',
    patternStroke: '#f5e1a8',
    swatch: '#196b4c',
    matchGlow: 'rgba(110, 224, 168, 0.68)',
    badgeColor: '#186346',
  },
};

export interface FaceTintSpec {
  id: FaceTintId;
  label: string;
  bg: string;
  innerBorder: string;
  labelColor: string;
  swatch: string;
  isDark: boolean;
}

export const FACE_TINT_SPECS: Record<FaceTintId, FaceTintSpec> = {
  ivory: {
    id: 'ivory',
    label: 'Parchment Ivory',
    bg: '#fffaf0',
    innerBorder: '#e2c789',
    labelColor: '#4a1d2d',
    swatch: '#fff6e3',
    isDark: false,
  },
  frost: {
    id: 'frost',
    label: 'Mirror Frost',
    bg: '#f2f8ff',
    innerBorder: '#a8cbe8',
    labelColor: '#1c3454',
    swatch: '#e5f2ff',
    isDark: false,
  },
  rosewater: {
    id: 'rosewater',
    label: 'Rosewater Silk',
    bg: '#fff2f6',
    innerBorder: '#e3a6ba',
    labelColor: '#5c1830',
    swatch: '#ffe6ee',
    isDark: false,
  },
  obsidian: {
    id: 'obsidian',
    label: 'Velvet Obsidian',
    bg: '#1c1528',
    innerBorder: '#c9a455',
    labelColor: '#f7e9c8',
    swatch: '#1c1528',
    isDark: true,
  },
};

export const BACK_PATTERNS: { id: BackPatternId; label: string }[] = [
  { id: 'filigree', label: 'Royal Filigree' },
  { id: 'diamond', label: 'Velvet Diamond' },
  { id: 'lattice', label: 'Ribbon Lattice' },
  { id: 'starburst', label: 'Starburst Crest' },
];

export const SYMBOL_PACK_META: { id: SymbolPackId; label: string; blurb: string }[] = [
  { id: 'portraits', label: 'Ever After Cast', blurb: 'All 10 illustrated character portrait cards' },
  { id: 'storybook', label: 'Royal Storybook', blurb: 'Crowns, apples, mirrors, and golden teapots' },
  { id: 'wonderland', label: 'Wonderland Tea', blurb: 'Mad hats, teacups, rabbits, and jam tarts' },
  { id: 'celestial', label: 'Celestial Arcana', blurb: 'Moons, astrolabes, owls, and star compasses' },
  { id: 'botanical', label: 'Botanical Press', blurb: 'Roses, luna moths, honeybees, and ferns' },
];

export const PRESET_THEMES: DeckTheme[] = [
  {
    id: 'ever-after-portraits',
    name: 'Ever After Cast',
    subtitle: '10 illustrated character portrait cards',
    symbolPack: 'portraits',
    backPattern: 'filigree',
    accentId: 'crimson',
    faceTint: 'ivory',
  },
  {
    id: 'royal-storybook',
    name: 'Royal Storybook',
    subtitle: 'Crimson velvet & gilded crowns',
    symbolPack: 'storybook',
    backPattern: 'filigree',
    accentId: 'crimson',
    faceTint: 'ivory',
  },
  {
    id: 'wonderland-tea',
    name: 'Wonderland Tea',
    subtitle: 'Teapot teal & curious charms',
    symbolPack: 'wonderland',
    backPattern: 'lattice',
    accentId: 'teal',
    faceTint: 'rosewater',
  },
  {
    id: 'celestial-arcana',
    name: 'Celestial Arcana',
    subtitle: 'Enchanted plum & starlight gold',
    symbolPack: 'celestial',
    backPattern: 'starburst',
    accentId: 'plum',
    faceTint: 'obsidian',
  },
  {
    id: 'botanical-conservatory',
    name: 'Botanical Conservatory',
    subtitle: 'Emerald foil & pressed flora',
    symbolPack: 'botanical',
    backPattern: 'diamond',
    accentId: 'emerald',
    faceTint: 'ivory',
  },
];

const CUSTOM_THEME_KEY = 'mirrorbound_custom_theme_v1';
const ACTIVE_THEME_KEY = 'mirrorbound_active_theme_id_v2';

export function loadCustomTheme(): DeckTheme {
  try {
    const raw = localStorage.getItem(CUSTOM_THEME_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DeckTheme>;
      if (parsed && parsed.symbolPack && parsed.backPattern && parsed.accentId && parsed.faceTint) {
        return {
          id: 'custom-studio',
          name: (parsed.name || 'My Custom Deck').slice(0, 26),
          subtitle: 'Custom crafted deck',
          symbolPack: parsed.symbolPack,
          backPattern: parsed.backPattern,
          accentId: parsed.accentId,
          faceTint: parsed.faceTint,
          isCustom: true,
        };
      }
    }
  } catch {
    // Fallback below
  }
  return {
    id: 'custom-studio',
    name: 'My Custom Deck',
    subtitle: 'Custom crafted deck',
    symbolPack: 'storybook',
    backPattern: 'starburst',
    accentId: 'sapphire',
    faceTint: 'frost',
    isCustom: true,
  };
}

export function saveCustomTheme(theme: DeckTheme): void {
  try {
    localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify({ ...theme, id: 'custom-studio', isCustom: true }));
  } catch {
    // Ignore
  }
}

export function loadActiveThemeId(): string {
  try {
    return localStorage.getItem(ACTIVE_THEME_KEY) || PRESET_THEMES[0].id;
  } catch {
    return PRESET_THEMES[0].id;
  }
}

export function saveActiveThemeId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_THEME_KEY, id);
  } catch {
    // Ignore
  }
}

export interface SymbolDefinition {
  key: string;
  label: string;
  imageSrc?: string;
  render: (className?: string) => React.ReactNode;
}

export const CHARACTER_CARD_IMAGES: string[] = [
  '/assets/my-studio/Raven_Queen_Card_44902fdc.png',
  '/assets/my-studio/Madeline_Hatter_Card_1de97ffd.png',
  '/assets/my-studio/Briar_Beauty_Card_d3b8b964.png',
  '/assets/my-studio/Blondie_Lockes_Card_e9e4139f.png',
  '/assets/my-studio/Lizzie_Hearts_Card_5c2015e5.png',
  '/assets/my-studio/Holly_O_Hair_Card_277d0822.png',
  '/assets/my-studio/Duchess_Swan_Card_91e16072.png',
  '/assets/my-studio/Dexter_Charming_Card_fc524164.png',
  '/assets/my-studio/C.A_Cupid_Card_d779f091.png',
  '/assets/my-studio/Hunter_Huntsman_Card_190b7f64.png',
];

const PORTRAIT_SYMBOLS: SymbolDefinition[] = [
  {
    key: 'raven-queen',
    label: 'Raven Queen',
    imageSrc: '/assets/my-studio/Raven_Queen_Card_44902fdc.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Raven_Queen_Card_44902fdc.png"
        alt="Raven Queen"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'madeline-hatter',
    label: 'Madeline Hatter',
    imageSrc: '/assets/my-studio/Madeline_Hatter_Card_1de97ffd.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Madeline_Hatter_Card_1de97ffd.png"
        alt="Madeline Hatter"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'briar-beauty',
    label: 'Briar Beauty',
    imageSrc: '/assets/my-studio/Briar_Beauty_Card_d3b8b964.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Briar_Beauty_Card_d3b8b964.png"
        alt="Briar Beauty"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'blondie-lockes',
    label: 'Blondie Lockes',
    imageSrc: '/assets/my-studio/Blondie_Lockes_Card_e9e4139f.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Blondie_Lockes_Card_e9e4139f.png"
        alt="Blondie Lockes"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'lizzie-hearts',
    label: 'Lizzie Hearts',
    imageSrc: '/assets/my-studio/Lizzie_Hearts_Card_5c2015e5.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Lizzie_Hearts_Card_5c2015e5.png"
        alt="Lizzie Hearts"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'holly-ohair',
    label: "Holly O'Hair",
    imageSrc: '/assets/my-studio/Holly_O_Hair_Card_277d0822.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Holly_O_Hair_Card_277d0822.png"
        alt="Holly O'Hair"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'duchess-swan',
    label: 'Duchess Swan',
    imageSrc: '/assets/my-studio/Duchess_Swan_Card_91e16072.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Duchess_Swan_Card_91e16072.png"
        alt="Duchess Swan"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'dexter-charming',
    label: 'Dexter Charming',
    imageSrc: '/assets/my-studio/Dexter_Charming_Card_fc524164.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Dexter_Charming_Card_fc524164.png"
        alt="Dexter Charming"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'ca-cupid',
    label: 'C.A. Cupid',
    imageSrc: '/assets/my-studio/C.A_Cupid_Card_d779f091.png',
    render: (c) => (
      <img
        src="/assets/my-studio/C.A_Cupid_Card_d779f091.png"
        alt="C.A. Cupid"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
  {
    key: 'hunter-huntsman',
    label: 'Hunter Huntsman',
    imageSrc: '/assets/my-studio/Hunter_Huntsman_Card_190b7f64.png',
    render: (c) => (
      <img
        src="/assets/my-studio/Hunter_Huntsman_Card_190b7f64.png"
        alt="Hunter Huntsman"
        referrerPolicy="no-referrer"
        draggable={false}
        className={c}
      />
    ),
  },
];

const STORYBOOK_SYMBOLS: SymbolDefinition[] = [
  {
    key: 'crown',
    label: 'Royal Crown',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M10 46 L14 22 L25 33 L32 16 L39 33 L50 22 L54 46 Z" fill="#f5c049" stroke="#784209" strokeWidth="2.4" strokeLinejoin="round" />
        <rect x="11" y="45" width="42" height="7" rx="3" fill="#c72149" stroke="#784209" strokeWidth="2.2" />
        <circle cx="32" cy="14" r="3.5" fill="#d92652" stroke="#784209" strokeWidth="1.8" />
        <circle cx="13" cy="20" r="3" fill="#fbe299" stroke="#784209" strokeWidth="1.6" />
        <circle cx="51" cy="20" r="3" fill="#fbe299" stroke="#784209" strokeWidth="1.6" />
        <circle cx="32" cy="48.5" r="2.2" fill="#fde59c" />
        <circle cx="21" cy="48.5" r="1.8" fill="#fde59c" />
        <circle cx="43" cy="48.5" r="1.8" fill="#fde59c" />
      </svg>
    ),
  },
  {
    key: 'apple',
    label: 'Crimson Apple',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 21 C24 14 12 20 13 34 C14 47 23 55 32 52 C41 55 50 47 51 34 C52 20 40 14 32 21 Z" fill="#d61f47" stroke="#630b20" strokeWidth="2.4" />
        <path d="M21 26 C19 31 19 37 22 41" stroke="#ff9db2" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M32 21 C32 15 35 11 38 9" stroke="#6b3c14" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M34 15 C41 10 48 13 46 19 C42 21 36 20 34 15 Z" fill="#2d9c5a" stroke="#14542e" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'mirror',
    label: 'Magic Mirror',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <ellipse cx="32" cy="26" rx="16" ry="20" fill="#e6b64c" stroke="#6e410b" strokeWidth="2.4" />
        <ellipse cx="32" cy="26" rx="11.5" ry="15" fill="#bce6fa" stroke="#7c5617" strokeWidth="1.6" />
        <path d="M25 18 L34 14 M24 27 L38 20" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <path d="M28 45 L36 45 L34 57 C34 58.5 30 58.5 30 57 Z" fill="#d49b2f" stroke="#6e410b" strokeWidth="2.2" />
        <circle cx="32" cy="6" r="2.8" fill="#c92350" stroke="#6e410b" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'teapot',
    label: 'Golden Teapot',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M46 29 C54 27 56 39 47 41" fill="none" stroke="#188794" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 33 C12 31 10 25 9 23 C12 22 15 24 19 28" fill="#f3bf3f" stroke="#6e4309" strokeWidth="2.2" strokeLinejoin="round" />
        <ellipse cx="33" cy="37" rx="15" ry="13" fill="#f5c84c" stroke="#6e4309" strokeWidth="2.4" />
        <path d="M22 33 Q33 38 44 33" fill="none" stroke="#1993a1" strokeWidth="3.2" />
        <ellipse cx="33" cy="24" rx="9" ry="3.5" fill="#1993a1" stroke="#0d4e57" strokeWidth="2" />
        <circle cx="33" cy="19" r="3" fill="#f5c84c" stroke="#6e4309" strokeWidth="1.8" />
        <path d="M24 49 L42 49" stroke="#6e4309" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'spellbook',
    label: 'Spellbook',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <rect x="14" y="10" width="36" height="44" rx="4" fill="#6b2287" stroke="#360c47" strokeWidth="2.4" />
        <rect x="14" y="10" width="8" height="44" rx="2" fill="#4d1463" stroke="#360c47" strokeWidth="2" />
        <rect x="26" y="18" width="18" height="28" rx="2" fill="none" stroke="#f0c760" strokeWidth="2" />
        <path d="M35 24 L37 30 L43 32 L37 34 L35 40 L33 34 L27 32 L33 30 Z" fill="#f8d878" />
        <path d="M50 18 L54 18 L54 46 L50 46" fill="#fff7e6" stroke="#805e2d" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    key: 'key',
    label: 'Jeweled Key',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="22" cy="24" r="11" fill="#f5c349" stroke="#754409" strokeWidth="2.4" />
        <circle cx="22" cy="24" r="5" fill="#d92652" stroke="#754409" strokeWidth="1.8" />
        <path d="M31 31 L52 52 M44 44 L49 39 M48 48 L54 42" stroke="#f5c349" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M31 31 L52 52 M44 44 L49 39 M48 48 L54 42" stroke="#754409" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'rose',
    label: 'Velvet Rose',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 36 L32 56" stroke="#227545" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M32 45 C24 44 20 39 22 36 C27 36 31 40 32 45 Z" fill="#32a160" stroke="#16522e" strokeWidth="1.8" />
        <path d="M32 48 C40 47 44 42 42 39 C37 39 33 43 32 48 Z" fill="#32a160" stroke="#16522e" strokeWidth="1.8" />
        <circle cx="32" cy="24" r="13" fill="#d6204e" stroke="#690a23" strokeWidth="2.2" />
        <path d="M25 22 C26 16 37 16 38 23 C39 29 28 31 27 25 C27 21 34 20 34 24" fill="none" stroke="#ff9db5" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'slipper',
    label: 'Glass Slipper',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M12 38 C16 38 22 36 28 28 L33 21 C38 28 45 36 53 38 C55 41 53 45 48 46 L14 46 C10 46 10 41 12 38 Z" fill="#9bd7f7" stroke="#235c8a" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M46 46 L48 54 L53 54 L51 45" fill="#7dc6f0" stroke="#235c8a" strokeWidth="2" strokeLinejoin="round" />
        <path d="M22 41 L35 41" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="17" cy="39" r="3" fill="#f7cf63" stroke="#85530c" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'castle',
    label: 'Castle Spire',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <rect x="16" y="30" width="32" height="24" fill="#ecd6f7" stroke="#4d1f66" strokeWidth="2.2" />
        <rect x="26" y="18" width="12" height="36" fill="#f7e9ff" stroke="#4d1f66" strokeWidth="2.2" />
        <polygon points="32,6 24,19 40,19" fill="#c92350" stroke="#5c0d23" strokeWidth="2" />
        <polygon points="18,18 12,30 24,30" fill="#7d2da8" stroke="#3c1154" strokeWidth="2" />
        <polygon points="46,18 40,30 52,30" fill="#7d2da8" stroke="#3c1154" strokeWidth="2" />
        <path d="M28 54 L28 43 A4 4 0 0 1 36 43 L36 54 Z" fill="#f0bd48" stroke="#5e3a08" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'watch',
    label: 'Pocket Watch',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="32" cy="13" r="4.5" fill="none" stroke="#c99322" strokeWidth="2.8" />
        <rect x="29" y="15" width="6" height="5" rx="1.5" fill="#e6b23c" stroke="#6e440a" strokeWidth="1.6" />
        <circle cx="32" cy="37" r="17" fill="#f2bf44" stroke="#6e440a" strokeWidth="2.4" />
        <circle cx="32" cy="37" r="12.5" fill="#fffaf0" stroke="#9e6d19" strokeWidth="1.6" />
        <path d="M32 37 L32 28 M32 37 L39 40" stroke="#421a2d" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="37" r="2" fill="#c92350" />
      </svg>
    ),
  },
  {
    key: 'tiara',
    label: 'Crystal Tiara',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M10 44 C18 39 46 39 54 44 C50 31 44 26 39 32 C36 22 34 16 32 14 C30 16 28 22 25 32 C20 26 14 31 10 44 Z" fill="#f497c1" stroke="#751742" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="32,20 35,27 32,33 29,27" fill="#ffffff" stroke="#751742" strokeWidth="1.5" />
        <circle cx="21" cy="34" r="2.6" fill="#fff4c4" stroke="#751742" strokeWidth="1.3" />
        <circle cx="43" cy="34" r="2.6" fill="#fff4c4" stroke="#751742" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    key: 'feather',
    label: 'Swan Feather',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M49 12 C34 13 20 24 17 42 C28 45 45 36 49 12 Z" fill="#e6f5ff" stroke="#2c5c85" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M48 13 L13 53" stroke="#d49b2f" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M35 20 L31 27 M41 25 L34 29 M28 30 L24 36" stroke="#6aa6d4" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

const WONDERLAND_SYMBOLS: SymbolDefinition[] = [
  {
    key: 'hat',
    label: 'Mad Top Hat',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M18 14 L46 14 L42 44 L22 44 Z" fill="#7d229c" stroke="#360a47" strokeWidth="2.4" strokeLinejoin="round" />
        <rect x="20" y="34" width="24" height="8" fill="#189ba6" stroke="#0b4d54" strokeWidth="1.8" />
        <ellipse cx="32" cy="46" rx="22" ry="6" fill="#9a2cc2" stroke="#360a47" strokeWidth="2.4" />
        <rect x="34" y="21" width="9" height="11" rx="1.5" fill="#fff8e3" stroke="#785212" strokeWidth="1.5" transform="rotate(8 38 26)" />
      </svg>
    ),
  },
  {
    key: 'teacup',
    label: 'Tea Cup',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M45 27 C53 27 53 39 44 39" fill="none" stroke="#d92964" strokeWidth="3.8" strokeLinecap="round" />
        <path d="M16 24 L46 24 C46 39 40 46 31 46 C22 46 16 39 16 24 Z" fill="#fce4ec" stroke="#85173d" strokeWidth="2.3" />
        <ellipse cx="31" cy="24" rx="15" ry="3.5" fill="#1c9ea8" stroke="#85173d" strokeWidth="1.8" />
        <ellipse cx="31" cy="49" rx="19" ry="4" fill="#f5c649" stroke="#784a0b" strokeWidth="2" />
        <circle cx="26" cy="34" r="2.2" fill="#d92964" />
        <circle cx="36" cy="34" r="2.2" fill="#d92964" />
      </svg>
    ),
  },
  {
    key: 'rabbit',
    label: 'White Rabbit',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <ellipse cx="25" cy="19" rx="5" ry="13" fill="#fff8f0" stroke="#523648" strokeWidth="2.2" transform="rotate(-10 25 19)" />
        <ellipse cx="39" cy="19" rx="5" ry="13" fill="#fff8f0" stroke="#523648" strokeWidth="2.2" transform="rotate(10 39 19)" />
        <ellipse cx="25" cy="20" rx="2.3" ry="8" fill="#f7a6be" transform="rotate(-10 25 20)" />
        <ellipse cx="39" cy="20" rx="2.3" ry="8" fill="#f7a6be" transform="rotate(10 39 20)" />
        <circle cx="32" cy="40" r="14" fill="#fff8f0" stroke="#523648" strokeWidth="2.3" />
        <circle cx="27" cy="38" r="2" fill="#3a1c2e" />
        <circle cx="37" cy="38" r="2" fill="#3a1c2e" />
        <polygon points="32,42 29.5,45 34.5,45" fill="#e85d87" />
      </svg>
    ),
  },
  {
    key: 'heart',
    label: "Queen's Heart",
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 54 C14 42 10 29 14 20 C18 12 28 13 32 21 C36 13 46 12 50 20 C54 29 50 42 32 54 Z" fill="#d91e46" stroke="#66091e" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M21 21 C18 24 18 29 20 32" stroke="#ff9db2" strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    key: 'mushroom',
    label: 'Toadstool',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M25 35 L39 35 L41 53 C41 55 23 55 23 53 Z" fill="#fff2d9" stroke="#6e4b20" strokeWidth="2.2" />
        <path d="M11 36 C11 18 22 11 32 11 C42 11 53 18 53 36 Z" fill="#e02b58" stroke="#6b0d24" strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="4" fill="#fff8e8" />
        <circle cx="39" cy="21" r="3.5" fill="#fff8e8" />
        <circle cx="35" cy="31" r="2.8" fill="#fff8e8" />
      </svg>
    ),
  },
  {
    key: 'tart',
    label: 'Jam Tart',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="32" cy="32" r="20" fill="#edb553" stroke="#7d4a0c" strokeWidth="2.4" />
        <circle cx="32" cy="32" r="14" fill="#c91c47" stroke="#7d4a0c" strokeWidth="1.8" />
        <path d="M22 25 L42 39 M22 39 L42 25" stroke="#f7cf79" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'potion',
    label: 'Elixir Vial',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <rect x="27" y="10" width="10" height="8" rx="2" fill="#c98d44" stroke="#5e3a0f" strokeWidth="2" />
        <path d="M26 18 L38 18 L38 25 L49 44 C51 49 47 54 41 54 L23 54 C17 54 13 49 15 44 L26 25 Z" fill="#d9f4fa" stroke="#185966" strokeWidth="2.3" />
        <path d="M18 43 L46 43 L47 46 C48 49 45 52 41 52 L23 52 C19 52 16 49 17 46 Z" fill="#21b8b8" />
        <circle cx="28" cy="47" r="2" fill="#c2ffff" />
        <circle cx="37" cy="45" r="1.6" fill="#c2ffff" />
      </svg>
    ),
  },
  {
    key: 'knight',
    label: 'Chess Knight',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M20 50 L44 50 L44 55 L20 55 Z" fill="#4f2269" stroke="#230b33" strokeWidth="2.2" />
        <path d="M23 50 C23 39 28 35 30 31 L20 33 L18 27 L27 17 L27 10 L35 14 C44 17 46 28 42 50 Z" fill="#8938b5" stroke="#2d0c42" strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="30" cy="21" r="2" fill="#fff2cc" />
      </svg>
    ),
  },
  {
    key: 'bowtie',
    label: 'Ribbon Bow',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 32 L12 19 C9 26 9 38 12 45 Z" fill="#18a3ad" stroke="#0c4d52" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M32 32 L52 19 C55 26 55 38 52 45 Z" fill="#18a3ad" stroke="#0c4d52" strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="32" cy="32" r="6.5" fill="#f5c042" stroke="#75470a" strokeWidth="2.2" />
      </svg>
    ),
  },
  {
    key: 'clock',
    label: 'Tea Clock',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="19" cy="17" r="6" fill="#f0bd42" stroke="#6e4409" strokeWidth="2.2" />
        <circle cx="45" cy="17" r="6" fill="#f0bd42" stroke="#6e4409" strokeWidth="2.2" />
        <circle cx="32" cy="35" r="18" fill="#d42456" stroke="#660b25" strokeWidth="2.4" />
        <circle cx="32" cy="35" r="13" fill="#fffaf0" />
        <path d="M32 35 L32 25 M32 35 L40 35" stroke="#3b1627" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'diamond',
    label: 'Gilded Diamond',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <polygon points="32,8 52,32 32,56 12,32" fill="#f0b637" stroke="#6e4208" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="32,16 44,32 32,48 20,32" fill="#fde395" />
      </svg>
    ),
  },
  {
    key: 'clover',
    label: 'Royal Club',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="32" cy="21" r="10" fill="#2c1d4a" stroke="#140b24" strokeWidth="2" />
        <circle cx="21" cy="35" r="10" fill="#2c1d4a" stroke="#140b24" strokeWidth="2" />
        <circle cx="43" cy="35" r="10" fill="#2c1d4a" stroke="#140b24" strokeWidth="2" />
        <path d="M29 38 L24 54 L40 54 L35 38 Z" fill="#2c1d4a" />
        <circle cx="32" cy="31" r="3" fill="#f2c44e" />
      </svg>
    ),
  },
];

const CELESTIAL_SYMBOLS: SymbolDefinition[] = [
  {
    key: 'moon',
    label: 'Crescent Moon',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M40 12 C25 14 15 26 17 40 C19 52 32 58 45 52 C34 51 28 42 28 32 C28 22 33 15 40 12 Z" fill="#f7cf59" stroke="#7d4f0a" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M45 20 L47 25 L52 27 L47 29 L45 34 L43 29 L38 27 L43 25 Z" fill="#b4d8ff" />
      </svg>
    ),
  },
  {
    key: 'sun',
    label: 'Radiant Sun',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <g stroke="#e08c1b" strokeWidth="3" strokeLinecap="round">
          <line x1="32" y1="7" x2="32" y2="15" />
          <line x1="32" y1="49" x2="32" y2="57" />
          <line x1="7" y1="32" x2="15" y2="32" />
          <line x1="49" y1="32" x2="57" y2="32" />
          <line x1="14" y1="14" x2="20" y2="20" />
          <line x1="44" y1="44" x2="50" y2="50" />
          <line x1="50" y1="14" x2="44" y2="20" />
          <line x1="20" y1="44" x2="14" y2="50" />
        </g>
        <circle cx="32" cy="32" r="13" fill="#f7c43e" stroke="#854a0a" strokeWidth="2.4" />
        <circle cx="32" cy="32" r="7.5" fill="#ffe694" />
      </svg>
    ),
  },
  {
    key: 'astrolabe',
    label: 'Astrolabe',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="32" cy="34" r="19" fill="none" stroke="#e8b846" strokeWidth="3.5" />
        <ellipse cx="32" cy="34" rx="19" ry="8" fill="none" stroke="#c89223" strokeWidth="2.2" transform="rotate(30 32 34)" />
        <ellipse cx="32" cy="34" rx="19" ry="8" fill="none" stroke="#c89223" strokeWidth="2.2" transform="rotate(-30 32 34)" />
        <circle cx="32" cy="34" r="4.5" fill="#7c56e8" stroke="#f7d877" strokeWidth="2" />
        <circle cx="32" cy="11" r="3.5" fill="none" stroke="#e8b846" strokeWidth="2.4" />
      </svg>
    ),
  },
  {
    key: 'orb',
    label: 'Crystal Orb',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="32" cy="28" r="17" fill="#7a54d9" stroke="#361a7a" strokeWidth="2.4" />
        <circle cx="26" cy="22" r="5" fill="#c7b5ff" opacity="0.8" />
        <path d="M19 49 L45 49 L41 42 L23 42 Z" fill="#e6b647" stroke="#6e450a" strokeWidth="2.2" strokeLinejoin="round" />
        <rect x="16" y="49" width="32" height="5" rx="2" fill="#c99324" stroke="#6e450a" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'comet',
    label: 'Shooting Star',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M12 46 Q25 38 36 28 M16 52 Q30 43 40 34" stroke="#69b8ff" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <polygon points="43,12 46.5,22 57,22 48.5,28 51.5,38 43,32 34.5,38 37.5,28 29,22 39.5,22" fill="#f7cc4a" stroke="#7d4c08" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'owl',
    label: 'Star Owl',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M18 22 C18 14 25 13 32 15 C39 13 46 14 46 22 L48 44 C48 52 40 55 32 55 C24 55 16 52 16 44 Z" fill="#7e5b9c" stroke="#321b47" strokeWidth="2.3" />
        <circle cx="25" cy="28" r="6" fill="#fff7db" stroke="#321b47" strokeWidth="2" />
        <circle cx="39" cy="28" r="6" fill="#fff7db" stroke="#321b47" strokeWidth="2" />
        <circle cx="25" cy="28" r="2.5" fill="#211033" />
        <circle cx="39" cy="28" r="2.5" fill="#211033" />
        <polygon points="32,31 29,37 35,37" fill="#f2b838" stroke="#6e4309" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'hourglass',
    label: 'Hourglass',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <rect x="17" y="10" width="30" height="5" rx="2" fill="#e6b445" stroke="#6b4108" strokeWidth="2" />
        <rect x="17" y="49" width="30" height="5" rx="2" fill="#e6b445" stroke="#6b4108" strokeWidth="2" />
        <path d="M21 15 L43 15 L34 32 L43 49 L21 49 L30 32 Z" fill="#d9eefc" stroke="#456585" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="25,47 39,47 32,37" fill="#f2b838" />
        <polygon points="27,21 37,21 32,29" fill="#f2b838" />
      </svg>
    ),
  },
  {
    key: 'chalice',
    label: 'Star Chalice',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M18 14 L46 14 C46 30 39 36 32 36 C25 36 18 30 18 14 Z" fill="#f2c049" stroke="#704309" strokeWidth="2.4" />
        <rect x="29.5" y="36" width="5" height="14" fill="#d9a12b" stroke="#704309" strokeWidth="2" />
        <ellipse cx="32" cy="52" rx="13" ry="3.5" fill="#f2c049" stroke="#704309" strokeWidth="2.2" />
        <circle cx="32" cy="23" r="3.5" fill="#4f9cf9" />
      </svg>
    ),
  },
  {
    key: 'compass',
    label: 'Star Compass',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="32" cy="32" r="20" fill="#233769" stroke="#e8bc50" strokeWidth="2.8" />
        <polygon points="32,12 37,27 52,32 37,37 32,52 27,37 12,32 27,27" fill="#f7d36f" stroke="#73480a" strokeWidth="1.6" />
        <circle cx="32" cy="32" r="4" fill="#d92955" />
      </svg>
    ),
  },
  {
    key: 'eclipse',
    label: 'Eclipse',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="32" cy="32" r="19" fill="#f7c84d" stroke="#8c5409" strokeWidth="2" />
        <circle cx="36" cy="31" r="15" fill="#2a194a" />
        <circle cx="20" cy="21" r="2.2" fill="#ffffff" />
      </svg>
    ),
  },
  {
    key: 'constellation',
    label: 'Constellation',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <polyline points="13,44 26,24 38,34 51,16" fill="none" stroke="#80c8ff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="13" cy="44" r="4.2" fill="#fae078" stroke="#7d4f0a" strokeWidth="1.8" />
        <circle cx="26" cy="24" r="5" fill="#fae078" stroke="#7d4f0a" strokeWidth="1.8" />
        <circle cx="38" cy="34" r="4.2" fill="#fae078" stroke="#7d4f0a" strokeWidth="1.8" />
        <circle cx="51" cy="16" r="5.5" fill="#fae078" stroke="#7d4f0a" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    key: 'quill',
    label: 'Silver Quill',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M51 11 C34 11 19 25 18 43 C32 45 48 31 51 11 Z" fill="#b794f4" stroke="#3c1f70" strokeWidth="2.3" />
        <path d="M50 12 L13 53" stroke="#f2c44e" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="14" cy="52" r="3" fill="#3c1f70" />
      </svg>
    ),
  },
];

const BOTANICAL_SYMBOLS: SymbolDefinition[] = [
  {
    key: 'lotus',
    label: 'Lotus Bloom',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 14 C38 24 38 36 32 44 C26 36 26 24 32 14 Z" fill="#f279a6" stroke="#781c40" strokeWidth="2" />
        <path d="M32 44 C20 40 15 30 16 20 C24 24 29 33 32 44 Z" fill="#f7a8c5" stroke="#781c40" strokeWidth="2" />
        <path d="M32 44 C44 40 49 30 48 20 C40 24 35 33 32 44 Z" fill="#f7a8c5" stroke="#781c40" strokeWidth="2" />
        <ellipse cx="32" cy="48" rx="18" ry="5" fill="#329c64" stroke="#145231" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'fern',
    label: 'Fern Frond',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 54 Q30 32 34 10" stroke="#18663a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M31 44 L17 38 M32 35 L18 28 M32 26 L21 19 M32 44 L47 38 M32 35 L46 28 M33 26 L44 19" stroke="#2fa866" strokeWidth="4.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'bee',
    label: 'Honeybee',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <ellipse cx="25" cy="21" rx="9" ry="6" fill="#d9f4ff" stroke="#366c85" strokeWidth="1.8" transform="rotate(-25 25 21)" />
        <ellipse cx="39" cy="21" rx="9" ry="6" fill="#d9f4ff" stroke="#366c85" strokeWidth="1.8" transform="rotate(25 39 21)" />
        <ellipse cx="32" cy="36" rx="14" ry="11" fill="#f7c438" stroke="#472d06" strokeWidth="2.3" />
        <path d="M25 26 L25 46 M33 25 L33 47 M40 27 L40 45" stroke="#382307" strokeWidth="3.2" />
      </svg>
    ),
  },
  {
    key: 'moth',
    label: 'Luna Moth',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 26 C20 14 8 18 10 30 C12 39 22 40 32 34 Z" fill="#7be0b2" stroke="#165e40" strokeWidth="2.2" />
        <path d="M32 26 C44 14 56 18 54 30 C52 39 42 40 32 34 Z" fill="#7be0b2" stroke="#165e40" strokeWidth="2.2" />
        <path d="M32 34 C22 38 18 48 22 54 C26 52 30 45 32 40 Z" fill="#5cc997" stroke="#165e40" strokeWidth="2" />
        <path d="M32 34 C42 38 46 48 42 54 C38 52 34 45 32 40 Z" fill="#5cc997" stroke="#165e40" strokeWidth="2" />
        <rect x="29.5" y="21" width="5" height="22" rx="2.5" fill="#fff4d6" stroke="#6b5018" strokeWidth="1.8" />
        <circle cx="20" cy="27" r="2.5" fill="#f7cc57" />
        <circle cx="44" cy="27" r="2.5" fill="#f7cc57" />
      </svg>
    ),
  },
  {
    key: 'acorn',
    label: 'Oak Acorn',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M18 28 L46 28 C46 45 39 53 32 55 C25 53 18 45 18 28 Z" fill="#c77d38" stroke="#5c320c" strokeWidth="2.4" />
        <path d="M14 29 C14 19 22 15 32 15 C42 15 50 19 50 29 Z" fill="#784218" stroke="#402008" strokeWidth="2.4" />
        <path d="M32 15 L35 9" stroke="#402008" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'dragonfly',
    label: 'Dragonfly',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <ellipse cx="19" cy="24" rx="12" ry="4.5" fill="#9ee5f5" stroke="#195c6e" strokeWidth="1.8" transform="rotate(-12 19 24)" />
        <ellipse cx="45" cy="24" rx="12" ry="4.5" fill="#9ee5f5" stroke="#195c6e" strokeWidth="1.8" transform="rotate(12 45 24)" />
        <ellipse cx="21" cy="34" rx="10" ry="3.8" fill="#bfeef8" stroke="#195c6e" strokeWidth="1.8" transform="rotate(14 21 34)" />
        <ellipse cx="43" cy="34" rx="10" ry="3.8" fill="#bfeef8" stroke="#195c6e" strokeWidth="1.8" transform="rotate(-14 43 34)" />
        <line x1="32" y1="16" x2="32" y2="54" stroke="#166978" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="32" cy="16" r="4" fill="#21a3b5" stroke="#0f4752" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    key: 'lavender',
    label: 'Lavender',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 55 L32 14" stroke="#28784b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="14" r="4.5" fill="#9b66e0" stroke="#4a2280" strokeWidth="1.6" />
        <circle cx="26" cy="22" r="4.5" fill="#b17ef0" stroke="#4a2280" strokeWidth="1.6" />
        <circle cx="38" cy="22" r="4.5" fill="#b17ef0" stroke="#4a2280" strokeWidth="1.6" />
        <circle cx="26" cy="32" r="4.5" fill="#9b66e0" stroke="#4a2280" strokeWidth="1.6" />
        <circle cx="38" cy="32" r="4.5" fill="#9b66e0" stroke="#4a2280" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    key: 'monarch',
    label: 'Monarch',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 28 C20 12 9 16 11 30 C13 38 22 40 32 34 Z" fill="#f58a27" stroke="#5c2805" strokeWidth="2.3" />
        <path d="M32 28 C44 12 55 16 53 30 C51 38 42 40 32 34 Z" fill="#f58a27" stroke="#5c2805" strokeWidth="2.3" />
        <path d="M32 34 C22 38 17 48 23 52 C28 53 31 45 32 40 Z" fill="#f7a83b" stroke="#5c2805" strokeWidth="2.1" />
        <path d="M32 34 C42 38 47 48 41 52 C36 53 33 45 32 40 Z" fill="#f7a83b" stroke="#5c2805" strokeWidth="2.1" />
        <rect x="30" y="20" width="4" height="24" rx="2" fill="#2e1808" />
      </svg>
    ),
  },
  {
    key: 'terrarium',
    label: 'Terrarium',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <polygon points="32,10 50,24 46,52 18,52 14,24" fill="#e6f7f0" stroke="#2d6e55" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M18 45 L46 45 L45 51 L19 51 Z" fill="#825329" />
        <path d="M32 45 L32 30 M32 37 L25 32 M32 35 L39 30" stroke="#299c62" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'berry',
    label: 'Wild Berry',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 14 C36 18 44 18 44 24 C38 25 34 23 32 18 C30 23 26 25 20 24 C20 18 28 18 32 14 Z" fill="#2c9959" stroke="#134f2b" strokeWidth="2" />
        <circle cx="24" cy="33" r="8" fill="#7d2380" stroke="#3b0c3d" strokeWidth="2" />
        <circle cx="40" cy="33" r="8" fill="#7d2380" stroke="#3b0c3d" strokeWidth="2" />
        <circle cx="32" cy="45" r="8.5" fill="#9c2fa1" stroke="#3b0c3d" strokeWidth="2" />
        <circle cx="32" cy="36" r="7.5" fill="#b33cb8" stroke="#3b0c3d" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: 'ginkgo',
    label: 'Ginkgo Leaf',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <path d="M32 42 L32 56" stroke="#7d5912" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 43 C15 39 10 24 16 15 C23 12 29 17 32 24 C35 17 41 12 48 15 C54 24 49 39 32 43 Z" fill="#f2c444" stroke="#7d540d" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'sunflower',
    label: 'Garden Blossom',
    render: (c) => (
      <svg viewBox="0 0 64 64" className={c} aria-hidden="true">
        <circle cx="32" cy="17" r="7" fill="#f7c438" stroke="#85510a" strokeWidth="1.8" />
        <circle cx="32" cy="47" r="7" fill="#f7c438" stroke="#85510a" strokeWidth="1.8" />
        <circle cx="17" cy="32" r="7" fill="#f7c438" stroke="#85510a" strokeWidth="1.8" />
        <circle cx="47" cy="32" r="7" fill="#f7c438" stroke="#85510a" strokeWidth="1.8" />
        <circle cx="21" cy="21" r="6.5" fill="#fad45c" stroke="#85510a" strokeWidth="1.6" />
        <circle cx="43" cy="21" r="6.5" fill="#fad45c" stroke="#85510a" strokeWidth="1.6" />
        <circle cx="21" cy="43" r="6.5" fill="#fad45c" stroke="#85510a" strokeWidth="1.6" />
        <circle cx="43" cy="43" r="6.5" fill="#fad45c" stroke="#85510a" strokeWidth="1.6" />
        <circle cx="32" cy="32" r="10.5" fill="#6e3a16" stroke="#3b1d08" strokeWidth="2.2" />
      </svg>
    ),
  },
];

export const SYMBOL_PACKS: Record<SymbolPackId, SymbolDefinition[]> = {
  portraits: PORTRAIT_SYMBOLS,
  storybook: STORYBOOK_SYMBOLS,
  wonderland: WONDERLAND_SYMBOLS,
  celestial: CELESTIAL_SYMBOLS,
  botanical: BOTANICAL_SYMBOLS,
};

export function CardBackArt({
  pattern,
  accent,
}: {
  pattern: BackPatternId;
  accent: AccentSpec;
}) {
  return (
    <svg
      viewBox="0 0 100 130"
      className="h-full w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`bg-${accent.id}-${pattern}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent.backMid} />
          <stop offset="100%" stopColor={accent.backBg} />
        </linearGradient>
      </defs>
      <rect width="100" height="130" rx="8" fill={`url(#bg-${accent.id}-${pattern})`} />
      <rect
        x="6"
        y="6"
        width="88"
        height="118"
        rx="5"
        fill="none"
        stroke={accent.backBorder}
        strokeWidth="1.6"
        opacity="0.88"
      />
      <rect
        x="10.5"
        y="10.5"
        width="79"
        height="109"
        rx="3"
        fill="none"
        stroke={accent.patternStroke}
        strokeWidth="0.7"
        opacity="0.45"
      />

      {pattern === 'filigree' && (
        <g stroke={accent.patternStroke} fill="none" opacity="0.82">
          <ellipse cx="50" cy="65" rx="22" ry="30" strokeWidth="1.4" />
          <ellipse cx="50" cy="65" rx="15" ry="22" strokeWidth="0.9" opacity="0.65" />
          <path d="M50 22 L54 31 L50 36 L46 31 Z" fill={accent.backBorder} stroke="none" />
          <path d="M50 108 L54 99 L50 94 L46 99 Z" fill={accent.backBorder} stroke="none" />
          <path d="M50 51 L55 65 L50 79 L45 65 Z" fill={accent.backBorder} opacity="0.85" stroke="none" />
          <circle cx="18" cy="18" r="2.2" fill={accent.backBorder} stroke="none" />
          <circle cx="82" cy="18" r="2.2" fill={accent.backBorder} stroke="none" />
          <circle cx="18" cy="112" r="2.2" fill={accent.backBorder} stroke="none" />
          <circle cx="82" cy="112" r="2.2" fill={accent.backBorder} stroke="none" />
        </g>
      )}

      {pattern === 'diamond' && (
        <g stroke={accent.patternStroke} fill="none" opacity="0.78">
          <polygon points="50,18 82,65 50,112 18,65" strokeWidth="1.4" />
          <polygon points="50,30 73,65 50,100 27,65" strokeWidth="0.9" opacity="0.65" />
          <polygon points="50,48 61,65 50,82 39,65" fill={accent.backBorder} opacity="0.32" strokeWidth="1.2" />
          <circle cx="50" cy="65" r="4" fill={accent.backBorder} stroke="none" />
        </g>
      )}

      {pattern === 'lattice' && (
        <g stroke={accent.patternStroke} fill="none" opacity="0.55" strokeWidth="1">
          <line x1="12" y1="26" x2="88" y2="104" />
          <line x1="12" y1="54" x2="64" y2="118" />
          <line x1="36" y1="12" x2="88" y2="66" />
          <line x1="88" y1="26" x2="12" y2="104" />
          <line x1="88" y1="54" x2="36" y2="118" />
          <line x1="64" y1="12" x2="12" y2="66" />
          <rect x="38" y="53" width="24" height="24" rx="4" transform="rotate(45 50 65)" fill={accent.backBg} stroke={accent.backBorder} strokeWidth="1.6" opacity="1" />
          <circle cx="50" cy="65" r="3.5" fill={accent.backBorder} opacity="1" stroke="none" />
        </g>
      )}

      {pattern === 'starburst' && (
        <g stroke={accent.patternStroke} fill="none" opacity="0.85">
          <circle cx="50" cy="65" r="24" strokeWidth="1" opacity="0.5" />
          <polygon
            points="50,36 55,58 76,65 55,72 50,94 45,72 24,65 45,58"
            fill={accent.backBorder}
            opacity="0.88"
            stroke="none"
          />
          <circle cx="50" cy="65" r="5" fill={accent.backBg} stroke={accent.backBorder} strokeWidth="1.4" />
          <circle cx="50" cy="22" r="2" fill={accent.backBorder} stroke="none" />
          <circle cx="50" cy="108" r="2" fill={accent.backBorder} stroke="none" />
        </g>
      )}
    </svg>
  );
}
