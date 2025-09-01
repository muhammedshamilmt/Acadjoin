import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  cacheTime?: number; // Cache time in milliseconds
  staleTime?: number; // Time before data is considered stale
  debounceMs?: number; // Debounce time for search queries
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  pagination?: any;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry<any>>();

export function useOptimizedFetch<T>(
  url: string,
  options: FetchOptions = {},
  dependencies: any[] = []
): [FetchState<T>, (newUrl?: string, newOptions?: FetchOptions) => Promise<void>] {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    method = 'GET',
    headers = {},
    body,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    staleTime = 2 * 60 * 1000, // 2 minutes default
    debounceMs = 300, // 300ms default debounce
  } = options;

  const generateCacheKey = useCallback((url: string, options: FetchOptions) => {
    return `${method}:${url}:${JSON.stringify(options)}`;
  }, [method]);

  const isStale = useCallback((timestamp: number) => {
    return Date.now() - timestamp > staleTime;
  }, [staleTime]);

  const fetchData = useCallback(async (newUrl?: string, newOptions?: FetchOptions) => {
    const targetUrl = newUrl || url;
    const targetOptions = { ...options, ...newOptions };
    const cacheKey = generateCacheKey(targetUrl, targetOptions);

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && !isStale(cached.timestamp)) {
      setState({
        data: cached.data,
        loading: false,
        error: null,
        pagination: cached.pagination,
      });
      return Promise.resolve();
    }

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const fetchOptions: RequestInit = {
        method: targetOptions.method || method,
        headers: {
          'Content-Type': 'application/json',
          ...targetOptions.headers,
        },
        signal: abortControllerRef.current.signal,
      };

      if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(targetOptions.body || body);
      }

      const response = await fetch(targetUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the successful response
      cache.set(cacheKey, {
        data: data.registrations || data.reviews || data,
        timestamp: Date.now(),
        pagination: data.pagination,
      });

      // Clean up old cache entries
      const now = Date.now();
      for (const [key, entry] of cache.entries()) {
        if (now - entry.timestamp > cacheTime) {
          cache.delete(key);
        }
      }

      setState({
        data: data.registrations || data.reviews || data,
        loading: false,
        error: null,
        pagination: data.pagination,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, don't update state
        return Promise.resolve();
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, [url, options, generateCacheKey, isStale, method, body]);

  // Debounced search function
  const debouncedFetch = useCallback(
    async (newUrl?: string, newOptions?: FetchOptions) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      return new Promise<void>((resolve) => {
        debounceTimeoutRef.current = setTimeout(async () => {
          await fetchData(newUrl, newOptions);
          resolve();
        }, debounceMs);
      });
    },
    [fetchData, debounceMs]
  );

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, dependencies);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return [state, debouncedFetch as (newUrl?: string, newOptions?: FetchOptions) => Promise<void>  ];
}

// Specialized hook for paginated data
export function usePaginatedFetch<T>(
  baseUrl: string,
  initialPage: number = 1,
  initialLimit: number = 12,
  options: FetchOptions = {}
) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchQuery, setSearchQuery] = useState('');

  const url = `${baseUrl}?page=${page}&limit=${limit}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;

  const [state, fetchData] = useOptimizedFetch<T>(url, options, [page, limit, searchQuery]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  }, []);

  return {
    ...state,
    page,
    limit,
    searchQuery,
    goToPage,
    changeLimit,
    updateSearch,
    refetch: () => fetchData(),
  };
}

// Hook for search suggestions
export function useSearchSuggestions(
  baseUrl: string,
  query: string,
  options: FetchOptions = {}
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [
    options.method,
    options.headers ? JSON.stringify(options.headers) : undefined,
    options.body ? JSON.stringify(options.body) : undefined,
    options.cacheTime,
    options.staleTime,
    options.debounceMs
  ]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseUrl}?suggest=1&q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
          ...memoizedOptions,
        });

        if (!response.ok) return;

        const data = await response.json();
        if (data.success && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching suggestions:', error);
        }
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query, baseUrl, memoizedOptions]);

  return { suggestions, loading };
}
