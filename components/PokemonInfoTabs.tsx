import { Fragment, useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { HpBar, PixelBox, PixelButton, PixelLoader, Sprite, tap } from "@/components/pixel";
import { useAsync } from "@/hooks/useAsync";
import { fetchEvolutionChain, type PokemonDetail, type PokemonSpecies } from "@/lib/pokeapi";

type Tab = "info" | "dex" | "stats" | "evo";
const TABS: Tab[] = ["stats", "info", "dex", "evo"];

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SP.ATK",
  "special-defense": "SP.DEF",
  speed: "SPD",
};

interface PokemonInfoTabsProps {
  detail: PokemonDetail;
  species: PokemonSpecies | null;
  routeFor: (id: number) => string;
}

export function PokemonInfoTabs({ detail, species, routeFor }: PokemonInfoTabsProps) {
  const [tab, setTab] = useState<Tab>(TABS[0]);

  return (
    <View className="px-3">
      <View className="flex-row gap-1">
        {TABS.map((t) => (
          <PixelButton
            key={t}
            containerClassName="flex-1"
            className="py-2 items-center"
            tint={tab === t ? undefined : "#E8E0CC"}
            selected={tab === t}
            onPress={() => setTab(t)}
            accessibilityLabel={`${t} tab`}
          >
            <Text className={`font-Pixel text-[10px] ${tab === t ? "text-dex-red" : "text-ink"}`}>
              {tab === t ? "▶" : ""}
              {t.toUpperCase()}
            </Text>
          </PixelButton>
        ))}
      </View>

      <PixelBox containerClassName="mt-1" className="p-4">
        {tab === "info" && <InfoTab detail={detail} />}
        {tab === "dex" && <DexTab species={species} />}
        {tab === "stats" && <StatsTab detail={detail} />}
        {tab === "evo" && <EvoTab url={species?.evolutionChainUrl ?? null} currentId={detail.id} routeFor={routeFor} />}
      </PixelBox>
    </View>
  );
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

function DexTab({ species }: { species: PokemonSpecies | null }) {
  const entries = species?.flavorTexts ?? [];
  const [version, setVersion] = useState<string | null>(null);
  // Version names differ per Pokémon; reset the pick when the Pokémon changes
  useEffect(() => setVersion(null), [species?.id]);
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
              className={`px-2 py-1.5 border-2 border-ink ${selected ? "bg-dex-red" : "bg-cream"}`}
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
        <Text className="font-Pixel text-[10px] text-dex-red w-9 text-right">{total}</Text>
      </View>
    </View>
  );
}

function EvoTab({ url, currentId, routeFor }: { url: string | null; currentId: number; routeFor: (id: number) => string }) {
  const { data: stages, loading } = useAsync(url ? () => fetchEvolutionChain(url) : null, [url]);

  if (loading) return <PixelLoader />;
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
                  className={`items-center p-1 border-2 ${current ? "border-dex-red bg-cream" : "border-transparent"}`}
                  onPress={() => {
                    if (current) return;
                    tap();
                    router.push(routeFor(p.id) as any);
                  }}
                  accessibilityLabel={`Go to ${p.name}`}
                  accessibilityRole="button"
                >
                  <Sprite id={p.id} size={64} animated={false} />
                  <Text className={`font-PixelBody text-base capitalize ${current ? "text-dex-red" : "text-ink"}`}>
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
