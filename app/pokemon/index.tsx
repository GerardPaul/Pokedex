import { useSelection } from "@/context/SelectionContext";
import { PokemonGrid } from "@/components/PokemonGrid";
import { usePokemonList } from "@/hooks/usePokemonList";
import type { PokemonListItem } from "@/lib/pokeapi";

export default function PokemonScreen() {
  const { pokemon, loading, loadingMore, error, hasMore, loadMore, search, searchQuery } =
    usePokemonList();
  const { selectPokemon } = useSelection();

  function handleSelect(p: PokemonListItem) {
    selectPokemon(p);
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
