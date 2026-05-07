'use client';

/**
 * useApiData — Generic hook for fetching data from the API with loading/error states.
 * Falls back to provided default data if the API call fails (graceful degradation).
 */

import { useState, useEffect, useCallback } from 'react';

interface UseApiDataOptions<T> {
  fallback: T;
  skip?: boolean;
}

export function useApiData<T>(
  fetcher: () => Promise<{ data: T }>,
  options: UseApiDataOptions<T>,
) {
  const [data, setData] = useState<T>(options.fallback);
  const [isLoading, setIsLoading] = useState(!options.skip);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (options.skip) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetcher();
      setData(response.data);
    } catch (err: any) {
      console.warn('API fetch failed, using fallback data:', err?.message);
      setError(err?.message || 'Failed to fetch');
      // Keep fallback data
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, options.skip]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
