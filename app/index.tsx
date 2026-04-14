import { View, Text } from "react-native";

export default function IndexScreen() {
  return (
    <View className="flex-1 bg-slate-100 items-center justify-center px-6">
      <Text
        className="font-PokemonSolid text-red-600 tracking-widest text-center text-2xl sm:text-4xl leading-6"
        style={{ lineHeight: 50 }}
        adjustsFontSizeToFit
        numberOfLines={3}
      >
        Welcome to the Compendeon!
      </Text>
    </View>
  );
}
