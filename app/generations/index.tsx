import { View, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useAsync } from "@/hooks/useAsync";
import { GenerationCard } from "@/components/GenerationCard";
import { Message, PixelLoader, ScreenHeader } from "@/components/pixel";
import { fetchGenerations, type GenerationListItem } from "@/lib/pokeapi";

export default function GenerationsScreen() {
  const { data: generations, loading, error } = useAsync(fetchGenerations, []);
  const router = useRouter();

  function handleSelect(gen: GenerationListItem) {
    router.push(`/generations/${gen.id}` as any);
  }

  return (
    <View className="flex-1">
      <ScreenHeader title="GENERATIONS" />
      {loading ? (
        <PixelLoader />
      ) : error ? (
        <Message text={error} />
      ) : (
        <FlatList
          data={generations}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={{ padding: 8, paddingBottom: 16 }}
          renderItem={({ item }) => <GenerationCard generation={item} onPress={handleSelect} />}
          accessibilityLabel="Generations list"
        />
      )}
    </View>
  );
}
