import { memo } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { PixelButton } from "@/components/pixel";
import type { PokemonListItem } from "@/lib/pokeapi";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onPress: (pokemon: PokemonListItem) => void;
  favorite?: boolean;
  tint?: string | null;
}

export const PokemonCard = memo(function PokemonCard({ pokemon, onPress, favorite, tint }: PokemonCardProps) {
  return (
    <PixelButton
      containerClassName="w-1/3 p-1"
      className="items-center px-1 pt-1 pb-2"
      tint={tint ? tint + "26" : undefined}
      onPress={() => onPress(pokemon)}
      accessibilityLabel={`${pokemon.name}, number ${pokemon.id}${favorite ? ", favorite" : ""}`}
    >
      <View className="w-full flex-row justify-between items-center px-0.5">
        <Text className="font-Pixel text-[8px] text-ink/60">#{String(pokemon.id).padStart(3, "0")}</Text>
        {favorite && <Text className="text-[12px] text-hp-yellow">★</Text>}
      </View>
      <Image
        source={{ uri: pokemon.sprite }}
        style={{ width: 72, height: 72 }}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={150}
        recyclingKey={`pokemon-${pokemon.id}`}
      />
      <Text className="font-PixelBody text-base text-ink text-center capitalize" numberOfLines={1}>
        {pokemon.name}
      </Text>
    </PixelButton>
  );
});
