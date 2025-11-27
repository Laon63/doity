import { create } from 'zustand';

export type Language = 'en' | 'ko';

export const COLOR_PALETTES = {
  blush: '#FFB3D9',
  peach: '#FFCAB0',
  lemonChiffon: '#FFFACD',
  mint: '#BAFFC9',
  skyBlue: '#BAE1FF',
  lavender: '#DCC9E8',
  rose: '#FFD9E8',
  sage: '#D9EAD3',
  coral: '#FFCCB3',
  lilac: '#E6CCFF',
};

interface ThemeState {
  primaryColor: string;
  language: Language;
  setPrimaryColor: (color: string) => void;
  setLanguage: (language: Language) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: COLOR_PALETTES.emerald,
  language: 'ko',
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setLanguage: (language) => set({ language }),
}));

export default useThemeStore;
