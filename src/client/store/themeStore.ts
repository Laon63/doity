import { create } from 'zustand';

export type Language = 'en' | 'ko';

export const COLOR_PALETTES = {
  skyBlue: '#BAE1FF',
  peach: '#FFCAB0',
  lemonChiffon: '#FFFACD',
  softMint: '#9FE9D9',
  lavender: '#DCC9E8',
  rose: '#FFD9E8',
  sage: '#D9EAD3',
  coral: '#FFCCB3',
  lilac: '#E6CCFF',
  softPink: '#F5A3D0',
};

interface ThemeState {
  primaryColor: string;
  language: Language;
  setPrimaryColor: (color: string) => void;
  setLanguage: (language: Language) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: COLOR_PALETTES.skyBlue,
  language: 'ko',
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setLanguage: (language) => set({ language }),
}));

export default useThemeStore;
