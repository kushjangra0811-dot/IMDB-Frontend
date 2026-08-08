'use client';

import { Award, Instagram, Star, Twitter, Users, Info, Link as LinkIcon } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FilmographyExplorer from "../components/FilmographyExplorer";

interface ActorProfileViewProps {
  actor: any;
}

export default function ActorProfileView({ actor }: ActorProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'social' | 'awards'>('info');
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
        <div className="relative h-full container flex items-end pb-8">
          <div className="flex items-end gap-8">
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border-4 border-zinc-900 bg-muted shrink-0">
              <Image
                src={actor.image}
                alt={actor.name}
                fill
                priority
                sizes="192px"
                className="object-cover"
              />
            </div>
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
        {/* Sidebar with Tabs */}
        <div>
          <div className="sticky top-24 space-y-6">
            <div className="flex bg-muted rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'info' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Info className="w-4 h-4" /> Info
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'social' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LinkIcon className="w-4 h-4" /> Social
              </button>
              <button
                onClick={() => setActiveTab('awards')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'awards' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Award className="w-4 h-4" /> Awards
              </button>
            </div>

            {activeTab === 'info' && (
              <div className="bg-muted rounded-xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            )}

            {activeTab === 'social' && (
              <div className="bg-muted rounded-xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="font-semibold mb-4 text-foreground">Social Media</h2>
                {(actor.socialMedia?.instagram || actor.socialMedia?.twitter) ? (
                  <div className="flex gap-4">
                    {actor.socialMedia.instagram && (
                      <a
                        href={actor.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-pink-500 transition-colors"
                      >
                        <Instagram className="w-6 h-6" /> Instagram
                      </a>
                    )}
                    {actor.socialMedia.twitter && (
                      <a
                        href={actor.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground hover:text-blue-400 transition-colors"
                      >
                        <Twitter className="w-6 h-6" /> Twitter
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No official social media accounts listed.</p>
                )}
              </div>
            )}

            {activeTab === 'awards' && (
              <div className="bg-muted rounded-xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="font-semibold mb-4 text-foreground">Awards</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-foreground font-medium">Average Rating</p>
                      <p className="text-muted-foreground text-sm">{actor.stats.avgRating}/10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-foreground font-medium">Total Credits</p>
                      <p className="text-muted-foreground text-sm">{actor.stats.moviesCount} movies</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic mt-4">
                    Detailed awards data not available.
                  </p>
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
                    <div className="relative aspect-[2/3] bg-muted">
                      <Image
                        src={movie.image}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 z-10">
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
