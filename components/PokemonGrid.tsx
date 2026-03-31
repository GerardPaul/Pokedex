import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { PokemonCard } from "@/components/PokemonCard";
import { SearchBar } from "@/components/SearchBar";
import type { PokemonListItem } from "@/lib/pokeapi";

interface PokemonGridProps {
  pokemon: PokemonListItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  searchQuery: string;
  onLoadMore: () => void;
  onSearch: (query: string) => void;
  onSelectPokemon: (pokemon: PokemonListItem) => void;
  showSearch?: boolean;
}

export function PokemonGrid({
  pokemon,
  loading,
  loadingMore,
  error,
  hasMore,
  searchQuery,
  onLoadMore,
  onSearch,
  onSelectPokemon,
  showSearch = true,
}: PokemonGridProps) {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-slate-400 font-SpaceMono text-xs mt-3">
          Loading Pokémon...
        </Text>
      </View>
    );
  }

  if (error && pokemon.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        {showSearch && (
          <SearchBar value={searchQuery} onChangeText={onSearch} />
        )}
        <Text className="text-slate-500 font-SpaceMono text-xs text-center mt-4">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pokemon}
      keyExtractor={(item) => String(item.id)}
      numColumns={3}
      contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 8 }}
      ListHeaderComponent={
        showSearch ? (
          <SearchBar value={searchQuery} onChangeText={onSearch} />
        ) : null
      }
      ListFooterComponent={
        loadingMore ? (
          <View className="py-4 items-center">
            <ActivityIndicator size="small" color="#DC2626" />
          </View>
        ) : null
      }
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-10">
          <Text className="text-slate-400 font-SpaceMono text-xs text-center">
            No Pokémon found.
          </Text>
        </View>
      }
      onEndReached={hasMore ? onLoadMore : undefined}
      onEndReachedThreshold={0.4}
      renderItem={({ item }) => (
        <PokemonCard pokemon={item} onPress={onSelectPokemon} />
      )}
    />
  );
}
