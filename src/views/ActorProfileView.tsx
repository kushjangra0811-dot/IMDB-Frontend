'use client';

import { Award, Instagram, Star, Twitter } from "lucide-react";
import React from "react";
import Link from "next/link";
import FilmographyExplorer from "../components/FilmographyExplorer";

interface ActorProfileViewProps {
  actor: any;
}

export default function ActorProfileView({ actor }: ActorProfileViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden bg-background">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${actor.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
        </div>
        <div className="relative h-full w-full flex items-end pb-8 px-4 sm:px-8">
          <div className="flex items-end gap-8">
            <img
              src={actor.image}
              alt={actor.name}
              className="w-48 h-48 rounded-xl object-cover border-4 border-zinc-900"
              loading="eager"
            />
            <div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">{actor.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-foreground">{actor.stats.avgRating} Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="text-foreground">{actor.stats.moviesCount} Movies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data for Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": actor.name,
            "image": actor.image,
            "birthDate": actor.birthDate,
            "birthPlace": actor.birthPlace,
            "description": actor.biography?.substring(0, 200),
            "url": typeof window !== 'undefined' ? window.location.href : undefined,
            "sameAs": [
              actor.socialMedia?.instagram,
              actor.socialMedia?.twitter,
              actor.socialMedia?.imdb,
            ].filter(Boolean),
          })
        }}
      />

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div>
          <div className="sticky top-24 space-y-6">
            <div className="bg-muted rounded-xl p-6">
              <h2 className="font-semibold mb-4 text-foreground">Personal Info</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-muted-foreground">Born</dt>
                  <dd className="text-foreground">{actor.birthDate}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Place of Birth</dt>
                  <dd className="text-foreground">{actor.birthPlace}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Movies</dt>
                  <dd className="text-foreground">{actor.stats.moviesCount} titles</dd>
                </div>
                {actor.stats.yearsActive && actor.stats.yearsActive !== 'Unknown' && (
                  <div>
                    <dt className="text-muted-foreground">Active</dt>
                    <dd className="text-foreground">{actor.stats.yearsActive}</dd>
                  </div>
                )}
              </dl>
            </div>
            {(actor.socialMedia?.instagram || actor.socialMedia?.twitter) && (
              <div className="bg-muted rounded-lg p-6">
                <h2 className="font-semibold mb-4 text-foreground">Social Media</h2>
                <div className="flex gap-4">
                  {actor.socialMedia.instagram && (
                    <a
                      href={actor.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                  {actor.socialMedia.twitter && (
                    <a
                      href={actor.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Biography</h2>
            <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
              {actor.biography}
            </p>
          </section>

          {actor.upcomingProjects?.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Upcoming Projects</h2>
              <div className="grid gap-4">
                {actor.upcomingProjects.map((project: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-muted p-4 rounded-xl"
                  >
                    <Award className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground">{project.title}</span>
                      <span className="mx-2 text-muted-foreground">|</span>
                      <span className="text-foreground">{project.expectedRelease}</span>
                      <p className="text-sm text-muted-foreground">
                        Role: {project.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Known For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {actor.knownFor?.map((movie: any) => (
                <Link key={movie.id} href={`/movie/${movie.id}`}>
                  <div className="bg-muted rounded-lg overflow-hidden hover:scale-105 transition-transform">
                    <div className="relative aspect-[2/3]">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-yellow-500 font-medium">
                          {movie.rating}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 text-foreground truncate">
                        {movie.title}
                      </h3>
                      <p className="text-muted-foreground truncate">as {movie.role}</p>
                      <p className="text-muted-foreground text-sm">{movie.year}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Virtualized Filmography Explorer (client island) */}
          {actor.allMovies && actor.allMovies.length > 0 && (
            <FilmographyExplorer movies={actor.allMovies} />
          )}
        </div>
      </div>
    </div>
  );
}
