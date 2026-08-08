'use client';

import React from "react";
import Hero from "../components/Hero";
import { Award, Clock, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import MovieCarousel from "../components/MovieCarousel";
import { useTrendingMovies, useUpcomingMovies } from "../hooks/useMovies";

const Home = () => {
  const { data: trendingData, isLoading: trendingLoading } = useTrendingMovies();
  const { data: upcomingData, isLoading: upcomingLoading } = useUpcomingMovies();

  const trendingMovies = trendingData?.pages[0]?.results || [];
  const upcomingMovies = upcomingData?.pages[0]?.results || [];

  return (
    <div>
      <Hero movies={trendingMovies} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: TrendingUp,
              label: "Trending",
              path: "/movies?sort=trending",
              color: "bg-yellow-500",
            },
            {
              icon: Star,
              label: "Top Rated",
              path: "/top-rated",
              color: "bg-purple-500",
            },
            {
              icon: Clock,
              label: "Coming Soon",
              path: "/coming-soon",
              color: "bg-blue-500",
            },
            {
              icon: Award,
              label: "Awards",
              path: "/awards",
              color: "bg-red-500",
            },
          ].map((category, index) => (
            <Link
              key={index}
              href={category.path}
              className={`${category.color} p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-70 transition-opacity`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium text-black">{category.label}</span>
            </Link>
          ))}
        </div>
        
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
              Trending Now
            </h2>
            <Link href="/movies?sort=trending" className="text-yellow-500 hover:text-yellow-400">
              View All
            </Link>
          </div>
          <MovieCarousel movies={trendingMovies} isLoading={trendingLoading} />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <Clock className="w-6 h-6 text-yellow-500" />
              Coming Soon
            </h2>
            <Link href="/coming-soon" className="text-yellow-500 hover:text-yellow-400">
              View All
            </Link>
          </div>
          <MovieCarousel movies={upcomingMovies} isLoading={upcomingLoading} />
        </section>
      </main>
    </div>
  );
};

export default Home;
