import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    import('aos').then((AOS) => {
      AOS.default.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 60 });
    });
  }, []);

  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
