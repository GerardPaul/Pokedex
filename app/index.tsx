import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useAsync } from "@/hooks/useAsync";
import { fetchAllPokemon, fetchPokemonDetail } from "@/lib/pokeapi";
import { TYPE_COLORS } from "@/lib/typeColors";

const QUICK_LINKS = [
  { label: "Pokédex", route: "/pokemon" },
  { label: "Generations", route: "/generations" },
  { label: "Favorites", route: "/favorites" },
];

// Same Pokémon for everyone all day, changes at local midnight
async function fetchPokemonOfTheDay() {
  const all = await fetchAllPokemon();
  const now = new Date();
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
  return fetchPokemonDetail(all[day % all.length].id);
}

export default function IndexScreen() {
  const { data: daily } = useAsync(fetchPokemonOfTheDay, []);
  const color = daily ? TYPE_COLORS[daily.types[0]] ?? "#94a3b8" : "#94a3b8";

  return (
    <ScrollView className="flex-1 bg-slate-100" contentContainerStyle={{ padding: 24, alignItems: "center" }}>
      <Text
        className="font-PokemonSolid text-red-600 tracking-widest text-center text-2xl sm:text-4xl"
        style={{ lineHeight: 50 }}
        adjustsFontSizeToFit
        numberOfLines={3}
      >
        Welcome to the Compendeon!
      </Text>

      {daily && (
        <Pressable
          className="w-full max-w-sm mt-4 rounded-2xl p-4 flex-row items-center active:opacity-80 border"
          style={{ backgroundColor: color + "22", borderColor: color + "66" }}
          onPress={() => router.push(`/pokemon/${daily.id}` as any)}
          accessibilityLabel={`Pokémon of the day: ${daily.name}`}
          accessibilityRole="button"
        >
          <Image
            source={{ uri: daily.artwork ?? undefined }}
            style={{ width: 88, height: 88 }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <View className="ml-3 flex-1">
            <Text className="text-[10px] text-slate-500 font-SpaceMono uppercase tracking-widest">
              Pokémon of the day
            </Text>
            <Text className="text-xl font-PokemonSolid capitalize text-slate-800 tracking-widest mt-1">
              {daily.name}
            </Text>
            <Text className="text-[11px] text-slate-500 font-SpaceMono">#{String(daily.id).padStart(3, "0")}</Text>
          </View>
        </Pressable>
      )}

      <View className="flex-row flex-wrap justify-center gap-2 mt-4">
        {QUICK_LINKS.map((link) => (
          <Pressable
            key={link.route}
            className="px-4 py-2 rounded-full bg-white border border-slate-200 active:bg-slate-200"
            onPress={() => router.push(link.route as any)}
            accessibilityRole="button"
          >
            <Text className="font-SpaceMono text-xs text-slate-700">{link.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
