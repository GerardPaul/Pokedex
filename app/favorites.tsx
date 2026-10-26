import { useCallback } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PokemonGrid } from "@/components/PokemonGrid";
import { ScreenHeader } from "@/components/pixel";
import { useFavorites } from "@/context/FavoritesContext";
import type { PokemonListItem } from "@/lib/pokeapi";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const handleSelect = useCallback((p: PokemonListItem) => router.push(`/pokemon/${p.id}` as any), [router]);
  return (
    <View className="flex-1">
      <ScreenHeader
        title="FAVORITES"
        right={<Text className="font-Pixel text-[11px] text-ink">★ {favorites.size}</Text>}
      />
      <PokemonGrid
        speciesIds={favorites}
        onSelectPokemon={handleSelect}
        emptyText="No favorites yet. Tap ★ on a Pokémon to add it here."
      />
    </View>
  );
}
