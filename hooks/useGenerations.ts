import { useState, useEffect } from "react";
import { fetchGenerations, type GenerationListItem } from "@/lib/pokeapi";

interface UseGenerationsResult {
  generations: GenerationListItem[];
  loading: boolean;
  error: string | null;
}

export function useGenerations(): UseGenerationsResult {
  const [generations, setGenerations] = useState<GenerationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenerations()
      .then((data) => {
        setGenerations(data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load generations. Please check your connection.");
      })
      .finally(() => setLoading(false));
  }, []);

  return { generations, loading, error };
}
