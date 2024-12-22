import { FlatList, Text, View } from "react-native";
import { PokemonSprite } from "@/components/PokemonSprite";

export default function SpritesScreen() {
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
        className="w-[25%] h-[20%] bg-red-200 items-center justify-center p-1"
      >
        <PokemonSprite data={data}></PokemonSprite>
      </View>
    );
  });

  return (
    <View className="flex-1 bg-blue-200 flex-wrap p-3 flex-row">{sprites}</View>
  );
}
