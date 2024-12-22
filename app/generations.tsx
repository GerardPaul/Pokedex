import { Text, View, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ItemData = {
  id: number;
  name: string;
  title: string;
};

export default function GenerationsScreen() {
  const generations: ItemData[] = [
    { id: 1, name: "generation-i", title: "Generation 1" },
    { id: 2, name: "generation-ii", title: "Generation 2" },
    { id: 3, name: "generation-iii", title: "Generation 3" },
    { id: 4, name: "generation-iv", title: "Generation 4" },
    { id: 5, name: "generation-v", title: "Generation 5" },
    { id: 6, name: "generation-vi", title: "Generation 6" },
    { id: 7, name: "generation-vii", title: "Generation 7" },
    { id: 8, name: "generation-vii", title: "Generation 8" },
    { id: 9, name: "generation-ix", title: "Generation 9" },
  ];

  const renderGenerationList = ({ item }: { item: ItemData }) => {
    return (
      <View className="mb-1">
        <Link href="/pokemon" asChild>
          <Pressable className="w-full flex-row px-4 py-5 justify-center items-center bg-blue-200 active:bg-slate-200">
            <MaterialIcons name="catching-pokemon" size={24} color="#DC2626" />
            <Text className="font-PokemonSolid tracking-[0.11em] leading-normal text-slate-700 text-lg mx-2">
              {item.title}
            </Text>
            <FontAwesome6 name="caret-right" size={20} color="#334155" />
          </Pressable>
        </Link>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-blue-200 justify-center items-center pt-10">
      <FlatList
        className="h-full flex-1 w-full"
        data={generations}
        renderItem={renderGenerationList}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
