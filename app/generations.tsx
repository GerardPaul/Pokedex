import { Text, View, FlatList } from "react-native";
import { Link } from "expo-router";

type ItemData = {
  id: number;
  name: string;
  title: string;
};

export default function GenerationsScreen() {
  const generations: ItemData[]  = [
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
        <View className="px-4 py-5 my-1 bg-slate-300">
          <Link href="/pokemon">
            <Text className="font-semibold text-slate-900 text-lg">
              {item.title}
            </Text>
          </Link>
        </View>
      );
  };

  return (
    <View className="flex-1 bg-blue-200 justify-center items-center">
      <FlatList
        className="h-full flex-1 w-full"
        data={generations}
        renderItem={renderGenerationList}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
