import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getTrendingMovies, getUpcomingMovies, getTopRatedMovies, getMovieDetails, getActorDetails } from '../lib/api/tmdbClient';

export const useTrendingMovies = () => {
  return useInfiniteQuery({
    queryKey: ['movies', 'trending'],
    queryFn: getTrendingMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useUpcomingMovies = () => {
  return useInfiniteQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: getUpcomingMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useTopRatedMovies = () => {
  return useInfiniteQuery({
    queryKey: ['movies', 'topRated'],
    queryFn: getTopRatedMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useMovieDetails = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour for details
    gcTime: 1000 * 60 * 60 * 2, // 2 hours for details
  });
};

export const useActorDetails = (id: string) => {
  return useQuery({
    queryKey: ['actor', id],
    queryFn: () => getActorDetails(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour for details
    gcTime: 1000 * 60 * 60 * 2, // 2 hours for details
    retry: false, // Fail fast instead of hanging on 404
  });
};
