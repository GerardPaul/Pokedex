import { View, Text, ActivityIndicator, FlatList, ScrollView, Pressable } from "react-native";
import { PokemonCard } from "@/components/PokemonCard";
import { SearchBar } from "@/components/SearchBar";
import { useFavorites } from "@/context/FavoritesContext";
import { usePokedexList } from "@/hooks/usePokedexList";
import { TYPE_COLORS } from "@/lib/typeColors";
import type { PokemonListItem } from "@/lib/pokeapi";

interface PokemonGridProps {
  /** Restrict the grid to these ids (a generation, favorites). Omit for the full dex. */
  speciesIds?: Set<number>;
  loading?: boolean;
  onSelectPokemon: (pokemon: PokemonListItem) => void;
  emptyText?: string;
}

function TypeChips({ selected, onSelect }: { selected: string | null; onSelect: (t: string | null) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ gap: 6, paddingHorizontal: 12, paddingBottom: 8 }}
      className="flex-grow-0"
    >
      {Object.entries(TYPE_COLORS).map(([type, color]) => {
        const active = selected === type;
        return (
          <Pressable
            key={type}
            onPress={() => onSelect(active ? null : type)}
            className="px-3 py-1 rounded-full border"
            style={{ backgroundColor: active ? color : "transparent", borderColor: color }}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filter by ${type} type`}
          >
            <Text className="font-SpaceMono text-[10px] capitalize" style={{ color: active ? "#fff" : color }}>
              {type}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function PokemonGrid({ speciesIds, loading: extraLoading, onSelectPokemon, emptyText = "No Pokémon found." }: PokemonGridProps) {
  const { pokemon, loading, error, query, setQuery, selectedType, setSelectedType, activeType } =
    usePokedexList(speciesIds);
  const { favorites } = useFavorites();
  const tint = activeType ? TYPE_COLORS[activeType] : null;

  return (
    <View className="flex-1">
      {/* Search + filters stay mounted so the keyboard never dismisses while results load */}
      <SearchBar value={query} onChangeText={setQuery} />
      <TypeChips selected={selectedType} onSelect={setSelectedType} />

      {loading || extraLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#DC2626" />
          <Text className="text-slate-400 font-SpaceMono text-xs mt-3">Loading Pokémon...</Text>
        </View>
      ) : (
        <FlatList
          data={pokemon}
          extraData={favorites}
          keyExtractor={(item) => String(item.id)}
          numColumns={3}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 8 }}
          ListEmptyComponent={
            <View className="items-center justify-center py-10 px-6">
              <Text className="text-slate-400 font-SpaceMono text-xs text-center">{error ?? emptyText}</Text>
            </View>
          }
          initialNumToRender={18}
          maxToRenderPerBatch={18}
          windowSize={5}
          renderItem={({ item }) => (
            <PokemonCard pokemon={item} onPress={onSelectPokemon} favorite={favorites.has(item.id)} tint={tint} />
          )}
        />
      )}
    </View>
  );
}
