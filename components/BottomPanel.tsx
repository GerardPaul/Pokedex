import { View, Text, ActivityIndicator, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useSelection } from "@/context/SelectionContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type PokemonTab = "info" | "dex" | "stats";

function PokemonDetailPanel() {
  const {
    pokemonDetail: detail,
    pokemonSpecies: species,
    pokemonDetailLoading: loading,
    pokemonDetailError: error,
  } = useSelection();

  const [activeTab, setActiveTab] = useState<PokemonTab>("info");
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

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

  // Deduplicated english flavor texts keyed by version name
  const dexEntries: { version: string; text: string }[] = [];
  if (species) {
    const seen = new Set<string>();
    for (const entry of species.flavor_text_entries) {
      if (entry.language.name !== "en") continue;
      const ver = entry.version.name;
      if (seen.has(ver)) continue;
      seen.add(ver);
      dexEntries.push({ version: ver, text: entry.flavor_text.replace(/\f|\n/g, " ") });
    }
  }

  const activeDex = selectedVersion
    ? dexEntries.find((e) => e.version === selectedVersion)
    : dexEntries[0] ?? null;

  const tabs: { key: PokemonTab; label: string }[] = [
    { key: "info", label: "Info" },
    { key: "dex", label: "Pokédex" },
    { key: "stats", label: "Stats" },
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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "info" && (
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
                const isActive =
                  entry.version === (selectedVersion ?? dexEntries[0]?.version);
                return (
                  <Pressable
                    key={entry.version}
                    onPress={() => setSelectedVersion(entry.version)}
                    className={`px-3 py-1 rounded-full border ${
                      isActive
                        ? "bg-red-500 border-red-500"
                        : "bg-transparent border-slate-300"
                    }`}
                  >
                    <Text
                      className={`font-SpaceMono text-xs capitalize ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}
                    >
                      {entry.version.replace(/-/g, " ")}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {/* Description */}
            {activeDex ? (
              <Text className="text-sm text-slate-600 font-SpaceMono leading-6 italic">
                {activeDex.text}
              </Text>
            ) : (
              <Text className="text-sm text-slate-400 font-SpaceMono italic">
                No description available.
              </Text>
            )}
          </View>
        )}

        {activeTab === "stats" && (
          <View>
            {detail.stats.map((s) => (
              <View key={s.stat.name} className="flex-row items-center mb-1.5">
                <Text className="text-xs text-slate-400 font-SpaceMono capitalize w-24">
                  {s.stat.name.replace(/-/g, " ")}
                </Text>
                <Text className="text-xs text-slate-700 font-SpaceMono w-8 text-right">
                  {s.base_stat}
                </Text>
                <View className="flex-1 h-1.5 bg-slate-200 rounded-full ml-2">
                  <View
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${Math.min((s.base_stat / 255) * 100, 100)}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
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

  const genNumber = generation.id;
  const region = generation.main_region.name;
  const games = generation.version_groups.map((vg) => vg.name.replace(/-/g, " "));
  const pokemonCount = generation.pokemon_species.length;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 12 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-PokemonSolid tracking-widest text-slate-800 capitalize">
        Generation {genNumber}
      </Text>

      <View className="flex-row mt-3 gap-4">
        <View>
          <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest">
            Region
          </Text>
          <Text className="text-base text-slate-700 font-SpaceMono capitalize mt-0.5">
            {region}
          </Text>
        </View>
        <View>
          <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest">
            Pokémon
          </Text>
          <Text className="text-base text-slate-700 font-SpaceMono mt-0.5">
            {pokemonCount}
          </Text>
        </View>
      </View>

      <Text className="text-[11px] text-slate-400 font-SpaceMono uppercase tracking-widest mt-3 mb-1">
        Games
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {games.map((game) => (
          <View
            key={game}
            className="bg-slate-100 rounded-lg px-2 py-1"
          >
            <Text className="text-xs text-slate-600 font-SpaceMono capitalize">
              {game}
            </Text>
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
