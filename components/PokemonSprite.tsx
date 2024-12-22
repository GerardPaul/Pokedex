import { View, Text } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function PokemonSprite() {
  return (
    <View className="h-56 w-56 bg-red-300">
      <FontAwesome6 name="spaghetti-monster-flying" size={24} color="white" />
    </View>
  );
}
