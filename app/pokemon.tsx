import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function PokemonScreen() {
  return (
    <View className="flex-1 bg-blue-200 justify-center items-center">
      <Text className="text-3xl text-center font-PokemonSolid tracking-widest text-red-700">Pokemon</Text>
      <Link href="/" className="text-center">Back</Link>
    </View>
  );
}