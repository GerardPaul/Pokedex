import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useSelection } from "@/context/SelectionContext";
import { useGeneration } from "@/hooks/useGeneration";

function PokemonDetailPanel() {
  const { pokemonDetail: detail, pokemonFlavorText: flavorText, pokemonDetailLoading: loading, pokemonDetailError: error } = useSelection();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color="#DC2626" />
        <Text className="text-slate-400 font-SpaceMono text-xs mt-2">Loading...</Text>
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-slate-500 font-SpaceMono text-xs text-center">
          {error ?? "Could not load Pokémon details."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 12 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Height / Weight */}
      <View className="flex-row gap-6 mb-3">
        <View>
          <Text className="text-[9px] text-slate-400 font-SpaceMono uppercase tracking-widest">Height</Text>
          <Text className="text-xs text-slate-700 font-SpaceMono mt-0.5">
            {(detail.height / 10).toFixed(1)} m
          </Text>
        </View>
        <View>
          <Text className="text-[9px] text-slate-400 font-SpaceMono uppercase tracking-widest">Weight</Text>
          <Text className="text-xs text-slate-700 font-SpaceMono mt-0.5">
            {(detail.weight / 10).toFixed(1)} kg
          </Text>
        </View>
      </View>

      {/* Flavor text */}
      <Text className="text-xs text-slate-600 font-SpaceMono leading-5 italic mb-3">
        {flavorText}
      </Text>

      {/* Base Stats */}
      <Text className="text-[10px] text-slate-400 font-SpaceMono mb-1 uppercase tracking-widest">
        Base Stats
      </Text>
      {detail.stats.map((s) => (
        <View key={s.stat.name} className="flex-row items-center mb-1">
          <Text className="text-[9px] text-slate-400 font-SpaceMono capitalize w-20">
            {s.stat.name.replace(/-/g, " ")}
          </Text>
          <Text className="text-[10px] text-slate-700 font-SpaceMono w-8 text-right">
            {s.base_stat}
          </Text>
          <View className="flex-1 h-1.5 bg-slate-200 rounded-full ml-2">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${Math.min((s.base_stat / 255) * 100, 100)}%` }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function GenerationDetailPanel() {
  const { generationId } = useSelection();
  const { generation, loading, error } = useGeneration(generationId);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color="#DC2626" />
        <Text className="text-slate-400 font-SpaceMono text-xs mt-2">Loading...</Text>
      </View>
    );
  }

  if (error || !generation) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-slate-500 font-SpaceMono text-xs text-center">
          {error ?? "Could not load generation details."}
        </Text>
      </View>
    );
  }

  const genNumber = generation.id;
  const region = generation.main_region.name;
  const games = generation.version_groups.map((vg) => vg.name.replace(/-/g, " "));
  const pokemonCount = generation.pokemon_species.length;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 12 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-xl font-PokemonSolid tracking-widest text-slate-800 capitalize">
        Generation {genNumber}
      </Text>

      <View className="flex-row mt-3 gap-4">
        <View>
          <Text className="text-[9px] text-slate-400 font-SpaceMono uppercase tracking-widest">
            Region
          </Text>
          <Text className="text-sm text-slate-700 font-SpaceMono capitalize mt-0.5">
            {region}
          </Text>
        </View>
        <View>
          <Text className="text-[9px] text-slate-400 font-SpaceMono uppercase tracking-widest">
            Pokémon
          </Text>
          <Text className="text-sm text-slate-700 font-SpaceMono mt-0.5">
            {pokemonCount}
          </Text>
        </View>
      </View>

      <Text className="text-[9px] text-slate-400 font-SpaceMono uppercase tracking-widest mt-3 mb-1">
        Games
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {games.map((game) => (
          <View
            key={game}
            className="bg-slate-100 rounded-lg px-2 py-1"
          >
            <Text className="text-[10px] text-slate-600 font-SpaceMono capitalize">
              {game}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function BottomPanel() {
  const { type } = useSelection();

  if (type === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-slate-300 font-SpaceMono text-xs">
          Select a Pokémon or Generation
        </Text>
      </View>
    );
  }

  if (type === "pokemon") return <PokemonDetailPanel />;
  if (type === "generation") return <GenerationDetailPanel />;

  return null;
}
