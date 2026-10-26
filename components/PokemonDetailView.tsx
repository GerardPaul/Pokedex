import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { useFavorites } from "@/context/FavoritesContext";
import { useAsync } from "@/hooks/useAsync";
import { fetchAllPokemon, fetchPokemonDetail, fetchPokemonSpecies } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/typeColors";
import {
  BattlePlatform,
  Message,
  PixelBox,
  PixelButton,
  PixelLoader,
  ScreenHeader,
  Sprite,
  TypeBadge,
  tap,
} from "@/components/pixel";
import { PokemonInfoTabs } from "@/components/PokemonInfoTabs";

interface PokemonDetailViewProps {
  id: number;
  /** Ids this screen can step through with the prev/next arrows (e.g. one generation). Defaults to the full dex. */
  ids?: number[];
  routeFor: (id: number) => string;
}

export function PokemonDetailView({ id, ids, routeFor }: PokemonDetailViewProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const all = useAsync(ids ? null : fetchAllPokemon, [!!ids]);
  const data = useAsync(() => Promise.all([fetchPokemonDetail(id), fetchPokemonSpecies(id)]), [id]);
  const [shiny, setShiny] = useState(false);
  useEffect(() => setShiny(false), [id]);

  const favorite = isFavorite(id);
  const header = (
    <ScreenHeader
      back
      title={`#${String(id).padStart(3, "0")}`}
      right={
        <Pressable
          onPress={() => {
            tap();
            toggleFavorite(id);
          }}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Text className={`text-xl ${favorite ? "text-hp-yellow" : "text-shade"}`}>★</Text>
        </Pressable>
      }
    />
  );

  // useAsync keeps the previous result for a frame after `id` changes
  const ready = data.data && data.data[0].id === id ? data.data : null;
  if (!ready) {
    return (
      <View className="flex-1">
        {header}
        {data.error ? <Message text={data.error} /> : <PixelLoader />}
      </View>
    );
  }

  const [detail, species] = ready;
  const color = TYPE_COLORS[detail.types[0]] ?? "#94a3b8";

  const stepIds = ids ?? all.data?.map((p) => p.id) ?? [];
  const index = stepIds.indexOf(id);
  const prevId = index > 0 ? stepIds[index - 1] : null;
  const nextId = index >= 0 && index < stepIds.length - 1 ? stepIds[index + 1] : null;

  return (
    <View className="flex-1">
      {header}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Battle-screen hero */}
        <View className="px-3 mt-2">
          <PixelBox tint={color + "33"} className="py-4 px-2 flex-row items-center justify-between">
            <StepButton label="Previous Pokémon" arrow="◀" targetId={prevId} routeFor={routeFor} />
            <View className="items-center">
              <View style={{ height: 150, justifyContent: "flex-end", zIndex: 1 }}>
                <Sprite id={id} shiny={shiny} size={140} />
              </View>
              <View style={{ marginTop: -22 }}>
                <BattlePlatform color={color} width={170} />
              </View>
            </View>
            <StepButton label="Next Pokémon" arrow="▶" targetId={nextId} routeFor={routeFor} />
          </PixelBox>
        </View>

        {/* Name plate */}
        <View className="items-center mt-3 px-4">
          <Text className="font-Pixel text-lg text-ink uppercase text-center">{detail.name}</Text>
          {species.genus && <Text className="font-PixelBody text-lg text-ink/70 mt-1">{species.genus}</Text>}
          <View className="flex-row gap-2 mt-3">
            {detail.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </View>
          <PixelButton
            containerClassName="mt-3"
            className="px-3 py-1.5"
            tint={shiny ? "#F8D030" : undefined}
            selected={shiny}
            onPress={() => setShiny((v) => !v)}
            accessibilityLabel="Toggle shiny"
          >
            <Text className="font-Pixel text-[10px] text-ink">✦ SHINY</Text>
          </PixelButton>
        </View>

        <View className="mt-4">
          <PokemonInfoTabs detail={detail} species={species} routeFor={routeFor} />
        </View>
      </ScrollView>
    </View>
  );
}

function StepButton({
  label,
  arrow,
  targetId,
  routeFor,
}: {
  label: string;
  arrow: string;
  targetId: number | null;
  routeFor: (id: number) => string;
}) {
  return (
    <PixelButton
      className="px-2 py-2"
      disabled={targetId === null}
      onPress={() => targetId !== null && router.replace(routeFor(targetId) as any)}
      accessibilityLabel={label}
    >
      <Text className="font-Pixel text-[12px] text-ink">{arrow}</Text>
    </PixelButton>
  );
}
