import "../assets/css/global.css";
import { Stack, router, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { SelectionProvider, useSelection } from "@/context/SelectionContext";
import { BottomPanel } from "@/components/BottomPanel";

const NAV_ITEMS = [
  {
    key: "pokemon",
    label: "Pokémon",
    route: "/pokemon",
    renderIcon: (color: string) => <MaterialIcons name="catching-pokemon" size={22} color={color} />,
  },
  {
    key: "generations",
    label: "Gens",
    route: "/generations",
    renderIcon: (color: string) => <Entypo name="flow-tree" size={22} color={color} />,
  },
  {
    key: "settings",
    label: "Settings",
    route: "/settings",
    renderIcon: (color: string) => <Ionicons name="settings-outline" size={22} color={color} />,
  },
];

function SideNav() {
  const pathname = usePathname();
  const { clearSelection } = useSelection();
  const isHome = pathname === "/" || pathname === "/index";

  function handleBack() {
    clearSelection();
    if (router.canGoBack()) router.back();
  }

  function handleHome() {
    clearSelection();
    router.replace("/");
  }

  function handleNav(route: string) {
    router.push(route as any);
  }

  return (
    <View className="w-16 bg-slate-900 border-r border-slate-700 items-center py-3">
      {/* App name */}
      <Text
        className="font-PokemonSolid text-red-500 text-[8px] tracking-wider text-center leading-3 mb-4 px-1"
        numberOfLines={2}
      >
        {"Comp\nendeon"}
      </Text>

      {/* Nav items */}
      <View className="flex-1 w-full">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.key === "pokemon" ? pathname.startsWith("/pokemon") :
            item.key === "generations" ? pathname.startsWith("/generations") :
            pathname === item.route;

          return (
            <Pressable
              key={item.key}
              className={`w-full items-center py-3 ${
                isActive ? "bg-slate-700" : "active:bg-slate-800"
              }`}
              onPress={() => handleNav(item.route)}
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              {item.renderIcon(isActive ? "#ef4444" : "#94a3b8")}
              <Text
                className={`font-SpaceMono text-[7px] mt-0.5 ${
                  isActive ? "text-red-400" : "text-slate-500"
                }`}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Back & Home — only when not on home */}
      {!isHome && (
        <View className="w-full items-center">
          <View className="h-px bg-slate-700 w-full mb-1" />
          <Pressable
            className="w-full items-center py-3 active:bg-slate-800"
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={22} color="#94a3b8" />
            <Text className="font-SpaceMono text-[7px] mt-0.5 text-slate-500">Back</Text>
          </Pressable>
          <Pressable
            className="w-full items-center py-3 active:bg-slate-800"
            onPress={handleHome}
            accessibilityLabel="Go to home"
            accessibilityRole="button"
          >
            <Ionicons name="home-outline" size={22} color="#94a3b8" />
            <Text className="font-SpaceMono text-[7px] mt-0.5 text-slate-500">Home</Text>
          </Pressable>
        </View>
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
    <SafeAreaView className="flex-1 flex-row bg-slate-900">
      <StatusBar style="auto" />

      {/* Side nav */}
      <SideNav />

      {/* Content column */}
      <View className="flex-1">
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
