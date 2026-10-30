import { Stack } from "expo-router";
import colors from "@/lib/colors";

// Keep the list under a deep-linked detail (e.g. home → Pokémon of the day), so back and tab resets land on it
export const unstable_settings = { initialRouteName: "index" };

/** Headerless stack used inside the Dex and Gens tabs (list → detail). */
export function TabStack() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.body } }} />;
}
