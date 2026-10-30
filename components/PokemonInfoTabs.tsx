import { Fragment, useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { HpBar, PixelLoader, Sprite, tap } from "@/components/pixel";
import { useAsync } from "@/hooks/useAsync";
import { fetchEvolutionChain, type PokemonDetail, type PokemonSpecies } from "@/lib/pokeapi";
import colors from "@/lib/colors";

export type InfoTabKey = "stats" | "info" | "dex" | "evo";

/** The four info tabs, each mapped to one of the device's colored buttons. */
export const INFO_TABS: { key: InfoTabKey; label: string; color: string; side: string; round?: boolean }[] = [
  { key: "stats", label: "STATS", color: colors.btnGreen, side: colors.btnGreenSide, round: true },
  { key: "info", label: "INFO", color: colors.btnYellow, side: colors.btnYellowSide },
  { key: "dex", label: "DEX", color: colors.btnBlue, side: colors.btnBlueSide },
  { key: "evo", label: "EVO", color: colors.btnRed, side: colors.btnRedSide },
];

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

interface InfoTabContentProps {
  tab: InfoTabKey;
  detail: PokemonDetail;
  species: PokemonSpecies;
  routeFor: (id: number) => string;
}

/** What the device's lower screen shows for the selected info tab. */
export function InfoTabContent({ tab, detail, species, routeFor }: InfoTabContentProps) {
  if (tab === "info") return <InfoTab detail={detail} />;
  if (tab === "dex") return <DexTab species={species} />;
  if (tab === "evo") return <EvoTab url={species.evolutionChainUrl} currentId={detail.id} routeFor={routeFor} />;
  return <StatsTab detail={detail} />;
}

function Label({ children }: { children: string }) {
  return <Text className="font-Pixel text-[10px] text-shade mb-1.5">{children}</Text>;
}

function InfoTab({ detail }: { detail: PokemonDetail }) {
  return (
    <View>
      <View className="flex-row gap-10">
        <View>
          <Label>HEIGHT</Label>
          <Text className="font-PixelBody text-xl text-ink">{(detail.height / 10).toFixed(1)} m</Text>
        </View>
        <View>
          <Label>WEIGHT</Label>
          <Text className="font-PixelBody text-xl text-ink">{(detail.weight / 10).toFixed(1)} kg</Text>
        </View>
      </View>
      <View className="mt-4">
        <Label>ABILITIES</Label>
        {detail.abilities.map((a) => (
          <Text key={a.name} className="font-PixelBody text-xl text-ink capitalize">
            ▸ {a.name.replace(/-/g, " ")}
            {a.hidden ? <Text className="text-shade"> (hidden)</Text> : null}
          </Text>
        ))}
      </View>
    </View>
  );
}

function DexTab({ species }: { species: PokemonSpecies }) {
  const entries = species.flavorTexts;
  const [version, setVersion] = useState<string | null>(null);
  // Version names differ per Pokémon; reset the pick when the Pokémon changes
  useEffect(() => setVersion(null), [species.id]);
  const active = entries.find((e) => e.version === version) ?? entries[0];

  if (!active) return <Text className="font-PixelBody text-lg text-ink">No entry yet.</Text>;

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingBottom: 12 }}>
        {entries.map((e) => {
          const selected = e.version === active.version;
          return (
            <Pressable
              key={e.version}
              onPress={() => {
                tap();
                setVersion(e.version);
              }}
              className={`px-2 py-1.5 border-2 border-ink ${selected ? "bg-shell" : "bg-white/60"}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Text className={`font-Pixel text-[9px] uppercase ${selected ? "text-white" : "text-ink"}`}>
                {e.version.replace(/-/g, " ")}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Text className="font-PixelBody text-xl text-ink leading-7">{active.text}</Text>
    </View>
  );
}

function StatsTab({ detail }: { detail: PokemonDetail }) {
  const total = detail.stats.reduce((sum, s) => sum + s.value, 0);
  return (
    <View>
      {detail.stats.map((s) => (
        <HpBar key={s.name} label={STAT_LABELS[s.name] ?? s.name} value={s.value} />
      ))}
      <View className="flex-row items-center gap-2 pt-2 mt-1 border-t-2 border-shade/60">
        <Text className="font-Pixel text-[10px] text-ink w-16">TOTAL</Text>
        <Text className="font-Pixel text-[10px] text-shell w-9 text-right">{total}</Text>
      </View>
    </View>
  );
}

function EvoTab({ url, currentId, routeFor }: { url: string | null; currentId: number; routeFor: (id: number) => string }) {
  const { data: stages, loading } = useAsync(url ? () => fetchEvolutionChain(url) : null, [url]);

  if (loading) return <PixelLoader onScreen />;
  if (!stages || stages.length < 2) {
    return <Text className="font-PixelBody text-lg text-ink">This Pokémon does not evolve.</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center" }}>
      {stages.map((stage, i) => (
        <Fragment key={i}>
          {i > 0 && <Text className="font-Pixel text-[12px] text-ink mx-1">▶</Text>}
          <View className="gap-1">
            {stage.map((p) => {
              const current = p.id === currentId;
              return (
                <Pressable
                  key={p.id}
                  className={`items-center p-1 border-2 ${current ? "border-shell bg-white/50" : "border-transparent"}`}
                  onPress={() => {
                    if (current) return;
                    tap();
                    router.push(routeFor(p.id) as any);
                  }}
                  accessibilityLabel={`Go to ${p.name}`}
                  accessibilityRole="button"
                >
                  <Sprite id={p.id} size={64} animated={false} />
                  <Text className={`font-PixelBody text-base capitalize ${current ? "text-shell" : "text-ink"}`}>
                    {p.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Fragment>
      ))}
    </ScrollView>
  );
}
