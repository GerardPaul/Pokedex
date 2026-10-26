import { useState } from "react";
import { View, Text, Alert, Platform } from "react-native";
import { useAsync } from "@/hooks/useAsync";
import { cacheSize, clearCache } from "@/lib/cache";
import { useFavorites } from "@/context/FavoritesContext";
import { PixelBox, PixelButton, ScreenHeader } from "@/components/pixel";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function SettingsScreen() {
  const [version, setVersion] = useState(0);
  const size = useAsync(cacheSize, [version]);
  const { favorites } = useFavorites();

  function confirmClear() {
    const message = "Downloaded Pokémon data and images will be fetched again when needed. Favorites are kept.";
    const clear = () => clearCache().finally(() => setVersion((v) => v + 1));
    // Alert buttons are a no-op on react-native-web
    if (Platform.OS === "web") {
      if (window.confirm(message)) clear();
      return;
    }
    Alert.alert("Clear cache?", message, [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clear },
    ]);
  }

  return (
    <View className="flex-1">
      <ScreenHeader title="OPTIONS" />
      <View className="px-3 mt-2 gap-2">
        <PixelBox className="p-4">
          <Text className="font-Pixel text-[11px] text-ink">SAVE DATA</Text>
          <Text className="font-PixelBody text-2xl text-ink mt-2">
            {size.loading ? "…" : size.data !== null ? formatBytes(size.data) : "Unknown"}
          </Text>
          <Text className="font-PixelBody text-base text-ink/60">Cached Pokémon data. Clearing also removes cached images.</Text>
          <PixelButton
            containerClassName="self-start mt-3"
            className="px-3 py-2"
            tint="#E3350D"
            onPress={confirmClear}
            accessibilityLabel="Clear cache"
          >
            <Text className="font-Pixel text-[10px] text-white">CLEAR CACHE</Text>
          </PixelButton>
        </PixelBox>

        <PixelBox className="p-4 flex-row items-center justify-between">
          <Text className="font-Pixel text-[11px] text-ink">FAVORITES</Text>
          <Text className="font-Pixel text-[13px] text-ink">★ {favorites.size}</Text>
        </PixelBox>
      </View>
    </View>
  );
}
