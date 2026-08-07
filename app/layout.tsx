import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../src/components/Navbar';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'IMDb Clone',
  description: 'A Next.js IMDb Clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
