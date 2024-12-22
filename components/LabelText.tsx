import { View, Text, Pressable } from "react-native";
import { Link, usePathname, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";

export function LabelText() {
  const router = useRouter();
  const pathname = usePathname();
  const currentScreen = pathname.replace(/\//g, "");

  const showHomeButton = !!currentScreen;

  return (
    <View className="flex-row h-full">
      <View className="h-full justify-center items-center px-2">
        {showHomeButton && (
          <Link href="/" asChild>
            <Pressable className="bg-slate-800 p-3 items-center rounded-full active:bg-slate-600">
              <Octicons name="home" size={16} color="#E2E8F0" />
            </Pressable>
          </Link>
        )}
      </View>
      <View className="bg-red-300 h-full items-center"></View>
    </View>
  );

  // return (
  //   <View className="w-full flex-1 flex-row justify-center items-center">
  //     <Link href="/home" asChild>
  //       <Octicons name="home" size={24} color="#1E293B" />
  //     </Link>
  //     <Link href="/" asChild>
  //       <Ionicons name="caret-back" size={24} color="#1E293B" />
  //     </Link>
  //   </View>
  // );
}
