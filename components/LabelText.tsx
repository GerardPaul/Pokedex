import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";

export function LabelText() {
  return (
    <View className="w-full flex-1 flex-row justify-center items-center">
      <Link href="/home" asChild>
        <Octicons name="home" size={24} color="#1E293B" />
      </Link>
      <Link href="/" asChild>
        <Ionicons name="caret-back" size={24} color="#1E293B" />
      </Link>
    </View>
  );
}
