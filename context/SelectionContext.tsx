import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { PokemonListItem, PokemonDetail } from "@/lib/pokeapi";
import { usePokemon } from "@/hooks/usePokemon";

type SelectionType = "pokemon" | "generation" | null;

interface SelectionState {
  type: SelectionType;
  pokemon: PokemonListItem | null;
  generationId: number | null;
}

interface SelectionContextValue extends SelectionState {
  selectPokemon: (pokemon: PokemonListItem) => void;
  selectGeneration: (id: number) => void;
  clearSelection: () => void;
  pokemonDetail: PokemonDetail | null;
  pokemonFlavorText: string;
  pokemonDetailLoading: boolean;
  pokemonDetailError: string | null;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SelectionState>({
    type: null,
    pokemon: null,
    generationId: null,
  });

  // Single fetch — shared by all consumers via context
  const { detail, flavorText, loading, error } = usePokemon(state.pokemon?.id ?? null);

  const selectPokemon = useCallback((pokemon: PokemonListItem) => {
    setState({ type: "pokemon", pokemon, generationId: null });
  }, []);

  const selectGeneration = useCallback((id: number) => {
    setState({ type: "generation", pokemon: null, generationId: id });
  }, []);

  const clearSelection = useCallback(() => {
    setState({ type: null, pokemon: null, generationId: null });
  }, []);

  return (
    <SelectionContext.Provider
      value={{
        ...state,
        selectPokemon,
        selectGeneration,
        clearSelection,
        pokemonDetail: detail,
        pokemonFlavorText: flavorText,
        pokemonDetailLoading: loading,
        pokemonDetailError: error,
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
