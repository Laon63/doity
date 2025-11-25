import { create } from 'zustand';

export type Language = 'en' | 'ko';

export const COLOR_PALETTES = {
  emerald: '#8FE3CD',
  blue: '#60A5FA',
  purple: '#A78BFA',
  pink: '#F472B6',
  orange: '#FB923C',
  teal: '#14B8A6',
  rose: '#F43F5E',
  indigo: '#6366F1',
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
