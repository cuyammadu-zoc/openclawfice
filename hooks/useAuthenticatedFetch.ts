import { useCallback } from 'react';

/**
 * Hook for making authenticated API requests.
 * Browser cookies carry the Better Auth session automatically.
 */
export function useAuthenticatedFetch() {
  const authenticatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return fetch(url, {
      ...options,
      credentials: 'include',
    });
  }, []);

  return authenticatedFetch;
}
