import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { CachedImage } from "@/components/CachedImage";
import { useFavorites } from "@/context/FavoritesContext";
import { useAsync } from "@/hooks/useAsync";
import { fetchAllPokemon, fetchPokemonDetail, fetchPokemonSpecies, shinyArtworkUrlFromId } from "@/lib/pokeapi";
import Svg, { Polygon } from "react-native-svg";
import colors from "@/lib/colors";
import {
  DeviceButton,
  Message,
  PixelBox,
  PixelButton,
  PixelLoader,
  PokeballEmblem,
  ScreenHeader,
  Sprite,
  TriangleButton,
  TypeBadge,
  tap,
} from "@/components/pixel";
import { INFO_TABS, InfoTabContent, type InfoTabKey } from "@/components/PokemonInfoTabs";

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
  const [tab, setTab] = useState<InfoTabKey>("stats");
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
  const artwork = shiny ? shinyArtworkUrlFromId(detail.id) : detail.artwork;

  const stepIds = ids ?? all.data?.map((p) => p.id) ?? [];
  const index = stepIds.indexOf(id);
  const prevId = index > 0 ? stepIds[index - 1] : null;
  const nextId = index >= 0 && index < stepIds.length - 1 ? stepIds[index + 1] : null;

  return (
    <View className="flex-1">
      {header}
      <ScrollView className="bg-body" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Red shell: the top screen between the ◀ ▶ triangles; only the Pokémon slides */}
        <View className="bg-shell pt-7 px-1.5" style={{ zIndex: 1 }}>
          <View className="flex-row items-center">
            <TriangleButton
              direction="left"
              accessibilityLabel="Previous Pokémon"
              onPress={prevId === null ? null : () => step(prevId, -1)}
            />
            <View className="flex-1 mx-1.5">
              <PixelBox cut={16} className="flex-1 overflow-hidden" style={{ height: 250 }}>
                <View className="flex-row items-start justify-between px-2 pt-2" style={{ zIndex: 1 }}>
                  <View className="gap-1">
                    {detail.types.map((t) => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </View>
                  <PixelButton
                    className="px-2 py-1"
                    bezel={false}
                    cut={4}
                    tint={shiny ? colors.hpYellow : colors.platform}
                    selected={shiny}
                    onPress={() => setShiny((v) => !v)}
                    accessibilityLabel="Toggle shiny"
                  >
                    <Text className="font-Pixel text-[9px] text-ink">✦ SHINY</Text>
                  </PixelButton>
                </View>
                <Animated.View
                  className="absolute inset-0 items-center justify-center"
                  style={{
                    transform: [{ translateX: slide }],
                    opacity: slide.interpolate({ inputRange: [-SLIDE, 0, SLIDE], outputRange: [0, 1, 0] }),
                  }}
                >
                  <CachedImage
                    uri={artwork}
                    style={{ width: 170, height: 170, marginTop: 16 }}
                    contentFit="contain"
                    recyclingKey={`art-${detail.id}-${shiny}`}
                  />
                  {/* Small animated sprite beside the artwork */}
                  <View className="absolute right-1" style={{ bottom: 22 }}>
                    <Sprite id={detail.id} shiny={shiny} size={52} />
                  </View>
                </Animated.View>
              </PixelBox>
              {/* Poké Ball emblem sitting on the screen's top edge */}
              <View className="absolute self-center" style={{ top: -24 }}>
                <PokeballEmblem size={44} />
              </View>
            </View>
            <TriangleButton
              direction="right"
              accessibilityLabel="Next Pokémon"
              onPress={nextId === null ? null : () => step(nextId, 1)}
            />
          </View>

          {/* White platform straddling the shell and the body */}
          <View className="items-center" style={{ marginBottom: -34 }}>
            <NamePlatform name={detail.name} genus={species.genus} />
          </View>
        </View>

        {/* Slate body with the red trim, the lower screen and the device buttons */}
        <View className="px-3 pt-12">
          <View className="px-2 pb-3 pt-2">
            <PixelBox cut={16} className="p-4" style={{ minHeight: 190 }}>
              <InfoTabContent tab={tab} detail={detail} species={species} routeFor={routeFor} />
            </PixelBox>
            <View className="flex-row items-start justify-between mt-4 px-1">
              <Grille />
              {INFO_TABS.map((t) => (
                <DeviceButton
                  key={t.key}
                  label={t.label}
                  color={t.color}
                  sideColor={t.side}
                  round={t.round}
                  selected={tab === t.key}
                  onPress={() => setTab(t.key)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/** The white trapezoid platform from the device, carrying the name and category. */
function NamePlatform({ name, genus }: { name: string; genus: string | null }) {
  return (
    <View style={{ width: 280 }}>
      <Svg width={280} height={64} viewBox="0 0 280 64" style={{ position: "absolute" }}>
        <Polygon points="34,1 246,1 279,52 1,52" fill={colors.platform} stroke={colors.ink} strokeWidth={2} />
        <Polygon points="1,52 279,52 279,63 1,63" fill={colors.steel} stroke={colors.ink} strokeWidth={2} />
      </Svg>
      <View className="items-center justify-center" style={{ height: 52 }}>
        <Text className="font-Pixel text-[14px] text-ink uppercase" numberOfLines={1}>
          {name}
        </Text>
        {genus && <Text className="font-PixelBody text-sm text-shade">{genus}</Text>}
      </View>
      <View style={{ height: 12 }} />
    </View>
  );
}

/** Speaker grille next to the device buttons. */
function Grille() {
  return (
    <View className="flex-row gap-1 pt-1">
      {Array.from({ length: 5 }, (_, i) => (
        <View key={i} className="bg-body-dark border border-ink" style={{ width: 5, height: 34 }} />
      ))}
    </View>
  );
}
