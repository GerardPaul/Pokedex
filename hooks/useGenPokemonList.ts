import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchPokemonByType,
  searchPokemonByName,
  type PokemonListItem,
  type GenerationDetail,
  spriteUrlFromId,
} from "@/lib/pokeapi";

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

function idFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return Number(parts[parts.length - 1]);
}

export function useGenPokemonList(generationId: number, generationDetail: GenerationDetail | null = null): UseGenPokemonListResult {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PokemonListItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sorted species list derived from the already-fetched generationDetail — no extra API call
  const sortedSpecies = generationDetail
    ? [...generationDetail.pokemon_species].sort((a, b) => idFromUrl(a.url) - idFromUrl(b.url))
    : [];

  const total = sortedSpecies.length;
  const pagedItems: PokemonListItem[] = sortedSpecies.slice(0, page * PAGE_SIZE).map((s) => {
    const id = idFromUrl(s.url);
    return { id, name: s.name, sprite: spriteUrlFromId(id) };
  });
  const hasMore = page * PAGE_SIZE < total;

  // Reset pagination when generation changes
  useEffect(() => {
    setPage(1);
    setSearchQuery("");
    setSearchResults(null);
    setSearchError(null);
  }, [generationId]);

  const loadMore = useCallback(() => {
    if (!hasMore || searchQuery) return;
    setPage((p) => p + 1);
  }, [hasMore, searchQuery]);

  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      if (!query.trim()) {
        setSearchResults(null);
        setSearchError(null);
        return;
      }

      searchTimeout.current = setTimeout(async () => {
        setSearchLoading(true);
        setSearchError(null);
        try {
          const byName = await searchPokemonByName(query.trim());
          if (byName.length > 0) {
            setSearchResults(byName);
          } else {
            const byType = await fetchPokemonByType(query.trim());
            if (byType.length > 0) {
              setSearchResults(byType);
            } else {
              setSearchResults([]);
              setSearchError(`No Pokémon found for "${query}" in this generation.`);
            }
          }
        } catch {
          setSearchResults([]);
          setSearchError(`No Pokémon found for "${query}" in this generation.`);
        } finally {
          setSearchLoading(false);
        }
      }, 700);
    },
    []
  );

  const refresh = useCallback(() => {
    setPage(1);
    setSearchQuery("");
    setSearchResults(null);
    setSearchError(null);
  }, []);

  const loading = !generationDetail && !searchQuery;
  const loadingMore = false;
  const activePokemon = searchResults !== null ? searchResults : pagedItems;
  const activeError = searchError;

  return {
    pokemon: activePokemon,
    loading: loading || searchLoading,
    loadingMore,
    error: activeError,
    hasMore: searchResults !== null ? false : hasMore,
    loadMore,
    search,
    searchQuery,
    total,
    refresh,
  };
}
