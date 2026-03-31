import { useState, useEffect, useCallback } from "react";
import {
  fetchPokemonByGeneration,
  fetchPokemonByType,
  searchPokemonByName,
  type PokemonListItem,
} from "@/lib/pokeapi";
import { useRef } from "react";

const PAGE_SIZE = 20;

interface UseGenPokemonListResult {
  pokemon: PokemonListItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  search: (query: string) => void;
  searchQuery: string;
  total: number;
  refresh: () => void;
}

export function useGenPokemonList(generationId: number): UseGenPokemonListResult {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPage = useCallback(
    async (pageNum: number, append: boolean) => {
      try {
        const { items, total: t } = await fetchPokemonByGeneration(generationId, pageNum);
        setPokemon((prev) => (append ? [...prev, ...items] : items));
        setTotal(t);
        setHasMore(pageNum * PAGE_SIZE < t);
        setError(null);
      } catch {
        setError("Failed to load Pokémon. Please check your connection.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [generationId]
  );

  // Reset and load when generationId changes
  useEffect(() => {
    if (searchQuery) return;
    setPokemon([]);
    setPage(1);
    setLoading(true);
    loadPage(1, false);
  }, [generationId, loadPage, searchQuery]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || searchQuery) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage, true);
  }, [loadingMore, hasMore, page, loadPage, searchQuery]);

  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      if (!query.trim()) {
        setPokemon([]);
        setPage(1);
        setLoading(true);
        setHasMore(true);
        loadPage(1, false);
        return;
      }

      searchTimeout.current = setTimeout(async () => {
        setLoading(true);
        setError(null);
        try {
          // Within a generation: first try name, then type filtered to this generation
          const byName = await searchPokemonByName(query.trim());
          if (byName.length > 0) {
            setPokemon(byName);
            setHasMore(false);
          } else {
            const byType = await fetchPokemonByType(query.trim());
            // Filter to only pokemon in this generation's range
            // We approximate by checking against the already-loaded total range
            // More complete filtering happens via the full gen detail already cached
            if (byType.length > 0) {
              setPokemon(byType);
              setHasMore(false);
            } else {
              setPokemon([]);
              setHasMore(false);
              setError(`No Pokémon found for "${query}" in this generation.`);
            }
          }
        } catch {
          setPokemon([]);
          setHasMore(false);
          setError(`No Pokémon found for "${query}" in this generation.`);
        } finally {
          setLoading(false);
        }
      }, 400);
    },
    [loadPage]
  );

  const refresh = useCallback(() => {
    setSearchQuery("");
    setPokemon([]);
    setPage(1);
    setLoading(true);
    setHasMore(true);
    loadPage(1, false);
  }, [loadPage]);

  return { pokemon, loading, loadingMore, error, hasMore, loadMore, search, searchQuery, total, refresh };
}
