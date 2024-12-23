import { View, Text, Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link } from "expo-router";

export function PokemonSprite({ data }: any) {
  return (
    <View className="h-56 w-56">
      <Link href="/pokemon" asChild>
        <Pressable className="justify-center items-center p-1 rounded-lg text-slate-700 active:text-white active:bg-slate-700">
          <FontAwesome6
            name="spaghetti-monster-flying"
            size={24}
            color="#1E293B"
          />
          <Text className="text-[0.5rem]">{data.name}</Text>
        </Pressable>
      </Link>
    </View>
  );
}
