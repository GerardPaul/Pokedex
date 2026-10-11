import { useLocalSearchParams } from "expo-router";
import { PokemonDetailView } from "@/components/PokemonDetailView";
import { useAsync } from "@/hooks/useAsync";
import { fetchGenerationDetail } from "@/lib/pokeapi";

export default function GenPokemonDetailScreen() {
  const { id, pid } = useLocalSearchParams<{ id: string; pid: string }>();
  const generation = useAsync(() => fetchGenerationDetail(Number(id)), [id]);
  return (
    <PokemonDetailView
      id={Number(pid)}
      ids={generation.data?.speciesIds ?? [Number(pid)]}
      routeFor={(next) => `/generations/${id}/pokemon/${next}`}
    />
  );
}
