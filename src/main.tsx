import React from 'react';
import ReactDOM from 'react-dom/client';
import './client/styles/scrollbar.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import router from 'client/router';
import { queryClient } from 'client/lib/queryClient';
import { I18nextProvider } from 'react-i18next';
import i18n, { initializeI18n } from './i18n';
import LoadingSpinner from 'client/components/LoadingSpinner'; // Import LoadingSpinner

async function main() {
  // Wait for i18next to initialize before rendering the app
  await initializeI18n();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <RouterProvider
            router={router}
            fallback={<LoadingSpinner fullScreen />}
          />
        </I18nextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

main();
