import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchPokemonPage,
  fetchPokemonByType,
  searchPokemonByName,
  type PokemonListItem,
} from "@/lib/pokeapi";

const PAGE_SIZE = 20;

interface UsePokemonListResult {
  pokemon: PokemonListItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  search: (query: string) => void;
  searchQuery: string;
  refresh: () => void;
}

export function usePokemonList(): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPage = useCallback(async (pageNum: number, append: boolean) => {
    try {
      const items = await fetchPokemonPage(pageNum);
      setPokemon((prev) => (append ? [...prev, ...items] : items));
      setHasMore(items.length === PAGE_SIZE);
      setError(null);
    } catch (e) {
      setError("Failed to load Pokémon. Please check your connection.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (searchQuery) return;
    setLoading(true);
    setPage(1);
    loadPage(1, false);
  }, [loadPage, searchQuery]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || searchQuery) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, true);
  }, [loadingMore, hasMore, page, loadPage, searchQuery]);

  const search = useCallback((query: string) => {
    setSearchQuery(query);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!query.trim()) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      loadPage(1, false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        // Try name exact match first
        const byName = await searchPokemonByName(query.trim());
        if (byName.length > 0) {
          setPokemon(byName);
          setHasMore(false);
        } else {
          // Fall back to type search
          const byType = await fetchPokemonByType(query.trim());
          if (byType.length > 0) {
            setPokemon(byType);
            setHasMore(false);
          } else {
            setPokemon([]);
            setHasMore(false);
            setError(`No Pokémon found for "${query}".`);
          }
        }
      } catch {
        setPokemon([]);
        setHasMore(false);
        setError(`No Pokémon found for "${query}".`);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [loadPage]);

  const refresh = useCallback(() => {
    setSearchQuery("");
    setLoading(true);
    setPage(1);
    setHasMore(true);
    loadPage(1, false);
  }, [loadPage]);

  return { pokemon, loading, loadingMore, error, hasMore, loadMore, search, searchQuery, refresh };
}
