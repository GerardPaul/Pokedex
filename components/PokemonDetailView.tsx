import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { CachedImage } from "@/components/CachedImage";
import { useFavorites } from "@/context/FavoritesContext";
import { useAsync } from "@/hooks/useAsync";
import { fetchAllPokemon, fetchPokemonDetail, fetchPokemonSpecies, shinyArtworkUrlFromId } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/typeColors";
import {
  GroundShadow,
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

const SLIDE = 90;

interface PokemonDetailViewProps {
  id: number;
  /** Ids this screen can step through with the prev/next arrows (e.g. one generation). Defaults to the full dex. */
  ids?: number[];
  /** Route param that holds the id, so prev/next can update it in place instead of opening a new screen. */
  stepParam: "id" | "pid";
  routeFor: (id: number) => string;
}

export function PokemonDetailView({ id, ids, stepParam, routeFor }: PokemonDetailViewProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const all = useAsync(ids ? null : fetchAllPokemon, [!!ids]);
  const data = useAsync(() => Promise.all([fetchPokemonDetail(id), fetchPokemonSpecies(id)]), [id]);
  const [shiny, setShiny] = useState(false);
  useEffect(() => setShiny(false), [id]);

  // Keep showing the previous Pokémon until the next one has loaded, so stepping never flashes a loader
  const fresh = data.data && data.data[0].id === id ? data.data : null;
  const last = useRef(fresh);
  if (fresh) last.current = fresh;
  const shown = fresh ?? last.current;

  // Prev/next slide only the Pokémon, entering from the side it came from
  const slide = useRef(new Animated.Value(0)).current;
  const direction = useRef(0);
  const shownId = shown?.[0].id;
  useEffect(() => {
    if (!direction.current) return;
    slide.setValue(direction.current * SLIDE);
    direction.current = 0;
    Animated.timing(slide, { toValue: 0, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [shownId, slide]);

  function step(targetId: number, dir: 1 | -1) {
    direction.current = dir;
    router.setParams({ [stepParam]: String(targetId) } as any);
  }

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

  if (!shown) {
    return (
      <View className="flex-1">
        {header}
        {data.error ? <Message text={data.error} /> : <PixelLoader />}
      </View>
    );
  }

  const [detail, species] = shown;
  const color = TYPE_COLORS[detail.types[0]] ?? "#94a3b8";
  const artwork = shiny ? shinyArtworkUrlFromId(detail.id) : detail.artwork;

  const stepIds = ids ?? all.data?.map((p) => p.id) ?? [];
  const index = stepIds.indexOf(id);
  const prevId = index > 0 ? stepIds[index - 1] : null;
  const nextId = index >= 0 && index < stepIds.length - 1 ? stepIds[index + 1] : null;

  return (
    <View className="flex-1">
      {header}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Hero: the arrows stay put, only the Pokémon slides */}
        <View className="px-3 mt-2">
          <PixelBox tint={color + "33"} className="py-3 px-2 flex-row items-center">
            <StepButton label="Previous Pokémon" arrow="◀" onPress={prevId === null ? null : () => step(prevId, -1)} />
            <View className="flex-1 overflow-hidden">
              <Animated.View
                style={{
                  alignItems: "center",
                  transform: [{ translateX: slide }],
                  opacity: slide.interpolate({ inputRange: [-SLIDE, 0, SLIDE], outputRange: [0, 1, 0] }),
                }}
              >
                <CachedImage
                  uri={artwork}
                  style={{ width: 170, height: 170, zIndex: 1 }}
                  contentFit="contain"
                  recyclingKey={`art-${detail.id}-${shiny}`}
                />
                <View style={{ marginTop: -16 }}>
                  <GroundShadow width={90} />
                </View>
                {/* Small animated sprite beside the artwork */}
                <View className="absolute right-0 bottom-0 items-center">
                  <View style={{ zIndex: 1 }}>
                    <Sprite id={detail.id} shiny={shiny} size={56} />
                  </View>
                  <View style={{ marginTop: -8 }}>
                    <GroundShadow width={40} />
                  </View>
                </View>
              </Animated.View>
            </View>
            <StepButton label="Next Pokémon" arrow="▶" onPress={nextId === null ? null : () => step(nextId, 1)} />
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

function StepButton({ label, arrow, onPress }: { label: string; arrow: string; onPress: (() => void) | null }) {
  return (
    <PixelButton className="px-2 py-2" disabled={!onPress} onPress={() => onPress?.()} accessibilityLabel={label}>
      <Text className="font-Pixel text-[12px] text-ink">{arrow}</Text>
    </PixelButton>
  );
}
