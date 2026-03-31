import { useState, useEffect } from "react";
import { fetchGenerationDetail, type GenerationDetail } from "@/lib/pokeapi";

interface UseGenerationResult {
  generation: GenerationDetail | null;
  loading: boolean;
  error: string | null;
}

export function useGeneration(id: number | null): UseGenerationResult {
  const [generation, setGeneration] = useState<GenerationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setGeneration(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchGenerationDetail(id)
      .then((data) => {
        if (!cancelled) {
          setGeneration(data);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load generation details.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { generation, loading, error };
}
