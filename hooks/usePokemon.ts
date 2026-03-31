import { useState, useEffect } from "react";
import {
  fetchPokemonDetail,
  fetchPokemonSpecies,
  getFlavorText,
  type PokemonDetail,
  type PokemonSpecies,
} from "@/lib/pokeapi";

interface UsePokemonResult {
  detail: PokemonDetail | null;
  species: PokemonSpecies | null;
  flavorText: string;
  loading: boolean;
  error: string | null;
}

export function usePokemon(id: number | null): UsePokemonResult {
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [flavorText, setFlavorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setDetail(null);
      setSpecies(null);
      setFlavorText("");
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchPokemonDetail(id), fetchPokemonSpecies(id)])
      .then(([d, s]) => {
        if (cancelled) return;
        setDetail(d);
        setSpecies(s);
        setFlavorText(getFlavorText(s));
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load Pokémon details.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { detail, species, flavorText, loading, error };
}
