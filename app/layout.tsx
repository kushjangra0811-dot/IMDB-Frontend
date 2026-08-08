import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '../src/components/Navbar';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'IMDb',
  description: 'A Next.js IMDb Clone',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { cookies, headers } from 'next/headers';

import ThemeTransition from '../src/components/ThemeTransition';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value || 'auto';
  
  const headersList = headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = 'auto';
                  var cookieMatches = document.cookie.match(/(?:^|; )theme=([^;]*)/);
                  if (cookieMatches) {
                    theme = cookieMatches[1];
                  } else {
                    var localTheme = localStorage.getItem('theme');
                    if (localTheme) theme = localTheme;
                  }
                  
                  if (theme === 'auto') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-500">
        <Providers initialTheme={theme}>
          <Navbar />
          <ThemeTransition>
            {children}
          </ThemeTransition>
        </Providers>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('ServiceWorker registration successful');
                }, function(err) {
                  console.log('ServiceWorker registration failed: ', err);
                });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
