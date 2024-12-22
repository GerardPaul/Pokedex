import { FlatList, Text, View } from "react-native";
import { Link } from "expo-router";
import { PokemonSprite } from "@/components/PokemonSprite";

export default function PokemonScreen() {
  const pokemons = [
    { id: "1", name: "", sprite: "" },
    { id: "2", name: "", sprite: "" },
    { id: "3", name: "", sprite: "" },
    { id: "4", name: "", sprite: "" },
    { id: "5", name: "", sprite: "" },
    { id: "6", name: "", sprite: "" },
    { id: "7", name: "", sprite: "" },
    { id: "8", name: "", sprite: "" },
    { id: "9", name: "", sprite: "" },
    { id: "10", name: "", sprite: "" },
    { id: "11", name: "", sprite: "" },
    { id: "12", name: "", sprite: "" },
    { id: "13", name: "", sprite: "" },
    { id: "14", name: "", sprite: "" },
    { id: "15", name: "", sprite: "" },
    { id: "16", name: "", sprite: "" },
    { id: "17", name: "", sprite: "" },
    { id: "18", name: "", sprite: "" },
    { id: "19", name: "", sprite: "" },
    { id: "20", name: "", sprite: "" },
  ];

  let sprites = pokemons.map((info) => {
    return (
      <View
        key={info.id}
        className="w-[25%] h-[20%] bg-red-200 items-center justify-center p-1"
      >
        <PokemonSprite></PokemonSprite>
      </View>
    );
  });

  return (
    <View className="flex-1 bg-blue-200 flex-wrap p-3 flex-row">{sprites}</View>
  );
}
