import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { spriteUrlFromId, type GenerationListItem } from "@/lib/pokeapi";

// Static per-generation data: region, accent color and the grass/fire/water starters
const GEN_INFO: Record<number, { region: string; accent: string; starters: number[] }> = {
  1: { region: "Kanto", accent: "#ef4444", starters: [1, 4, 7] },
  2: { region: "Johto", accent: "#eab308", starters: [152, 155, 158] },
  3: { region: "Hoenn", accent: "#10b981", starters: [252, 255, 258] },
  4: { region: "Sinnoh", accent: "#6366f1", starters: [387, 390, 393] },
  5: { region: "Unova", accent: "#334155", starters: [495, 498, 501] },
  6: { region: "Kalos", accent: "#3b82f6", starters: [650, 653, 656] },
  7: { region: "Alola", accent: "#f97316", starters: [722, 725, 728] },
  8: { region: "Galar", accent: "#a855f7", starters: [810, 813, 816] },
  9: { region: "Paldea", accent: "#dc2626", starters: [906, 909, 912] },
};

interface GenerationCardProps {
  generation: GenerationListItem;
  onPress: (generation: GenerationListItem) => void;
}

export function GenerationCard({ generation, onPress }: GenerationCardProps) {
  const info = GEN_INFO[generation.id];
  const region = info?.region ?? "Unknown";
  const accent = info?.accent ?? "#94a3b8";

  return (
    <Pressable
      className="w-[46%] m-[2%] bg-white rounded-xl overflow-hidden items-center active:opacity-70 border border-slate-200"
      onPress={() => onPress(generation)}
      accessibilityLabel={`Generation ${generation.id}, ${region} region`}
      accessibilityRole="button"
    >
      <View className="h-1.5 w-full" style={{ backgroundColor: accent }} />
      <View className="flex-row mt-3">
        {(info?.starters ?? []).map((id) => (
          <Image
            key={id}
            source={{ uri: spriteUrlFromId(id) }}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        ))}
      </View>
      <Text className="text-base font-PokemonSolid tracking-widest text-slate-800 mt-1">Gen {generation.id}</Text>
      <Text className="text-xs font-SpaceMono mt-1 mb-3" style={{ color: accent }}>
        {region}
      </Text>
    </Pressable>
  );
}
