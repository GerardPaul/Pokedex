import "../assets/css/global.css";
import { Stack, router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable } from "react-native";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SelectionProvider, useSelection } from "@/context/SelectionContext";
import { BottomPanel } from "@/components/BottomPanel";

function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/index";
  const { clearSelection } = useSelection();

  function handleBack() {
    clearSelection();
    if (router.canGoBack()) {
      router.back();
    }
  }

  function handleHome() {
    clearSelection();
    router.replace("/");
  }

  return (
    <View className="flex-row items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
      <Pressable
        className="flex-row items-center gap-1 py-1 px-2 rounded-lg active:bg-slate-700"
        onPress={handleBack}
        disabled={isHome}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <Ionicons
          name="chevron-back"
          size={18}
          color={isHome ? "#475569" : "#e2e8f0"}
        />
        <Text
          className={`font-SpaceMono text-xs ${isHome ? "text-slate-600" : "text-slate-200"}`}
        >
          Back
        </Text>
      </Pressable>

      <Text className="font-PokemonSolid text-base tracking-widest text-red-500">
        Compendeon
      </Text>

      <Pressable
        className="flex-row items-center gap-1 py-1 px-2 rounded-lg active:bg-slate-700"
        onPress={handleHome}
        disabled={isHome}
        accessibilityLabel="Go to home"
        accessibilityRole="button"
      >
        <Text
          className={`font-SpaceMono text-xs ${isHome ? "text-slate-600" : "text-slate-200"}`}
        >
          Home
        </Text>
        <Ionicons
          name="home-outline"
          size={18}
          color={isHome ? "#475569" : "#e2e8f0"}
        />
      </Pressable>
    </View>
  );
}

function AppShell() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    PokemonSolid: require("../assets/fonts/Pokemon-Solid.ttf"),
    PokemonHollow: require("../assets/fonts/Pokemon-Hollow.ttf"),
  });

  if (!loaded) return null;

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar hidden />

      {/* Nav bar */}
      <NavBar />

      {/* Top view — 60% */}
      <View className="flex-[6] bg-slate-100 overflow-hidden">
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="pokemon/index" />
          <Stack.Screen name="pokemon/[id]" />
          <Stack.Screen name="generations/index" />
          <Stack.Screen name="generations/[id]/index" />
          <Stack.Screen name="generations/[id]/pokemon/[pid]" />
          <Stack.Screen name="settings" />
        </Stack>
      </View>

      {/* Divider */}
      <View className="h-px bg-slate-700" />

      {/* Bottom view — 40% */}
      <View className="flex-[4] bg-white overflow-hidden">
        <BottomPanel />
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SelectionProvider>
      <AppShell />
    </SelectionProvider>
  );
}
