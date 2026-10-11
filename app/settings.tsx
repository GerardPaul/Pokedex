import { useState } from "react";
import { View, Text, Pressable, Alert, Platform } from "react-native";
import { useAsync } from "@/hooks/useAsync";
import { cacheSize, clearCache } from "@/lib/cache";
import { useFavorites } from "@/context/FavoritesContext";

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
      {
        text: "Clear",
        style: "destructive",
        onPress: clear,
      },
    ]);
  }

  return (
    <View className="flex-1 bg-slate-100 px-6 pt-8">
      <Text className="text-2xl font-PokemonSolid text-slate-800 tracking-widest">SETTINGS</Text>

      <View className="bg-white rounded-xl border border-slate-200 mt-6 p-4">
        <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest">Cached data</Text>
        <Text className="text-base text-slate-700 font-SpaceMono mt-1">
          {size.loading ? "…" : size.data !== null ? formatBytes(size.data) : "Unknown"}
        </Text>
        <Text className="text-[11px] text-slate-400 font-SpaceMono mt-1">Clearing also removes cached images.</Text>
        <Pressable
          className="mt-3 self-start px-4 py-2 rounded-full bg-red-600 active:bg-red-700"
          onPress={confirmClear}
          accessibilityRole="button"
        >
          <Text className="text-white font-SpaceMono text-xs uppercase tracking-widest">Clear cache</Text>
        </Pressable>
      </View>

      <View className="bg-white rounded-xl border border-slate-200 mt-3 p-4">
        <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest">Favorites</Text>
        <Text className="text-base text-slate-700 font-SpaceMono mt-1">{favorites.size}</Text>
      </View>
    </View>
  );
}
