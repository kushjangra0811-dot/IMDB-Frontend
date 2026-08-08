import { Star } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import WatchlistButton from "./WatchlistButton";

const MovieCard = ({ id, title, rating, image, year, genre }: any) => {
  return (
    <div className="bg-background/50 rounded-xl overflow-hidden movie-card-hover backdrop-blur-sm cursor-pointer group/card relative">
      <Link href={`/movie/${id}`} className="block relative aspect-[2/3] bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover group-hover/card:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold text-center hover:bg-yellow-400 transition-colors">
            View Details
          </div>
        </div>
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 scale-90 sm:scale-100 origin-top-right z-10">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-yellow-500 font-medium">{rating}</span>
        </div>
      </Link>
      <div className="absolute top-2 left-2 z-10 scale-90 origin-top-left group-hover/card:scale-100 transition-transform">
        <WatchlistButton movie={{ id: String(id), title, image }} compact />
      </div>
      <div className="p-4 overflow-hidden">
        <Link href={`/movie/${id}`} className="flex items-center justify-between mb-2 hover:text-yellow-500 transition-colors">
          <h3 className="font-semibold text-lg truncate text-glow flex-1 pr-2">{title}</h3>
          <span className="text-muted-foreground text-sm shrink-0">{year}</span>
        </Link>
        {genre && (
          <div className="flex flex-wrap gap-2">
            {genre.slice(0, 2).map((g: string) => (
              <span key={g} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
