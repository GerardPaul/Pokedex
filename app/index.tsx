import { Text, View, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, Easing, ReduceMotion } from 'react-native-reanimated';

export default function Index() {
  return (
    <View className="flex-1 bg-blue-200 justify-center items-center">
      <Text className="text-3xl text-center font-PokemonSolid tracking-widest text-red-700">Welcome Trainer!</Text>
    </View>
  );
}