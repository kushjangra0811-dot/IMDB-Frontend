import { globalRateLimiter } from './rateLimiter';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (endpoint: string, params: Record<string, string | number> = {}, fetchOptions: RequestInit = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  const response = await globalRateLimiter.fetchWithResilience(url.toString(), {
    ...fetchOptions,
    headers: {
      'Accept': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }

  return response.json();
};

// Define interfaces based on what the app already uses
export interface Movie {
  id: number;
  title: string;
  rating: number; // map from vote_average
  image: string; // map from poster_path
  year: number; // map from release_date
  genre: string[]; // map from genre_ids
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
  year: movie.release_date ? new Date(movie.release_date).getFullYear() : 2024,
  genre: (movie.genre_ids || []).map((id: number) => GENRE_MAP[id] || 'Other').slice(0, 3),
});

// Cursor-based fetching for lists
export const getTrendingMovies = async ({ pageParam = 1 }: { pageParam?: number }, fetchOptions?: RequestInit) => {
  const data = await fetchFromTMDB('/trending/movie/week', { page: pageParam }, fetchOptions);
  return {
    results: data.results.map(mapTMDBMovie),
    nextCursor: data.page < data.total_pages ? data.page + 1 : undefined,
  };
};

export const getUpcomingMovies = async ({ pageParam = 1 }: { pageParam?: number }, fetchOptions?: RequestInit) => {
  const data = await fetchFromTMDB('/movie/upcoming', { page: pageParam }, fetchOptions);
  return {
    results: data.results.map(mapTMDBMovie),
    nextCursor: data.page < data.total_pages ? data.page + 1 : undefined,
  };
};

export const getTopRatedMovies = async ({ pageParam = 1 }: { pageParam?: number }, fetchOptions?: RequestInit) => {
  const data = await fetchFromTMDB('/movie/top_rated', { page: pageParam }, fetchOptions);
  return {
    results: data.results.map(mapTMDBMovie),
    nextCursor: data.page < data.total_pages ? data.page + 1 : undefined,
  };
};

export const getMovieDetails = async (id: string, fetchOptions?: RequestInit) => {
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
    cast: (data.credits?.cast || []).slice(0, 5).map((c: any) => ({
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
