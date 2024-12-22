import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Index() {
  return (
    <View className="flex-1 bg-blue-200">
      <View className="h-3/5 w-full justify-end">
        <Text className="text-5xl text-center font-PokemonSolid tracking-[0.11em] leading-normal text-red-700">
          Welcome
        </Text>
        <Text className="text-5xl text-center font-PokemonSolid tracking-[0.11em] leading-normal text-red-700">
          Trainer!
        </Text>
      </View>
      <View className="flex-row h-2/5 w-full justify-center items-start pt-5">
        <Link href="/generations" asChild>
          <Pressable className="bg-slate-200 p-4 items-center rounded-full active:bg-slate-600">
            <Entypo name="flow-tree" size={24} color="#DC2626" />
            {/* <Text className="font-PokemonSolid">Generations</Text> */}
          </Pressable>
        </Link>
        <Link href="/sprites" asChild>
          <Pressable className="bg-slate-200 p-4 items-center rounded-full mx-2 active:bg-slate-600">
            <MaterialIcons name="catching-pokemon" size={24} color="#DC2626" />
            {/* <Text className="font-PokemonSolid">Pokemons</Text> */}
          </Pressable>
        </Link>
        <Link href="/pokemon" asChild>
          <Pressable className="bg-slate-200 p-4 items-center rounded-full active:bg-slate-600">
            <Feather name="settings" size={24} color="#DC2626" />
            {/* <Text className="font-PokemonSolid">Settings</Text> */}
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
