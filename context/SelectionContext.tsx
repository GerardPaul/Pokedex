import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  fetchGenerationDetail,
  fetchPokemonDetail,
  fetchPokemonSpecies,
  type PokemonDetail,
  type PokemonSpecies,
  type GenerationDetail,
} from "@/lib/pokeapi";
import { useAsync } from "@/hooks/useAsync";

type SelectionType = "pokemon" | "generation" | null;

interface SelectionState {
  type: SelectionType;
  pokemonId: number | null;
  generationId: number | null;
}

interface SelectionContextValue extends SelectionState {
  selectPokemon: (id: number) => void;
  selectGeneration: (id: number) => void;
  clearSelection: () => void;
  pokemonDetail: PokemonDetail | null;
  pokemonSpecies: PokemonSpecies | null;
  pokemonDetailLoading: boolean;
  pokemonDetailError: string | null;
  generationDetail: GenerationDetail | null;
  generationDetailLoading: boolean;
  generationDetailError: string | null;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SelectionState>({
    type: null,
    pokemonId: null,
    generationId: null,
  });

  // Single fetch — shared by all consumers via context
  const { pokemonId, generationId } = state;
  const pokemon = useAsync(
    pokemonId === null ? null : () => Promise.all([fetchPokemonDetail(pokemonId), fetchPokemonSpecies(pokemonId)]),
    [pokemonId]
  );
  const generation = useAsync(generationId === null ? null : () => fetchGenerationDetail(generationId), [generationId]);

  const selectPokemon = useCallback((id: number) => {
    setState({ type: "pokemon", pokemonId: id, generationId: null });
  }, []);

  const selectGeneration = useCallback((id: number) => {
    setState({ type: "generation", pokemonId: null, generationId: id });
  }, []);

  const clearSelection = useCallback(() => {
    setState({ type: null, pokemonId: null, generationId: null });
  }, []);

  return (
    <SelectionContext.Provider
      value={{
        ...state,
        selectPokemon,
        selectGeneration,
        clearSelection,
        pokemonDetail: pokemon.data?.[0] ?? null,
        pokemonSpecies: pokemon.data?.[1] ?? null,
        pokemonDetailLoading: pokemon.loading,
        pokemonDetailError: pokemon.error,
        generationDetail: generation.data,
        generationDetailLoading: generation.loading,
        generationDetailError: generation.error,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}
