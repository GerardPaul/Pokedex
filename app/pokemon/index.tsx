import { useCallback } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { PokemonGrid } from "@/components/PokemonGrid";
import { ScreenHeader } from "@/components/pixel";
import type { PokemonListItem } from "@/lib/pokeapi";

export default function PokemonScreen() {
  const router = useRouter();
  const handleSelect = useCallback((p: PokemonListItem) => router.push(`/pokemon/${p.id}` as any), [router]);
  return (
    <View className="flex-1">
      <ScreenHeader title="POKéDEX" />
      <PokemonGrid onSelectPokemon={handleSelect} />
    </View>
  );
}
