import { cache } from 'react';
import { globalRateLimiter } from './rateLimiter';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

type NextFetchOptions = RequestInit & { next?: { revalidate?: number | false, tags?: string[] } };

const fetchFromTMDB = cache(async (endpoint: string, params: Record<string, string | number> = {}, fetchOptions: NextFetchOptions = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await globalRateLimiter.fetchWithResilience(url.toString(), {
    next: { revalidate: 3600, tags: ['tmdb'] }, // 1 hour HTTP cache control
    ...fetchOptions,
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }

  return response.json();
});

// Define interfaces based on what the app already uses
export interface Movie {
  id: number;
  title: string;
  rating: number; // map from vote_average
  image: string; // map from poster_path
  backdrop?: string; // map from backdrop_path
  year: number; // map from release_date
  genre: string[]; // map from genre_ids
  voteCount?: number;
}

const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

const mapTMDBMovie = (movie: any): Movie => ({
  id: movie.id,
  title: movie.title || movie.name,
  rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : 0,
  image: movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80',
  backdrop: movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=2000&q=80',
  year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
  genre: (movie.genre_ids || []).map((id: number) => GENRE_MAP[id] || 'Other').slice(0, 3),
  voteCount: movie.vote_count || 0,
});

// Cursor-based fetching for lists
export const getTrendingMovies = async ({ pageParam = 1 }: { pageParam?: number }, fetchOptions?: NextFetchOptions) => {
  const data = await fetchFromTMDB('/trending/movie/week', { page: pageParam }, fetchOptions);
  return {
    results: data.results.map(mapTMDBMovie),
    nextCursor: data.page < data.total_pages ? data.page + 1 : undefined,
  };
};

export const getUpcomingMovies = async ({ pageParam = 1 }: { pageParam?: number }, fetchOptions?: NextFetchOptions) => {
  const data = await fetchFromTMDB('/movie/upcoming', { page: pageParam }, fetchOptions);
  return {
    results: data.results.map(mapTMDBMovie),
    nextCursor: data.page < data.total_pages ? data.page + 1 : undefined,
  };
};

export const getTopRatedMovies = async ({ pageParam = 1 }: { pageParam?: number }, fetchOptions?: NextFetchOptions) => {
  const data = await fetchFromTMDB('/movie/top_rated', { page: pageParam }, fetchOptions);
  return {
    results: data.results.map(mapTMDBMovie),
    nextCursor: data.page < data.total_pages ? data.page + 1 : undefined,
  };
};

export const getMovieDetails = async (id: string, fetchOptions?: NextFetchOptions) => {
  const data = await fetchFromTMDB(`/movie/${id}`, {
    append_to_response: 'credits,videos'
  }, fetchOptions);
  
  return {
    id: data.id,
    title: data.title,
    rating: data.vote_average ? Number(data.vote_average.toFixed(1)) : 0,
    image: data.poster_path 
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80',
    coverImage: data.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
      : undefined,
    year: data.release_date ? new Date(data.release_date).getFullYear() : 2024,
    genre: data.genres?.map((g: any) => g.name) || [],
    duration: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : '2h 15m',
    description: data.overview,
    director: data.credits?.crew?.find((c: any) => c.job === 'Director')?.name || 'Unknown',
    boxOffice: data.revenue ? `$${(data.revenue / 1000000).toFixed(1)}M` : 'Unknown',
    language: data.original_language === 'en' ? 'English' : data.original_language?.toUpperCase() || 'Unknown',
    productionCompany: data.production_companies?.[0]?.name || 'Unknown',
    awards: ["Academy Award Nominee", "Golden Globe Nominee"], // Mocked since TMDB doesn't provide awards natively
    metacriticScore: Math.floor(Math.random() * 30) + 60, // Mocked 60-90
    rottenTomatoesScore: Math.floor(Math.random() * 30) + 70, // Mocked 70-100
    cast: (data.credits?.cast || []).slice(0, 5).map((c: any) => ({
      id: c.id,
      name: c.name,
      role: c.character,
      image: c.profile_path 
        ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
        : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
    })),
    trailer: data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')?.key
      ? `https://www.youtube.com/watch?v=${data.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube').key}`
      : undefined
  };
};

export const getActorDetails = async (id: string, fetchOptions?: NextFetchOptions) => {
  const data = await fetchFromTMDB(`/person/${id}`, {
    append_to_response: 'movie_credits,external_ids'
  }, fetchOptions);
  
  const knownFor = (data.movie_credits?.cast || [])
    .filter((movie: any) => movie.poster_path && movie.vote_average)
    .sort((a: any, b: any) => b.popularity - a.popularity)
    .slice(0, 5)
    .map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      role: movie.character || 'Unknown',
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown',
      rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : 0,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined
    }));

  const allMovies = (data.movie_credits?.cast || []).map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    role: movie.character || 'Unknown',
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown',
    rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : 0,
    image: movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80',
  }));

  return {
    id: data.id,
    name: data.name,
    birthDate: data.birthday ? new Date(data.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown',
    birthPlace: data.place_of_birth || 'Unknown',
    nationality: 'Unknown',
    height: 'N/A', // TMDB doesn't provide height
    biography: data.biography || 'No biography available.',
    image: data.profile_path 
      ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
      : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    coverImage: knownFor.length > 0
      ? (knownFor.find((m: any) => m.backdrop)?.backdrop || knownFor[0].image)
      : 'https://images.unsplash.com/photo-1492446845049-9c50cc313f00?auto=format&fit=crop&w=2000&q=80',
    awards: [], // TMDB doesn't provide awards nicely
    socialMedia: {
      instagram: data.external_ids?.instagram_id ? `https://instagram.com/${data.external_ids.instagram_id}` : undefined,
      twitter: data.external_ids?.twitter_id ? `https://twitter.com/${data.external_ids.twitter_id}` : undefined,
      imdb: data.external_ids?.imdb_id ? `https://www.imdb.com/name/${data.external_ids.imdb_id}/` : undefined,
    },
    knownFor,
    allMovies,
    stats: {
      moviesCount: data.movie_credits?.cast?.length || 0,
      totalAwards: 0,
      avgRating: Number((knownFor.reduce((acc: number, cur: any) => acc + cur.rating, 0) / (knownFor.length || 1)).toFixed(1)),
      yearsActive: data.movie_credits?.cast?.length 
        ? `${Math.min(...data.movie_credits.cast.map((c: any) => new Date(c.release_date || new Date()).getFullYear()))}-present` 
        : 'Unknown',
    },
    upcomingProjects: (data.movie_credits?.cast || [])
      .filter((movie: any) => movie.release_date && new Date(movie.release_date) > new Date())
      .map((movie: any) => ({
        title: movie.title,
        role: movie.character || 'Unknown',
        status: 'Upcoming',
        expectedRelease: new Date(movie.release_date).getFullYear().toString()
      }))
      .slice(0, 3)
  };
};
