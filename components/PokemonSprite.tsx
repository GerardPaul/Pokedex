import { View, Text } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function PokemonSprite({data}: any) {
  return (
    <View className="h-56 w-56 bg-red-300 justify-center items-center">
      <FontAwesome6 name="spaghetti-monster-flying" size={24} color="white" />
      <Text className="text-[0.5rem]">{data.name}</Text>
    </View>
  );
}
