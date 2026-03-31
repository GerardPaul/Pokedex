import { useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { usePokemon } from "@/hooks/usePokemon";
import { useSelection } from "@/context/SelectionContext";
import { spriteUrlFromId } from "@/lib/pokeapi";

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

export default function GenPokemonDetailScreen() {
  const { pid } = useLocalSearchParams<{ pid: string }>();
  const numericPid = Number(pid);
  const { detail, species, flavorText, loading, error } = usePokemon(numericPid);
  const { selectPokemon } = useSelection();

  useEffect(() => {
    if (detail) {
      selectPokemon({ id: detail.id, name: detail.name, sprite: spriteUrlFromId(detail.id) });
    } else if (numericPid) {
      selectPokemon({ id: numericPid, name: "", sprite: spriteUrlFromId(numericPid) });
    }
  }, [detail, numericPid]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-slate-400 font-SpaceMono text-xs mt-3">Loading...</Text>
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-6">
        <Text className="text-slate-500 font-SpaceMono text-xs text-center">
          {error ?? "Could not load Pokémon."}
        </Text>
      </View>
    );
  }

  const paddedId = String(detail.id).padStart(3, "0");
  const artworkUri =
    detail.sprites.other["official-artwork"].front_default ??
    detail.sprites.front_default ??
    "";
  const generationName =
    species?.generation?.name?.replace("generation-", "Gen ").toUpperCase() ?? "";

  return (
    <ScrollView className="flex-1 bg-slate-100" contentContainerStyle={{ padding: 16 }}>
      <View className="items-center">
        <Image
          source={{ uri: artworkUri }}
          style={{ width: 160, height: 160 }}
          contentFit="contain"
          recyclingKey={`gen-pokemon-${detail.id}`}
        />
        <Text className="text-[11px] text-slate-400 font-SpaceMono">#{paddedId}</Text>
        <Text className="text-2xl font-PokemonSolid capitalize text-slate-800 tracking-widest mt-1">
          {detail.name}
        </Text>
        <Text className="text-xs text-slate-400 font-SpaceMono mt-0.5">{generationName}</Text>

        {/* Types */}
        <View className="flex-row mt-2 gap-2">
          {detail.types.map((t) => (
            <View
              key={t.type.name}
              className={`px-3 py-1 rounded-full ${TYPE_COLORS[t.type.name] ?? "bg-slate-400"}`}
            >
              <Text className="text-white text-xs font-SpaceMono capitalize">{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Height / Weight */}
      <View className="flex-row justify-center gap-8 mt-4">
        <View className="items-center">
          <Text className="text-[10px] text-slate-400 font-SpaceMono uppercase tracking-widest">
            Height
          </Text>
          <Text className="text-sm text-slate-700 font-SpaceMono mt-0.5">
            {(detail.height / 10).toFixed(1)} m
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-[10px] text-slate-400 font-SpaceMono uppercase tracking-widest">
            Weight
          </Text>
          <Text className="text-sm text-slate-700 font-SpaceMono mt-0.5">
            {(detail.weight / 10).toFixed(1)} kg
          </Text>
        </View>
      </View>

      {/* Flavor text */}
      <Text className="text-xs text-slate-600 font-SpaceMono mt-4 leading-5 italic text-center px-2">
        {flavorText}
      </Text>

      {/* Base Stats */}
      <Text className="text-[10px] text-slate-400 font-SpaceMono uppercase tracking-widest mt-5 mb-2">
        Base Stats
      </Text>
      {detail.stats.map((s) => (
        <View key={s.stat.name} className="flex-row items-center mb-2">
          <Text className="text-[10px] text-slate-400 font-SpaceMono capitalize w-24">
            {s.stat.name.replace(/-/g, " ")}
          </Text>
          <Text className="text-xs text-slate-700 font-SpaceMono w-8 text-right">
            {s.base_stat}
          </Text>
          <View className="flex-1 h-2 bg-slate-200 rounded-full ml-2">
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
