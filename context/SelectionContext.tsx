import { createContext, useContext, useState, type ReactNode } from "react";
import type { PokemonListItem, GenerationListItem } from "@/lib/pokeapi";

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
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SelectionState>({
    type: null,
    pokemon: null,
    generationId: null,
  });

  function selectPokemon(pokemon: PokemonListItem) {
    setState({ type: "pokemon", pokemon, generationId: null });
  }

  function selectGeneration(id: number) {
    setState({ type: "generation", pokemon: null, generationId: id });
  }

  function clearSelection() {
    setState({ type: null, pokemon: null, generationId: null });
  }

  return (
    <SelectionContext.Provider
      value={{ ...state, selectPokemon, selectGeneration, clearSelection }}
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
