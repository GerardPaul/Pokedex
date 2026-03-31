import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useSelection } from "@/context/SelectionContext";
import { usePokemon } from "@/hooks/usePokemon";
import { useGeneration } from "@/hooks/useGeneration";

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-slate-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-400",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-700",
  dark: "bg-slate-700",
  steel: "bg-slate-500",
  fairy: "bg-pink-300",
};

function PokemonDetailPanel() {
  const { pokemon } = useSelection();
  const { detail, flavorText, loading, error } = usePokemon(pokemon?.id ?? null);

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

  const paddedId = String(detail.id).padStart(3, "0");
  const artworkUri =
    detail.sprites.other["official-artwork"].front_default ??
    detail.sprites.front_default ??
    "";

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 12 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row">
        {/* Artwork */}
        <Image
          source={{ uri: artworkUri }}
          style={{ width: 96, height: 96 }}
          contentFit="contain"
          recyclingKey={`detail-${detail.id}`}
        />

        {/* Info */}
        <View className="flex-1 ml-3 justify-center">
          <Text className="text-[10px] text-slate-400 font-SpaceMono">#{paddedId}</Text>
          <Text className="text-lg font-PokemonSolid capitalize text-slate-800 tracking-widest">
            {detail.name}
          </Text>

          {/* Types */}
          <View className="flex-row flex-wrap mt-1 gap-1">
            {detail.types.map((t) => (
              <View
                key={t.type.name}
                className={`px-2 py-0.5 rounded-full ${TYPE_COLORS[t.type.name] ?? "bg-slate-400"}`}
              >
                <Text className="text-white text-[10px] font-SpaceMono capitalize">
                  {t.type.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Height / Weight */}
          <View className="flex-row mt-2 gap-4">
            <View>
              <Text className="text-[9px] text-slate-400 font-SpaceMono">Height</Text>
              <Text className="text-xs text-slate-700 font-SpaceMono">
                {(detail.height / 10).toFixed(1)} m
              </Text>
            </View>
            <View>
              <Text className="text-[9px] text-slate-400 font-SpaceMono">Weight</Text>
              <Text className="text-xs text-slate-700 font-SpaceMono">
                {(detail.weight / 10).toFixed(1)} kg
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Flavor text */}
      <Text className="text-xs text-slate-600 font-SpaceMono mt-3 leading-5 italic">
        {flavorText}
      </Text>

      {/* Base Stats */}
      <Text className="text-[10px] text-slate-400 font-SpaceMono mt-3 mb-1 uppercase tracking-widest">
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
              className="h-full bg-red-500 rounded-full"
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
