import { useEffect, useRef } from "react";
import { Animated, View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAsync } from "@/hooks/useAsync";
import { fetchAllPokemon, fetchPokemonDetail } from "@/lib/pokeapi";
import { PixelButton, Sprite } from "@/components/pixel";
import colors from "@/lib/colors";

const QUICK_LINKS = [
  { label: "POKéDEX", route: "/pokemon" },
  { label: "GENERATIONS", route: "/generations" },
  { label: "FAVORITES", route: "/favorites" },
];

// Same Pokémon for everyone all day, changes at local midnight
async function fetchPokemonOfTheDay() {
  const all = await fetchAllPokemon();
  const now = new Date();
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
  return fetchPokemonDetail(all[day % all.length].id);
}

/** The blinking ▼ "press to continue" marker from the games' dialogue boxes. */
function BlinkingArrow() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 0, delay: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 0, delay: 500, useNativeDriver: true }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [opacity]);
  return (
    // Animated.Text doesn't take NativeWind classes, so style it directly
    <Animated.Text style={{ opacity, alignSelf: "flex-end", fontFamily: "PressStart2P", fontSize: 10, color: colors.dexRed }}>
      ▼
    </Animated.Text>
  );
}

export default function IndexScreen() {
  const { data: daily } = useAsync(fetchPokemonOfTheDay, []);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 20, alignItems: "center", justifyContent: "center" }}
      showsVerticalScrollIndicator={false}
    >
      <Text
        className="font-PokemonSolid text-dex-red tracking-widest text-center text-4xl"
        style={{ lineHeight: 56, textShadowColor: colors.dexBlue, textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 0 }}
        adjustsFontSizeToFit
        numberOfLines={1}
      >
        Compendeon
      </Text>
      <Text className="font-Pixel text-[11px] text-ink mt-1">POKéDEX</Text>

      {daily && (
        <View className="w-full max-w-sm items-center mt-6">
          <View style={{ height: 130, justifyContent: "flex-end", zIndex: 1 }}>
            <Sprite id={daily.id} size={120} />
          </View>

          <PixelButton
            containerClassName="w-full mt-4"
            className="px-4 pt-3 pb-2"
            onPress={() => router.push(`/pokemon/${daily.id}` as any)}
            accessibilityLabel={`Pokémon of the day: ${daily.name}. Open details`}
          >
            <Text className="font-PixelBody text-xl text-ink">
              A wild <Text className="font-Pixel text-[13px] uppercase text-dex-red">{daily.name}</Text> appeared!
            </Text>
            <Text className="font-PixelBody text-base text-ink/60 mt-1">Pokémon of the day</Text>
            <BlinkingArrow />
          </PixelButton>
        </View>
      )}

      <View className="w-full max-w-sm mt-5 gap-1">
        {QUICK_LINKS.map((link) => (
          <PixelButton
            key={link.route}
            className="px-4 py-3"
            onPress={() => router.push(link.route as any)}
            accessibilityLabel={`Open ${link.label}`}
          >
            <Text className="font-Pixel text-[12px] text-ink">▶ {link.label}</Text>
          </PixelButton>
        ))}
      </View>
    </ScrollView>
  );
}
