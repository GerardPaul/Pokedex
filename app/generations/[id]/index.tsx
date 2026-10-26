import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PokemonGrid } from "@/components/PokemonGrid";
import { GEN_INFO, ROMAN } from "@/components/GenerationCard";
import { PixelBox, ScreenHeader } from "@/components/pixel";
import { useAsync } from "@/hooks/useAsync";
import { fetchGenerationDetail, type PokemonListItem } from "@/lib/pokeapi";

export default function GenerationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const router = useRouter();

  const generation = useAsync(() => fetchGenerationDetail(numericId), [numericId]);
  const speciesIds = useMemo(() => new Set(generation.data?.speciesIds ?? []), [generation.data]);

  const handleSelect = useCallback(
    (p: PokemonListItem) => router.push(`/generations/${id}/pokemon/${p.id}` as any),
    [router, id]
  );

  const gen = generation.data;
  const accent = GEN_INFO[numericId]?.accent;

  return (
    <View className="flex-1">
      <ScreenHeader back title={`GEN ${ROMAN[numericId] ?? id}`} />
      <PokemonGrid
        speciesIds={speciesIds}
        loading={generation.loading}
        onSelectPokemon={handleSelect}
        emptyText={generation.error ?? "No Pokémon found in this generation."}
        header={
          gen && (
            <PixelBox containerClassName="mx-3 mb-1" className="px-3 py-2">
              <View className="flex-row items-center justify-between">
                <Text className="font-Pixel text-[11px] uppercase" style={{ color: accent }}>
                  {gen.region}
                </Text>
                <Text className="font-Pixel text-[10px] text-ink">{gen.speciesIds.length} POKéMON</Text>
              </View>
              <Text className="font-PixelBody text-base text-ink/70 capitalize mt-1" numberOfLines={2}>
                {gen.games.join(" · ")}
              </Text>
            </PixelBox>
          )
        }
      />
    </View>
  );
}
