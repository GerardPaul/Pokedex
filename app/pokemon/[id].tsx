import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { usePokemon } from "@/hooks/usePokemon";
import { useEffect } from "react";
import { useSelection } from "@/context/SelectionContext";
import { spriteUrlFromId } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/typeColors";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { detail, loading, error } = usePokemon(numericId);
  const { selectPokemon } = useSelection();

  useEffect(() => {
    if (detail) {
      selectPokemon({ id: detail.id, name: detail.name, sprite: spriteUrlFromId(detail.id) });
    }
  }, [detail]);

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

  return (
    <View className="flex-1 bg-slate-100 items-center justify-center px-6">
      <Image
        source={{ uri: artworkUri }}
        style={{ width: 200, height: 200 }}
        contentFit="contain"
        recyclingKey={`main-${detail.id}`}
      />
      <Text className="text-[11px] text-slate-400 font-SpaceMono mt-2">#{paddedId}</Text>
      <Text className="text-3xl font-PokemonSolid capitalize text-slate-800 tracking-widest mt-1">
        {detail.name}
      </Text>

      {/* Types */}
      <View className="flex-row mt-3 gap-2">
        {detail.types.map((t) => (
          <View
            key={t.type.name}
            className={`px-4 py-1 rounded-full ${TYPE_COLORS[t.type.name] ?? "bg-slate-400"}`}
          >
            <Text className="text-white text-xs font-SpaceMono capitalize">{t.type.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
