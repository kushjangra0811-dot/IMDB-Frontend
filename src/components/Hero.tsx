"use client";
import React from "react";
import { Play, Star, Calendar } from "lucide-react";
import Link from "next/link";

const Hero = ({ movies = [] }: { movies?: any[] }) => {
  const [currentMovie, setCurrentMovie] = React.useState(0);

  // Use top 5 movies for the carousel, fallback if empty
  const featuredMovies = movies.length > 0 ? movies.slice(0, 5) : [
    {
      id: 1,
      title: "Loading...",
      rating: 0,
      year: "2024",
      description: "Loading featured movies...",
      image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2000&q=80",
    }
  ];

  React.useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  const movie = featuredMovies[currentMovie];

  return (
    <div className="relative h-[90vh] bg-background overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 gradient-mask"
        style={{
          backgroundImage: `url('${movie.backdrop || movie.image}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-yellow-500 font-semibold">
                {movie.rating} Rating
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">{movie.year || movie.releaseDate}</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow">
            {movie.title}
          </h1>
          <p className="text-muted-foreground text-lg mb-8 line-clamp-3 max-w-xl">
            {movie.description || 'Discover this amazing movie, trending now!'}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`/movie/${movie.id}`}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-all hover:scale-105 duration-300"
            >
              <Play className="w-5 h-5" />
              Watch Trailer
            </Link>
            <Link
              href={`/movie/${movie.id}`}
              className="bg-muted/80 backdrop-blur-md text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-muted transition-all hover:scale-105 duration-300"
            >
              More Info
            </Link>
          </div>
        </div>

        {featuredMovies.length > 1 && (
          <div className="absolute bottom-8 right-4 flex gap-2">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMovie(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentMovie === index
                    ? "bg-accent w-8"
                    : "bg-muted-foreground w-4 hover:bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
