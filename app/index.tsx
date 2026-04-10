import { View, Text } from "react-native";

export default function IndexScreen() {
  return (
    <View className="flex-1 bg-slate-100 items-center justify-center px-8">
      <Text className="font-PokemonSolid text-2xl text-red-600 tracking-widest text-center leading-9">
        Welcome to the Compendeon!
      </Text>
    </View>
  );
}
