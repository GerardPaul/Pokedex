import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-100 px-6">
      <Text className="text-2xl font-PokemonSolid text-slate-800 tracking-widest">
        SETTINGS
      </Text>
      <Text className="text-xs text-slate-400 font-SpaceMono mt-3 text-center">
        Settings coming soon.
      </Text>
    </View>
  );
}
