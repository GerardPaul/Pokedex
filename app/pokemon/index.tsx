import { useRouter } from "expo-router";
import { useSelection } from "@/context/SelectionContext";
import { PokemonGrid } from "@/components/PokemonGrid";
import { usePokemonList } from "@/hooks/usePokemonList";
import type { PokemonListItem } from "@/lib/pokeapi";

export default function PokemonScreen() {
  const { pokemon, loading, loadingMore, error, hasMore, loadMore, search, searchQuery } =
    usePokemonList();
  const { selectPokemon } = useSelection();
  const router = useRouter();

  function handleSelect(p: PokemonListItem) {
    selectPokemon(p);
    router.push(`/pokemon/${p.id}` as any);
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
    />
  );
}
