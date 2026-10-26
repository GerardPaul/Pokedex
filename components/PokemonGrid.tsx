import { type ReactNode } from "react";
import { View, FlatList, ScrollView, Pressable } from "react-native";
import { PokemonCard } from "@/components/PokemonCard";
import { SearchBar } from "@/components/SearchBar";
import { Message, PixelLoader, TypeBadge, tap } from "@/components/pixel";
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
  /** Fixed content between the search/filters and the grid (e.g. generation info). */
  header?: ReactNode;
}

function TypeFilters({ selected, onSelect }: { selected: string | null; onSelect: (t: string | null) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ gap: 6, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" }}
      style={{ flexGrow: 0, flexShrink: 0 }}
    >
      {Object.keys(TYPE_COLORS).map((type) => {
        const active = selected === type;
        return (
          <Pressable
            key={type}
            onPress={() => {
              tap();
              onSelect(active ? null : type);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Filter by ${type} type`}
          >
            <TypeBadge type={type} iconOnly selected={active} dimmed={!!selected && !active} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function PokemonGrid({
  speciesIds,
  loading: extraLoading,
  onSelectPokemon,
  emptyText = "No Pokémon found.",
  header,
}: PokemonGridProps) {
  const { pokemon, loading, error, query, setQuery, selectedType, setSelectedType, activeType } =
    usePokedexList(speciesIds);
  const { favorites } = useFavorites();
  const tint = activeType ? TYPE_COLORS[activeType] : null;

  return (
    <View className="flex-1">
      {/* Search + filters stay mounted so the keyboard never dismisses while results load */}
      <SearchBar value={query} onChangeText={setQuery} />
      <TypeFilters selected={selectedType} onSelect={setSelectedType} />
      {header}

      {loading || extraLoading ? (
        <PixelLoader />
      ) : (
        <FlatList
          data={pokemon}
          extraData={favorites}
          keyExtractor={(item) => String(item.id)}
          numColumns={3}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
          ListEmptyComponent={<Message text={error ?? emptyText} />}
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
