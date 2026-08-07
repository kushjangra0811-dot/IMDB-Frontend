'use client';

import { Search, SlidersHorizontal } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MovieCard from "../components/MovieCard";

const MovieList = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("search");
  
  const Movies = [
    {
      id: 1,
      title: "Spider-Man: No Way Home",
      rating: 7.9,
      image:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Sci-Fi", "Action"],
    },
    {
      id: 2,
      title: "The Last House",
      rating: 7.0,
      image:
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Horror", "Sci-Fi"],
    },
    {
      id: 3,
      title: "The Odyssey",
      rating: 8.0,
      image:
        "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Adventure", "Action"],
    },
    {
      id: 4,
      title: "Evil Dead B...",
      rating: 7.9,
      image:
        "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Horror", "Thriller"],
    },
    {
      id: 5,
      title: "Obsession",
      rating: 8.2,
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Horror", "Thriller"],
    },
    {
      id: 6,
      title: "Beast Race",
      rating: 9.0,
      image:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
      year: 2026,
      genre: ["Action", "Sci-Fi"],
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <button className="flex items-center gap-2 bg-zinc-800 text-white px-4 py-2 rounded-xl hover:bg-zinc-700 transition-colors">
          <SlidersHorizontal className="w-5 h-5" /> Filters
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
            <MovieCard {...movie} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
