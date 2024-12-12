import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Index() {
  return (
    <View className="flex-1 bg-blue-200 justify-center items-center">
      <Text className="text-3xl text-center font-PokemonSolid tracking-widest text-red-700">Welcome Trainer!</Text>
      <Link href="/pokemon" className="text-center">Pokemon</Link>
      <Link href="/list" className="text-center">List</Link>
      <Link href="/details" className="text-center">Details</Link>
    </View>
  );
}