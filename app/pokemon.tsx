import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function PokemonScreen() {
  const pokemon = useLocalSearchParams();
  
  return (
    <View className="flex-1 bg-blue-200 p-3 justify-center items-center">
      <Text>{pokemon.name}</Text>
    </View>
  );
}
