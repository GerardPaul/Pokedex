import { View, Text, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { GenerationListItem } from "@/lib/pokeapi";

const REGION_NAMES: Record<number, string> = {
  1: "Kanto",
  2: "Johto",
  3: "Hoenn",
  4: "Sinnoh",
  5: "Unova",
  6: "Kalos",
  7: "Alola",
  8: "Galar",
  9: "Paldea",
};

interface GenerationCardProps {
  generation: GenerationListItem;
  onPress: (generation: GenerationListItem) => void;
}

export function GenerationCard({ generation, onPress }: GenerationCardProps) {
  const region = REGION_NAMES[generation.id] ?? "Unknown";

  return (
    <Pressable
      className="w-[46%] m-[2%] bg-white rounded-xl p-4 items-center active:bg-slate-100"
      onPress={() => onPress(generation)}
      accessibilityLabel={`Generation ${generation.id}, ${region} region`}
      accessibilityRole="button"
    >
      <MaterialIcons name="catching-pokemon" size={40} color="#DC2626" />
      <Text className="text-base font-PokemonSolid tracking-widest text-slate-800 mt-2">
        Gen {generation.id}
      </Text>
      <Text className="text-xs font-SpaceMono text-slate-400 mt-1">{region}</Text>
    </Pressable>
  );
}
