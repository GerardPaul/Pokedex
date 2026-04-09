import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { PokemonListItem, PokemonDetail, PokemonSpecies, GenerationDetail } from "@/lib/pokeapi";
import { usePokemon } from "@/hooks/usePokemon";
import { useGeneration } from "@/hooks/useGeneration";

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
  pokemonSpecies: PokemonSpecies | null;
  pokemonFlavorText: string;
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
    pokemon: null,
    generationId: null,
  });

  // Single fetch — shared by all consumers via context
  const { detail, species, flavorText, loading: pokemonLoading, error: pokemonError } = usePokemon(state.pokemon?.id ?? null);
  const { generation, loading: genLoading, error: genError } = useGeneration(state.generationId);

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
        pokemonSpecies: species,
        pokemonFlavorText: flavorText,
        pokemonDetailLoading: pokemonLoading,
        pokemonDetailError: pokemonError,
        generationDetail: generation,
        generationDetailLoading: genLoading,
        generationDetailError: genError,
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
