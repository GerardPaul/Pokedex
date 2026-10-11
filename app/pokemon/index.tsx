import { useCallback } from "react";
import { useRouter } from "expo-router";
import { PokemonGrid } from "@/components/PokemonGrid";
import type { PokemonListItem } from "@/lib/pokeapi";

export default function PokemonScreen() {
  const router = useRouter();
  const handleSelect = useCallback((p: PokemonListItem) => router.push(`/pokemon/${p.id}` as any), [router]);
  return <PokemonGrid onSelectPokemon={handleSelect} />;
}
