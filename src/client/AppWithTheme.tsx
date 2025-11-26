import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from 'react-router-dom';
import i18n from 'i18next';
import useThemeStore from './store/themeStore';
import getTheme from './theme';
import router from './router';

export default function AppWithTheme() {
  const [i18nInitialized, setI18nInitialized] = useState(i18n.isInitialized);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const language = useThemeStore((state) => state.language);
  const theme = getTheme(primaryColor);

  useEffect(() => {
    if (!i18nInitialized) {
      i18n.on('initialized', () => setI18nInitialized(true));
    }

    return () => {
      i18n.off('initialized', () => setI18nInitialized(true));
    };
  }, [i18nInitialized]);

  useEffect(() => {
    if (i18nInitialized) {
      i18n.changeLanguage(language);
    }
  }, [language, i18nInitialized]);

  if (!i18nInitialized) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
