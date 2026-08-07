'use client';

import { Clock } from "lucide-react";
import React from "react";
import Link from "next/link";
import MovieCard from "../components/MovieCard";

const ComingSoon = () => {
  const upcomingMovies = [
    {
      id: 1,
      title: "The Odyssey",
      rating: 8.0,
      image:
        "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Adventure", "Action"],
    },
    {
      id: 2,
      title: "Obsession",
      rating: 8.2,
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Horror", "Thriller"],
    },
    {
      id: 3,
      title: "The Death",
      rating: 6.5,
      image:
        "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Adventure", "Drama"],
    },
    {
      id: 4,
      title: "Moana",
      rating: 5.9,
      image:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Family", "Fantasy"],
    },
    {
      id: 5,
      title: "Minions",
      rating: 6.4,
      image:
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Family", "Comedy"],
    },
    {
      id: 6,
      title: "Alien",
      rating: 8.1,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Horror", "Sci-Fi"],
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex items-center gap-4 mb-8">
        <Clock className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white">Coming Soon</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {upcomingMovies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
            <MovieCard {...movie} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;
