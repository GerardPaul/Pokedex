import { View, Text, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { tap, INK } from "@/components/pixel";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// Route name → tab look. Routes not listed here (e.g. +not-found) get no tab.
const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: "HOME", icon: "home-variant" },
  pokemon: { label: "DEX", icon: "pokeball" },
  generations: { label: "GENS", icon: "earth" },
  favorites: { label: "FAVS", icon: "star" },
  settings: { label: "OPTS", icon: "cog" },
};

export function PixelTabBar({ state, navigation, insets }: BottomTabBarProps) {
  return (
    <View className="flex-row bg-paper border-t-[3px] border-ink" style={{ paddingBottom: insets.bottom }}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const focused = state.index === index;

        function onPress() {
          tap();
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          // Tapping the focused tab lets its stack pop back to the list
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            className={`flex-1 items-center pt-2 pb-1.5 ${focused ? "bg-cream" : ""}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
          >
            <MaterialCommunityIcons name={tab.icon} size={24} color={focused ? "#E3350D" : INK} />
            <Text className={`font-Pixel text-[8px] mt-1 ${focused ? "text-dex-red" : "text-ink"}`}>
              {focused ? "▶" : " "}
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
