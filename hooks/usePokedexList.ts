import { useMemo, useState } from "react";
import { fetchAllPokemon, fetchPokemonIdsByType, filterPokemon } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/typeColors";
import { useAsync } from "./useAsync";

/** Full dex filtered locally by search text, type chip and (optionally) a fixed id set like a generation or favorites. */
export function usePokedexList(speciesIds?: Set<number>) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Typing an exact type name ("fire") still works as a type search
  const typedType = query.trim().toLowerCase() in TYPE_COLORS ? query.trim().toLowerCase() : null;
  const activeType = selectedType ?? typedType;

  const all = useAsync(fetchAllPokemon, []);
  const typeIds = useAsync(activeType ? () => fetchPokemonIdsByType(activeType) : null, [activeType]);

  const pokemon = useMemo(
    () =>
      filterPokemon(all.data ?? [], {
        query: typedType && !selectedType ? "" : query,
        typeIds: activeType ? new Set(typeIds.data ?? []) : undefined,
        speciesIds,
      }),
    [all.data, query, activeType, typedType, selectedType, typeIds.data, speciesIds]
  );

  return {
    pokemon,
    loading: all.loading || typeIds.loading,
    error: all.error ?? typeIds.error,
    query,
    setQuery,
    selectedType,
    setSelectedType,
    activeType,
  };
}
