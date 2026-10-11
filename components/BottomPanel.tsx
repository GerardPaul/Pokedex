import { View, Text, ActivityIndicator, ScrollView, Pressable } from "react-native";
import { Fragment, useEffect, useState } from "react";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useSelection } from "@/context/SelectionContext";
import { useAsync } from "@/hooks/useAsync";
import { fetchEvolutionChain, spriteUrlFromId } from "@/lib/pokeapi";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

type PokemonTab = "info" | "dex" | "stats" | "evolution";

function statColor(value: number): string {
  if (value < 50) return "#ef4444";
  if (value < 90) return "#f59e0b";
  if (value < 120) return "#22c55e";
  return "#14b8a6";
}

function EvolutionChain({ url, currentId }: { url: string | null; currentId: number }) {
  const { data: stages, loading } = useAsync(url ? () => fetchEvolutionChain(url) : null, [url]);

  if (loading) return <ActivityIndicator size="small" color="#DC2626" />;
  if (!stages || stages.length < 2) {
    return <Text className="text-sm text-slate-400 font-SpaceMono italic">Does not evolve.</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center" }}>
      {stages.map((stage, i) => (
        <Fragment key={i}>
          {i > 0 && <Ionicons name="arrow-forward" size={16} color="#94a3b8" style={{ marginHorizontal: 4 }} />}
          <View className="gap-1">
            {stage.map((p) => (
              <Pressable
                key={p.id}
                className={`items-center rounded-lg p-1 ${p.id === currentId ? "bg-red-50" : "active:bg-slate-100"}`}
                onPress={() => p.id !== currentId && router.push(`/pokemon/${p.id}` as any)}
                accessibilityLabel={`Go to ${p.name}`}
                accessibilityRole="button"
              >
                <Image
                  source={{ uri: spriteUrlFromId(p.id) }}
                  style={{ width: 56, height: 56 }}
                  cachePolicy="memory-disk"
                />
                <Text
                  className={`text-[10px] font-SpaceMono capitalize ${
                    p.id === currentId ? "text-red-500" : "text-slate-600"
                  }`}
                >
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </Fragment>
      ))}
    </ScrollView>
  );
}

function PokemonDetailPanel() {
  const {
    pokemonDetail: detail,
    pokemonSpecies: species,
    pokemonDetailLoading: loading,
    pokemonDetailError: error,
  } = useSelection();

  const [activeTab, setActiveTab] = useState<PokemonTab>("info");
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  // Version names differ per Pokémon; reset the pick when the Pokémon changes
  useEffect(() => setSelectedVersion(null), [detail?.id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color="#DC2626" />
        <Text className="text-slate-400 font-SpaceMono text-sm mt-2">Loading...</Text>
      </View>
    );
  }

  if (error || !detail) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-slate-500 font-SpaceMono text-sm text-center">
          {error ?? "Could not load Pokémon details."}
        </Text>
      </View>
    );
  }

  const dexEntries = species?.flavorTexts ?? [];
  const activeDex = selectedVersion
    ? dexEntries.find((e) => e.version === selectedVersion)
    : dexEntries[0] ?? null;
  const statTotal = detail.stats.reduce((sum, s) => sum + s.value, 0);

  const tabs: { key: PokemonTab; label: string }[] = [
    { key: "info", label: "Info" },
    { key: "dex", label: "Pokédex" },
    { key: "stats", label: "Stats" },
    { key: "evolution", label: "Evo" },
  ];

  return (
    <View className="flex-1">
      {/* Tab bar */}
      <View className="flex-row border-b border-slate-200">
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            className={`flex-1 py-2 items-center ${activeTab === tab.key ? "border-b-2 border-red-500" : ""}`}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Text
              className={`font-SpaceMono text-xs uppercase tracking-widest ${
                activeTab === tab.key ? "text-red-500" : "text-slate-400"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Tab content */}
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>
        {activeTab === "info" && (
          <View>
            <View className="flex-row gap-8">
              <View>
                <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest">Height</Text>
                <Text className="text-sm text-slate-700 font-SpaceMono mt-0.5">
                  {(detail.height / 10).toFixed(1)} m
                </Text>
              </View>
              <View>
                <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest">Weight</Text>
                <Text className="text-sm text-slate-700 font-SpaceMono mt-0.5">
                  {(detail.weight / 10).toFixed(1)} kg
                </Text>
              </View>
            </View>
            <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest mt-3 mb-1">
              Abilities
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {detail.abilities.map((a) => (
                <View key={a.name} className="bg-slate-100 rounded-lg px-2 py-1">
                  <Text className="text-xs text-slate-600 font-SpaceMono capitalize">
                    {a.name.replace(/-/g, " ")}
                    {a.hidden ? " (hidden)" : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "dex" && (
          <View>
            {/* Game version buttons */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 6, paddingBottom: 10 }}
            >
              {dexEntries.map((entry) => {
                const isActive = entry.version === (selectedVersion ?? dexEntries[0]?.version);
                return (
                  <Pressable
                    key={entry.version}
                    onPress={() => setSelectedVersion(entry.version)}
                    className={`px-3 py-1 rounded-full border ${
                      isActive ? "bg-red-500 border-red-500" : "bg-transparent border-slate-300"
                    }`}
                  >
                    <Text className={`font-SpaceMono text-xs capitalize ${isActive ? "text-white" : "text-slate-500"}`}>
                      {entry.version.replace(/-/g, " ")}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {/* Description */}
            {activeDex ? (
              <Text className="text-sm text-slate-600 font-SpaceMono leading-6 italic">{activeDex.text}</Text>
            ) : (
              <Text className="text-sm text-slate-400 font-SpaceMono italic">No description available.</Text>
            )}
          </View>
        )}

        {activeTab === "stats" && (
          <View>
            {detail.stats.map((s) => (
              <View key={s.name} className="flex-row items-center mb-1.5">
                <Text className="text-xs text-slate-400 font-SpaceMono capitalize w-24">
                  {s.name.replace(/-/g, " ")}
                </Text>
                <Text className="text-xs text-slate-700 font-SpaceMono w-8 text-right">{s.value}</Text>
                <View className="flex-1 h-1.5 bg-slate-200 rounded-full ml-2">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((s.value / 255) * 100, 100)}%`,
                      backgroundColor: statColor(s.value),
                    }}
                  />
                </View>
              </View>
            ))}
            <View className="flex-row items-center mt-1 pt-1.5 border-t border-slate-200">
              <Text className="text-xs text-slate-500 font-SpaceMono uppercase w-24">Total</Text>
              <Text className="text-xs text-slate-800 font-SpaceMono w-8 text-right">{statTotal}</Text>
            </View>
          </View>
        )}

        {activeTab === "evolution" && (
          <EvolutionChain url={species?.evolutionChainUrl ?? null} currentId={detail.id} />
        )}
      </ScrollView>
    </View>
  );
}

