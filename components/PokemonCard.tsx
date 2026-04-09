import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import type { PokemonListItem } from "@/lib/pokeapi";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonListItem) => void;
}

export function PokemonCard({ pokemon, onPress }: PokemonCardProps) {
  const paddedId = String(pokemon.id).padStart(3, "0");

  return (
    <Pressable
      className="w-[30%] m-[1.5%] bg-white rounded-xl p-2 items-center active:bg-slate-100"
      onPress={() => onPress(pokemon)}
      accessibilityLabel={`${pokemon.name}, number ${pokemon.id}`}
      accessibilityRole="button"
    >
      <Image
        source={{ uri: pokemon.sprite }}
        style={{ width: 64, height: 64 }}
        contentFit="contain"
        cachePolicy="disk"
        transition={200}
        recyclingKey={`pokemon-${pokemon.id}`}
      />
      <Text className="text-[10px] text-slate-400 font-SpaceMono mt-1">
        #{paddedId}
      </Text>
      <Text
        className="text-[11px] text-slate-700 font-SpaceMono text-center capitalize"
        numberOfLines={1}
      >
        {pokemon.name}
      </Text>
    </Pressable>
  );
}
