import { View, TextInput, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search by name or type..." }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2 mx-3 my-2">
      <Ionicons name="search" size={16} color="#94a3b8" />
      <TextInput
        className="flex-1 ml-2 text-sm text-slate-700 font-SpaceMono"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search Pokémon"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityLabel="Clear search"
          hitSlop={8}
        >
          <Ionicons name="close-circle" size={16} color="#94a3b8" />
        </Pressable>
      )}
    </View>
  );
}
