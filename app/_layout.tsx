import "../assets/css/global.css";
import { Tabs } from "expo-router/js-tabs";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { PixelTabBar } from "@/components/PixelTabBar";

const CREAM = "#F4EDDB";

export default function RootLayout() {
  const [loaded] = useFonts({
    PressStart2P: require("../assets/fonts/PressStart2P-Regular.ttf"),
    PixelifySans: require("../assets/fonts/PixelifySans.ttf"),
    PokemonSolid: require("../assets/fonts/Pokemon-Solid.ttf"),
  });

  if (!loaded) return null;

  return (
    <FavoritesProvider>
      <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
        <StatusBar style="dark" />
        <Tabs
          tabBar={(props) => <PixelTabBar {...props} />}
          screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: CREAM } }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="pokemon" />
          <Tabs.Screen name="generations" />
          <Tabs.Screen name="favorites" />
          <Tabs.Screen name="settings" />
        </Tabs>
      </SafeAreaView>
    </FavoritesProvider>
  );
}
