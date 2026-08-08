'use client';

import React, { useState } from 'react';
import { Film, Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { label: 'Movies', path: '/movies' },
    { label: 'Top Rated', path: '/top-rated' },
    { label: 'Coming Soon', path: '/coming-soon' },
  ];

  const { theme, setTheme } = useTheme();

  return (
    <nav className="h-16 bg-background/80 md:bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover-glow">
            <Film className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold text-glow">IMDb</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-background/80 backdrop-blur-md text-foreground pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 w-64 transition-all"
              />
            </form>
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="text-muted-foreground hover:text-foreground transition-colors hover-glow"
                >
                  {item.label}
                </Link>
              ))}
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'high-contrast' | 'auto')}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors hidden md:block focus:outline-none appearance-none"
              >
                <option value="auto">Auto</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="high-contrast">High Contrast</option>
              </select>

              <button className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-all hover:scale-105 duration-300 hidden md:block">
                Sign In
              </button>
            </div>
          </div>

          <button
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border shadow-lg z-40">
          <div className="px-4 py-6 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-600 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-muted text-foreground pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 w-full"
              />
            </form>
            <div className="flex flex-col mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.path}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted transition-colors py-3 px-4 rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              <select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value as 'dark' | 'light' | 'high-contrast' | 'auto');
                  setIsMenuOpen(false);
                }}
                className="flex-1 py-3 px-4 text-sm font-semibold rounded-lg bg-muted text-foreground transition-colors focus:outline-none appearance-none"
              >
                <option value="auto">Auto</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="high-contrast">High Contrast</option>
              </select>
              <button className="flex-1 bg-accent text-accent-foreground py-3 rounded-lg font-semibold transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;