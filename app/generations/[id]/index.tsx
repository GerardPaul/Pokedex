import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGenPokemonList } from "@/hooks/useGenPokemonList";
import { useSelection } from "@/context/SelectionContext";
import { PokemonGrid } from "@/components/PokemonGrid";
import type { PokemonListItem } from "@/lib/pokeapi";

export default function GenerationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { selectGeneration, selectPokemon } = useSelection();
  const router = useRouter();

  const {
    pokemon,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    search,
    searchQuery,
  } = useGenPokemonList(numericId);

  useEffect(() => {
    selectGeneration(numericId);
  }, [numericId]);

  function handleSelect(p: PokemonListItem) {
    selectPokemon(p);
    router.push(`/generations/${id}/pokemon/${p.id}` as any);
  }

  return (
    <PokemonGrid
      pokemon={pokemon}
      loading={loading}
      loadingMore={loadingMore}
      error={error}
      hasMore={hasMore}
      searchQuery={searchQuery}
      onLoadMore={loadMore}
      onSearch={search}
      onSelectPokemon={handleSelect}
      showSearch
    />
  );
}