function GenerationDetailPanel() {
  const { generationDetail: generation, generationDetailLoading: loading, generationDetailError: error } = useSelection();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color="#DC2626" />
        <Text className="text-slate-400 font-SpaceMono text-sm mt-2">Loading...</Text>
      </View>
    );
  }

  if (error || !generation) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-slate-500 font-SpaceMono text-sm text-center">
          {error ?? "Could not load generation details."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-PokemonSolid tracking-widest text-slate-800 capitalize">
        Generation {generation.id}
      </Text>

      <View className="flex-row mt-3 gap-4">
        <View>
          <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest">Region</Text>
          <Text className="text-base text-slate-700 font-SpaceMono capitalize mt-0.5">{generation.region}</Text>
        </View>
        <View>
          <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest">Pokémon</Text>
          <Text className="text-base text-slate-700 font-SpaceMono mt-0.5">{generation.speciesIds.length}</Text>
        </View>
      </View>

      <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest mt-3 mb-1">Games</Text>
      <View className="flex-row flex-wrap gap-2">
        {generation.games.map((game) => (
          <View key={game} className="bg-slate-100 rounded-lg px-2 py-1">
            <Text className="text-xs text-slate-600 font-SpaceMono capitalize">{game}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function BottomPanel() {
  const { type } = useSelection();

  if (type === null) {
    return (
      <View className="flex-1 items-center justify-center">
        <MaterialCommunityIcons name="pokeball" size={100} color="#e2e8f0" />
      </View>
    );
  }

  if (type === "pokemon") return <PokemonDetailPanel />;
  if (type === "generation") return <GenerationDetailPanel />;

  return null;
}
