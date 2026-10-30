import { View, Text } from "react-native";
import { CachedImage } from "@/components/CachedImage";
import { PixelButton } from "@/components/pixel";
import colors from "@/lib/colors";
import { spriteUrlFromId, type GenerationListItem } from "@/lib/pokeapi";

export const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// Static per-generation data: region, accent color and the grass/fire/water starters
export const GEN_INFO: Record<number, { region: string; accent: string; starters: number[] }> = {
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
  const accent = info?.accent ?? colors.muted;

  return (
    <PixelButton
      containerClassName="w-1/2 p-1.5"
      className="items-center"
      onPress={() => onPress(generation)}
      accessibilityLabel={`Generation ${generation.id}, ${region} region`}
    >
      <View className="h-2 w-full" style={{ backgroundColor: accent }} />
      <View className="flex-row mt-2">
        {(info?.starters ?? []).map((id) => (
          <CachedImage key={id} uri={spriteUrlFromId(id)} style={{ width: 44, height: 44 }} contentFit="contain" />
        ))}
      </View>
      <Text className="font-Pixel text-[13px] text-ink mt-1">GEN {ROMAN[generation.id] ?? generation.id}</Text>
      <Text className="font-PixelBody text-lg mt-1 mb-2" style={{ color: accent }}>
        {region}
      </Text>
    </PixelButton>
  );
}
