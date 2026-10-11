import { useCallback, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useSelection } from "@/context/SelectionContext";
import { PokemonGrid } from "@/components/PokemonGrid";
import { useAsync } from "@/hooks/useAsync";
import { fetchGenerationDetail, type PokemonListItem } from "@/lib/pokeapi";

export default function GenerationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { selectGeneration } = useSelection();
  const router = useRouter();

  // Fetched here (memory-cached) rather than read from the selection context,
  // so opening a Pokémon doesn't blank this grid and reset its scroll position.
  const generation = useAsync(() => fetchGenerationDetail(numericId), [numericId]);
  const speciesIds = useMemo(() => new Set(generation.data?.speciesIds ?? []), [generation.data]);

  useFocusEffect(
    useCallback(() => {
      selectGeneration(numericId);
    }, [numericId, selectGeneration])
  );

  const handleSelect = useCallback(
    (p: PokemonListItem) => router.push(`/generations/${id}/pokemon/${p.id}` as any),
    [router, id]
  );

  return (
    <PokemonGrid
      speciesIds={speciesIds}
      loading={generation.loading}
      onSelectPokemon={handleSelect}
      emptyText={generation.error ?? "No Pokémon found in this generation."}
    />
  );
}
