import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelection } from "@/context/SelectionContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useAsync } from "@/hooks/useAsync";
import { fetchAllPokemon, shinyArtworkUrlFromId } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/typeColors";

interface PokemonDetailViewProps {
  id: number;
  /** Ids this screen can step through with the prev/next arrows (e.g. one generation). Defaults to the full dex. */
  ids?: number[];
  routeFor: (id: number) => string;
}

export function PokemonDetailView({ id, ids, routeFor }: PokemonDetailViewProps) {
  const { selectPokemon, pokemonDetail, pokemonSpecies, pokemonDetailLoading, pokemonDetailError } = useSelection();
  const { isFavorite, toggleFavorite } = useFavorites();
  const all = useAsync(ids ? null : fetchAllPokemon, [!!ids]);
  const [showShiny, setShowShiny] = useState(false);

  useEffect(() => {
    selectPokemon(id);
    setShowShiny(false);
  }, [id, selectPokemon]);

  // Context may still hold the previous Pokémon for a frame after navigating
  const detail = pokemonDetail?.id === id ? pokemonDetail : null;

  if (pokemonDetailLoading || (!detail && !pokemonDetailError)) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-slate-400 font-SpaceMono text-xs mt-3">Loading...</Text>
      </View>
    );
  }

  if (!detail) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-6">
        <Text className="text-slate-500 font-SpaceMono text-xs text-center">
          {pokemonDetailError ?? "Could not load Pokémon."}
        </Text>
      </View>
    );
  }

  const stepIds = ids ?? all.data?.map((p) => p.id) ?? [];
  const index = stepIds.indexOf(id);
  const prevId = index > 0 ? stepIds[index - 1] : null;
  const nextId = index >= 0 && index < stepIds.length - 1 ? stepIds[index + 1] : null;

  const color = TYPE_COLORS[detail.types[0]] ?? "#94a3b8";
  const favorite = isFavorite(id);
  const artworkUri = showShiny ? shinyArtworkUrlFromId(id) : detail.artwork ?? "";

  return (
    <View className="flex-1 bg-slate-100 items-center justify-center px-6">
      {/* Type-tinted backdrop */}
      <View className="absolute inset-0" style={{ backgroundColor: color, opacity: 0.12 }} />
      <View
        className="absolute rounded-full"
        style={{ width: 280, height: 280, backgroundColor: color, opacity: 0.18 }}
      />

      {/* Favorite */}
      <Pressable
        className="absolute top-3 right-3 p-2"
        onPress={() => toggleFavorite(id)}
        accessibilityLabel={favorite ? "Remove from favorites" : "Add to favorites"}
        accessibilityRole="button"
        hitSlop={8}
      >
        <Ionicons name={favorite ? "star" : "star-outline"} size={24} color={favorite ? "#eab308" : "#64748b"} />
      </Pressable>

      <View className="flex-row items-center">
        <StepButton icon="chevron-back" targetId={prevId} routeFor={routeFor} label="Previous Pokémon" />
        <Image
          source={{ uri: artworkUri }}
          style={{ width: 200, height: 200 }}
          contentFit="contain"
          cachePolicy="memory-disk"
          transition={150}
          recyclingKey={`${showShiny ? "shiny" : "main"}-${id}`}
        />
        <StepButton icon="chevron-forward" targetId={nextId} routeFor={routeFor} label="Next Pokémon" />
      </View>

      <Text className="text-[11px] text-slate-500 font-SpaceMono mt-2">#{String(id).padStart(3, "0")}</Text>
      <Text className="text-3xl font-PokemonSolid capitalize text-slate-800 tracking-widest mt-1">{detail.name}</Text>
      {pokemonSpecies?.genus && (
        <Text className="text-xs text-slate-500 font-SpaceMono mt-1">{pokemonSpecies.genus}</Text>
      )}

      {/* Types */}
      <View className="flex-row mt-3 gap-2">
        {detail.types.map((t) => (
          <View key={t} className="px-4 py-1 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] ?? "#94a3b8" }}>
            <Text className="text-white text-xs font-SpaceMono capitalize">{t}</Text>
          </View>
        ))}
      </View>

      {/* Shiny toggle */}
      <Pressable
        className={`flex-row items-center gap-1 mt-4 px-4 py-1.5 rounded-full border ${
          showShiny ? "bg-yellow-400 border-yellow-400" : "bg-transparent border-slate-400"
        }`}
        onPress={() => setShowShiny((v) => !v)}
        accessibilityLabel="Toggle shiny"
        accessibilityRole="button"
        accessibilityState={{ selected: showShiny }}
      >
        <Text
          className={`font-SpaceMono text-xs uppercase tracking-widest ${showShiny ? "text-slate-900" : "text-slate-500"}`}
        >
          ✦ Shiny
        </Text>
      </Pressable>
    </View>
  );
}

function StepButton({
  icon,
  targetId,
  routeFor,
  label,
}: {
  icon: "chevron-back" | "chevron-forward";
  targetId: number | null;
  routeFor: (id: number) => string;
  label: string;
}) {
  return (
    <Pressable
      className="p-2"
      disabled={targetId === null}
      onPress={() => targetId !== null && router.replace(routeFor(targetId) as any)}
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={8}
    >
      <Ionicons name={icon} size={28} color={targetId === null ? "#cbd5e1" : "#475569"} />
    </Pressable>
  );
}
