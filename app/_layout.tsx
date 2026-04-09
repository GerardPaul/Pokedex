import "../assets/css/global.css";
import { Stack, router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      {!isHome ? (
        <Pressable
          className="flex-row items-center gap-1 py-1 px-2 rounded-lg active:bg-slate-700"
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={18} color="#e2e8f0" />
          <Text className="font-SpaceMono text-xs text-slate-200">Back</Text>
        </Pressable>
      ) : (
        <View className="w-16" />
      )}

      <Text className="font-PokemonSolid text-base tracking-widest text-red-500">
        Compendeon
      </Text>

      {!isHome ? (
        <Pressable
          className="flex-row items-center gap-1 py-1 px-2 rounded-lg active:bg-slate-700"
          onPress={handleHome}
          accessibilityLabel="Go to home"
          accessibilityRole="button"
        >
          <Text className="font-SpaceMono text-xs text-slate-200">Home</Text>
          <Ionicons name="home-outline" size={18} color="#e2e8f0" />
        </Pressable>
      ) : (
        <View className="w-16" />
      )}
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
    <SafeAreaView className="flex-1 bg-slate-900">
      <StatusBar style="auto" />

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
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <SelectionProvider>
      <AppShell />
    </SelectionProvider>
  );
}
