import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useGenerations } from "@/hooks/useGenerations";
import { GenerationCard } from "@/components/GenerationCard";
import { useSelection } from "@/context/SelectionContext";
import type { GenerationListItem } from "@/lib/pokeapi";

export default function GenerationsScreen() {
  const { generations, loading, error } = useGenerations();
  const { selectGeneration } = useSelection();
  const router = useRouter();

  function handleSelect(gen: GenerationListItem) {
    selectGeneration(gen.id);
    router.push(`/generations/${gen.id}` as any);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-slate-400 font-SpaceMono text-xs mt-3">Loading generations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 px-6">
        <Text className="text-slate-500 font-SpaceMono text-xs text-center">{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={generations}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      className="flex-1 bg-slate-100"
      contentContainerStyle={{ padding: 8 }}
      renderItem={({ item }) => (
        <GenerationCard
          generation={item}
          onPress={() => handleSelect(item)}
        />
      )}
      accessibilityLabel="Generations list"
    />
  );
}
