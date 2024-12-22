import { Text, View, FlatList, Pressable } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function GenerationsScreen() {
  const direction = useLocalSearchParams();
  let page = direction.page ?? 1;

  return (
    <View className="flex-1 bg-blue-200 justify-center items-center">
      <Link href="/sprites" asChild>
        <Pressable className="items-center bg-white rounded-full p-4 active:bg-slate-500">
          <MaterialIcons name="catching-pokemon" size={40} color="#DC2626" />
          <Text className="font-PokemonSolid tracking-[0.11em] leading-normal text-3xl text-slate-700 px-1">
            Generation {page}
          </Text>
          <FontAwesome6 name="caret-down" size={24} color="#334155" />
        </Pressable>
      </Link>
    </View>
  );
}
