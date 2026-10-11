import { useCallback } from "react";
import { useRouter } from "expo-router";
import { PokemonGrid } from "@/components/PokemonGrid";
import { useFavorites } from "@/context/FavoritesContext";
import type { PokemonListItem } from "@/lib/pokeapi";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const handleSelect = useCallback((p: PokemonListItem) => router.push(`/pokemon/${p.id}` as any), [router]);
  return (
    <PokemonGrid
      speciesIds={favorites}
      onSelectPokemon={handleSelect}
      emptyText="No favorites yet. Tap ☆ on a Pokémon to add it here."
    />
  );
}
