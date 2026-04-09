import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useSelection } from "@/context/SelectionContext";
import { spriteUrlFromId, shinyArtworkUrlFromId } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/typeColors";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  const { selectPokemon, pokemonDetail: detail, pokemonDetailLoading: loading, pokemonDetailError: error } = useSelection();

  useEffect(() => {
    selectPokemon({ id: numericId, name: "", sprite: spriteUrlFromId(numericId) });
  }, [numericId, selectPokemon]);

  const [showShiny, setShowShiny] = useState(false);

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
  const shinyUri = shinyArtworkUrlFromId(detail.id);

  return (
    <View className="flex-1 bg-slate-100 items-center justify-center px-6">
      <Image
        source={{ uri: showShiny ? shinyUri : artworkUri }}
        style={{ width: 200, height: 200 }}
        contentFit="contain"
        cachePolicy="disk"
        recyclingKey={`${showShiny ? "shiny" : "main"}-${detail.id}`}
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
            className="px-4 py-1 rounded-full"
            style={{ backgroundColor: TYPE_COLORS[t.type.name] ?? "#94a3b8" }}
          >
            <Text className="text-white text-xs font-SpaceMono capitalize">{t.type.name}</Text>
          </View>
        ))}
      </View>

      {/* Shiny toggle */}
      <Pressable
        className={`flex-row items-center gap-1 mt-4 px-4 py-1.5 rounded-full border ${
          showShiny ? "bg-yellow-400 border-yellow-400" : "bg-transparent border-slate-300"
        }`}
        onPress={() => setShowShiny((v) => !v)}
        accessibilityLabel="Toggle shiny"
        accessibilityRole="button"
      >
        <Text
          className={`font-SpaceMono text-xs uppercase tracking-widest ${
            showShiny ? "text-slate-900" : "text-slate-400"
          }`}
        >
          ✦ Shiny
        </Text>
      </Pressable>
    </View>
  );
}
