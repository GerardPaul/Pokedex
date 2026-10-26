import { memo } from "react";
import { Text, Pressable } from "react-native";
import { Image } from "expo-image";
import type { PokemonListItem } from "@/lib/pokeapi";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonListItem) => void;
  favorite?: boolean;
  tint?: string | null;
}

export const PokemonCard = memo(function PokemonCard({ pokemon, onPress, favorite, tint }: PokemonCardProps) {
  const paddedId = String(pokemon.id).padStart(3, "0");

  return (
    <Pressable
      className="w-[30%] m-[1.5%] bg-white rounded-xl p-2 items-center active:opacity-70 border border-slate-200"
      style={tint ? { backgroundColor: tint + "1A", borderColor: tint + "55" } : undefined}
      onPress={() => onPress(pokemon)}
      accessibilityLabel={`${pokemon.name}, number ${pokemon.id}${favorite ? ", favorite" : ""}`}
      accessibilityRole="button"
    >
      {favorite && <Text className="absolute top-1 right-1.5 text-[12px] text-yellow-500">★</Text>}
      <Image
        source={{ uri: pokemon.sprite }}
        style={{ width: 64, height: 64 }}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={200}
        recyclingKey={`pokemon-${pokemon.id}`}
      />
      <Text className="text-[12px] text-slate-400 font-SpaceMono mt-1">#{paddedId}</Text>
      <Text className="text-[13px] text-slate-700 font-SpaceMono text-center capitalize" numberOfLines={1}>
        {pokemon.name}
      </Text>
    </Pressable>
  );
});
