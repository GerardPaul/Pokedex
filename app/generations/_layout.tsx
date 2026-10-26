import { Stack } from "expo-router";

// Keep the list under a deep-linked detail (e.g. home → Pokémon of the day), so back and tab resets land on it
export const unstable_settings = { initialRouteName: "index" };

export default function StackLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#F4EDDB" } }} />;
}
