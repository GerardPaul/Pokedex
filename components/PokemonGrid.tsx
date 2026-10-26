import { View, Text, ActivityIndicator, FlatList, ScrollView, Pressable } from "react-native";
import { PokemonCard } from "@/components/PokemonCard";
import { SearchBar } from "@/components/SearchBar";
import { useFavorites } from "@/context/FavoritesContext";
import { usePokedexList } from "@/hooks/usePokedexList";
import { Image } from "expo-image";
import { TYPE_COLORS, typeIconUrl } from "@/lib/typeColors";
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
      contentContainerStyle={{ gap: 8, paddingHorizontal: 12, paddingVertical: 4, alignItems: "center" }}
      className="flex-grow-0"
    >
      {Object.entries(TYPE_COLORS).map(([type, color]) => {
        const active = selected === type;
        return (
          <Pressable
            key={type}
            onPress={() => onSelect(active ? null : type)}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{
              backgroundColor: color,
              // Dim the others while a filter is active; ring the selected one
              opacity: selected && !active ? 0.35 : 1,
              borderWidth: active ? 3 : 0,
              borderColor: "#1e293b",
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filter by ${type} type`}
          >
            <Image source={{ uri: typeIconUrl(type) }} style={{ width: 20, height: 20 }} cachePolicy="memory-disk" />
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
          <Text className="text-slate-400 font-SpaceMono text-sm mt-3">Loading Pokémon...</Text>
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
              <Text className="text-slate-400 font-SpaceMono text-sm text-center">{error ?? emptyText}</Text>
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
