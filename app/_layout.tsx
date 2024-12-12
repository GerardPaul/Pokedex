import "../assets/css/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable } from "react-native";
import { useFonts } from "expo-font";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ReduceMotion,
} from "react-native-reanimated";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    PokemonSolid: require("../assets/fonts/Pokemon-Solid.ttf"),
    PokemonHollow: require("../assets/fonts/Pokemon-Hollow.ttf"),
  });

  const rotateDeg = useSharedValue(0);

  const animateRotation = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateDeg.value}deg` }],
    };
  });

  const rotatePokeBall = (direction: string) => {
    if (direction === "left") {
      rotateDeg.value = withSpring(rotateDeg.value - 180, {
        mass: 1,
        damping: 6,
        stiffness: 400,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
        reduceMotion: ReduceMotion.Never,
      });
    } else if (direction === "right") {
      rotateDeg.value = withSpring(rotateDeg.value + 180, {
        mass: 1,
        damping: 6,
        stiffness: 400,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
        reduceMotion: ReduceMotion.Never,
      });
    }
  };

  if (!loaded) {
    return null;
  }

  return (
    <View className="flex-1 flex-col">
      <StatusBar hidden={true} />
      {/* Top Screen */}
      <View className="h-3/5 bg-slate-800 relative">
        {/* Light bar behind pokeball */}
        <View className="h-[10%] bg-red-600 flex-col justify-center">
          <View className="h-2 bg-yellow-500" />
        </View>

        {/* Main screen container */}
        <View className="h-[90%] flex-row">
          {/* Left space */}
          <View className="w-1/12 flex-col">
            <View className="h-2/3 flex-col justify-end bg-red-600">
              <View className="h-2 bg-red-800" />
            </View>
            <View className="h-1/3 flex-row justify-center bg-slate-800">
              <View className="w-1 bg-red-800" />
            </View>
          </View>

          {/* Middle space */}
          <View className="w-10/12 flex-col">
            {/* Image placeholder */}
            <View className="h-[85%] flex-row justify-center px-5 bg-red-600">
              <View className="w-full bg-blue-200 border-8 border-slate-400">
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="pokemon" options={{ headerShown: false }} />
                  <Stack.Screen name="list" options={{ headerShown: false }} />
                  <Stack.Screen name="details" options={{ headerShown: false }} />
                </Stack>
              </View>
            </View>

            {/* Name placeholder */}
            <View className="h-[15%] flex-col bg-red-800">
              <View className="h-[90%] flex-row justify-center bg-red-600">
                <View className="w-[75%] flex-col bg-slate-600">
                  <View className="h-[90%] bg-slate-200">
                    {/* Pokemon name and type icons */}
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Right space */}
          <View className="w-1/12 flex-col">
            <View className="h-2/3 flex-col justify-end bg-red-600">
              <View className="h-2 bg-red-800" />
            </View>
            <View className="h-1/3 flex-row justify-center bg-slate-800">
              <View className="w-1 bg-red-800" />
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="absolute inset-x-0 top-0 h-full justify-center">
          <View className="flex-row w-full justify-between">
            <Pressable
              className="h-40 w-[15%] bg-slate-700 flex-col active:bg-slate-800"
              onPress={() => rotatePokeBall("left")}
            >
              <View className="h-[9.5rem] flex-col justify-center items-end">
                <View className="h-1 w-1 bg-transparent border-solid border-l-[25px] border-r-[25px] border-b-[25px] border-l-transparent border-r-transparent border-b-red-500 -rotate-90" />
              </View>
              <View className="h-2 bg-slate-800"/>
            </Pressable>
            <Pressable
              className="h-40 w-[15%] bg-slate-700 flex-col active:bg-slate-800"
              onPress={() => rotatePokeBall("right")}
            >
              <View className="h-[9.5rem] flex-col justify-center items-start">
                <View className="h-1 w-1 bg-transparent border-solid border-l-[25px] border-r-[25px] border-b-[25px] border-l-transparent border-r-transparent border-b-red-500 rotate-90" />
              </View>
              <View className="h-2 bg-slate-800"/>
            </Pressable>
          </View>
        </View>

        {/* Pokeball */}
        <Animated.View
          className="absolute inset-x-0 -top-10 items-center"
          style={[animateRotation]}
        >
          <View className="w-36 h-36 flex-row rounded-full border-8 border-slate-800 bg-slate-800 relative">
            <View className="w-1/2 bg-red-600 rounded-l-full border-r-4 border-slate-800" />
            <View className="w-1/2 bg-white rounded-r-full border-l-4 border-slate-800" />
            <View className="absolute inset-x-0 top-0 flex-col justify-center items-center h-full">
              <View className="h-12 w-12 bg-white rounded-full border-8 border-slate-800" />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Screen */}
      <View className="h-2/5 bg-slate-800 flex-col">
        <View className="h-[90%] flex-row">
          <View className="w-1/12 flex-row justify-center">
            <View className="w-1 bg-red-800" />
          </View>

          {/* Second screen */}
          <View className="w-10/12 flex-col">
            <View className="h-3/4 flex-col pt-5 px-2">
              <View className="flex-1 bg-blue-200 border-8 border-slate-400">
                {/* Pokemon details */}
              </View>
            </View>

            {/* Buttons */}
            <View className="h-1/4 flex-row">
              <View className="flex-row w-[30%] items-center px-2">
                <View className="w-2 h-[40%] bg-slate-900 mr-1" />
                <View className="w-2 h-[40%] bg-slate-900 mr-1" />
                <View className="w-2 h-[40%] bg-slate-900 mr-1" />
                <View className="w-2 h-[40%] bg-slate-900 mr-1" />
                <View className="w-2 h-[40%] bg-slate-900 mr-1" />
                <View className="w-2 h-[40%] bg-slate-900 mr-1" />
                <View className="w-2 h-[40%] bg-slate-900 mr-1" />
                <View className="w-2 h-[40%] bg-slate-900 mr-1" />
              </View>
              <View className="flex-row w-[70%] justify-end items-center">
                <Pressable
                  className="h-14 w-14 rounded-full border-4 border-slate-700 bg-green-600 active:bg-green-800"
                  onPress={() => alert("Pressed green button.")}
                />
                <View className="flex-row">
                  <Pressable
                    className="w-12 h-7 bg-yellow-400 ml-4 flex-col justify-end active:bg-yellow-800"
                    onPress={() => alert("Pressed yellow button.")}
                  >
                    <View className="w-full h-1 bg-yellow-800" />
                  </Pressable>
                  <Pressable
                    className="w-12 h-7 bg-blue-400 ml-4 flex-col justify-end active:bg-blue-800"
                    onPress={() => alert("Pressed blue button.")}
                  >
                    <View className="w-full h-1 bg-blue-800" />
                  </Pressable>
                  <Pressable
                    className="w-12 h-7 bg-red-400 ml-4 flex-col justify-end active:bg-red-800"
                    onPress={() => alert("Pressed red button.")}
                  >
                    <View className="w-full h-1 bg-red-800" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <View className="w-1/12 flex-row justify-center">
            <View className="w-1 bg-red-800" />
          </View>
        </View>
        <View className="h-[10%] flex-row bg-slate-800">
          <View className="w-[5%] bg-red-800" />
          <View className="h-1 w-[90%] bg-red-800" />
          <View className="w-[5%] bg-red-800" />
        </View>
      </View>
    </View>
  );
}
