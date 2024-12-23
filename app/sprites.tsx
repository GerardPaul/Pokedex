import { Text, View } from "react-native";
import { PokemonSprite } from "@/components/PokemonSprite";
import { useLocalSearchParams } from "expo-router";

export default function SpritesScreen() {
  const data = useLocalSearchParams();
  const generation = data.generation;
  
  const pokemons = [
    { id: "1", name: "Bulbasaur", sprite: "" },
    { id: "2", name: "Ivysaur", sprite: "" },
    { id: "3", name: "Venusaur", sprite: "" },
    { id: "4", name: "Charmander", sprite: "" },
    { id: "5", name: "Charmeleon", sprite: "" },
    { id: "6", name: "Charizard", sprite: "" },
    { id: "7", name: "Squirtle", sprite: "" },
    { id: "8", name: "Wartortle", sprite: "" },
    { id: "9", name: "Blastoise", sprite: "" },
    { id: "10", name: "Caterpie", sprite: "" },
    { id: "11", name: "Metapod", sprite: "" },
    { id: "12", name: "Butterfree", sprite: "" },
    { id: "13", name: "Weedle", sprite: "" },
    { id: "14", name: "Kakuna", sprite: "" },
    { id: "15", name: "Beedrill", sprite: "" },
    { id: "16", name: "Pidgey", sprite: "" },
    { id: "17", name: "Pidgeotto", sprite: "" },
    { id: "18", name: "Pidgeot", sprite: "" },
    { id: "19", name: "Rattata", sprite: "" },
    { id: "20", name: "Raticate", sprite: "" },
  ];

  let sprites = pokemons.map((data) => {
    return (
      <View
        key={data.id}
        className="w-[33.33%] h-[20%] items-center justify-center p-1"
      >
        <PokemonSprite data={data}></PokemonSprite>
      </View>
    );
  });

  return (
    <View className="flex-1 bg-blue-200">
      <View className="h-[10%] bg-slate-700 justify-center px-5">
        <Text className="text-slate-200 font-PokemonSolid tracking-[0.11em] leading-normal px-1">Gen {generation}</Text>
      </View>
      <View className="h-[90%] flex-wrap flex-row px-3">{sprites}</View>
    </View>
  );
}
