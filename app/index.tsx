import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";

interface MenuItemProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}

function MenuItem({ label, icon, onPress }: MenuItemProps) {
  return (
    <Pressable
      className="w-28 h-28 bg-white rounded-2xl items-center justify-center mx-3 active:bg-slate-100"
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {icon}
      <Text className="font-PokemonSolid text-xs tracking-widest text-slate-700 mt-2">
        {label}
      </Text>
    </Pressable>
  );
}

export default function IndexScreen() {
  return (
    <View className="flex-1 bg-slate-100 items-center justify-center">
      <Text className="font-PokemonSolid text-3xl text-red-600 tracking-widest mb-10">
        Pokédex
      </Text>

      <View className="flex-row items-center justify-center">
        <MenuItem
          label="Pokémon"
          icon={<MaterialIcons name="catching-pokemon" size={40} color="#DC2626" />}
          onPress={() => router.push("/pokemon" as any)}
        />
        <MenuItem
          label="Gens"
          icon={<Entypo name="flow-tree" size={40} color="#DC2626" />}
          onPress={() => router.push("/generations" as any)}
        />
        <MenuItem
          label="Settings"
          icon={<Feather name="settings" size={40} color="#DC2626" />}
          onPress={() => router.push("/settings")}
        />
      </View>
    </View>
  );
}

