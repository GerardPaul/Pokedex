import "../assets/css/global.css";
import { Tabs } from "expo-router/js-tabs";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { PixelTabBar } from "@/components/PixelTabBar";
import { trimImageCache } from "@/lib/imageCache";
import colors from "@/lib/colors";

// Enforce the image cache cap once per launch (it is also checked after downloads)
trimImageCache();

export default function RootLayout() {
  const [loaded] = useFonts({
    PressStart2P: require("../assets/fonts/PressStart2P-Regular.ttf"),
    PixelifySans: require("../assets/fonts/PixelifySans.ttf"),
    Silkscreen: require("../assets/fonts/Silkscreen-Bold.ttf"),
  });

  if (!loaded) return null;

  return (
    <FavoritesProvider>
      <SafeAreaView edges={["top"]} className="flex-1 bg-shell">
        <StatusBar style="light" />
        <Tabs
          tabBar={(props) => <PixelTabBar {...props} />}
          // Leaving a tab resets its stack, so coming back shows the tab's first screen
          screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.body }, popToTopOnBlur: true }}
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
