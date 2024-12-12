import { Text, View, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, Easing, ReduceMotion } from 'react-native-reanimated';

export default function Index() {
  const rotateDeg = useSharedValue(0);

  const animateRotation = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotateDeg.value}deg` }],
    };
  });

  const rotatePokeBall = (direction: string) => {
    if (direction === 'left') {
      rotateDeg.value = withSpring(rotateDeg.value - 180, {
        mass: 1,
        damping: 6,
        stiffness: 400,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 2,
        reduceMotion: ReduceMotion.Never,
      });
    } else if (direction === 'right') {
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

  return (
    <View className="flex-1 flex-col">
      {/* Top Screen */}
      <View className="h-3/5 bg-slate-800 relative">
        {/* Light bar behind pokeball */}
        <View className="h-[10%] bg-red-600 flex-col justify-center">
          <View className="h-2 bg-yellow-500"/>
        </View>

        {/* Main screen container */}
        <View className="h-[90%] flex-row">
          {/* Left space */}
          <View className="w-1/12 flex-col">
            <View className="h-2/3 flex-col justify-end bg-red-600">
              <View className="h-2 bg-red-800"/>
            </View>
            <View className="h-1/3 flex-row justify-center bg-slate-800">
              <View className="w-1 bg-red-800"/>
            </View>
          </View>

          {/* Middle space */}
          <View className="w-10/12 flex-col">
            {/* Image placeholder */}
            <View className="h-[85%] flex-row justify-center px-5 bg-red-600">
              <View className="w-full bg-blue-200 border-8 border-slate-400">
                {/* Pokemon sprites and images */}
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
              <View className="h-2 bg-red-800"/>
            </View>
            <View className="h-1/3 flex-row justify-center bg-slate-800">
              <View className="w-1 bg-red-800"/>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="absolute inset-x-0 top-0 h-full justify-center">
          <View className="flex-row w-full justify-between">
            <Pressable className="h-40 w-[15%] bg-slate-800" onPress={() => rotatePokeBall('left')}>
              <View className="h-[9.5rem] flex-col justify-center items-end bg-slate-700">
                <View className="h-1 w-1 bg-transparent border-solid border-l-[25px] border-r-[25px] border-b-[25px] border-l-transparent border-r-transparent border-b-red-500 -rotate-90"/>
              </View>              
            </Pressable>
            <Pressable className="h-40 w-[15%] bg-slate-800" onPress={() => rotatePokeBall('right')}>
              <View className="h-[9.5rem] flex-col justify-center items-start bg-slate-700">
                <View className="h-1 w-1 bg-transparent border-solid border-l-[25px] border-r-[25px] border-b-[25px] border-l-transparent border-r-transparent border-b-red-500 rotate-90"/>
              </View>              
            </Pressable>
          </View>
        </View>

        {/* Pokeball */}
        <Animated.View className="absolute inset-x-0 -top-10 items-center" style={[animateRotation]}>
          <View className="w-36 h-36 flex-row rounded-full border-8 border-slate-800 bg-slate-800 relative">
            <View className="w-1/2 bg-red-600 rounded-l-full border-r-4 border-slate-800"/>
            <View className="w-1/2 bg-white rounded-r-full border-l-4 border-slate-800"/>
            <View className="absolute inset-x-0 top-0 flex-col justify-center items-center h-full">
              <View className="h-12 w-12 bg-white rounded-full border-8 border-slate-800"/>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Screen */}
      <View className="h-2/5 bg-slate-800 flex-col">
        <View className="h-[90%] flex-row">
          <View className="w-1/12 flex-row justify-center">
            <View className="w-1 bg-red-800"/>
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
                <View className="w-2 h-[40%] bg-slate-900 mr-1"/>
                <View className="w-2 h-[40%] bg-slate-900 mr-1"/>
                <View className="w-2 h-[40%] bg-slate-900 mr-1"/>
                <View className="w-2 h-[40%] bg-slate-900 mr-1"/>
                <View className="w-2 h-[40%] bg-slate-900 mr-1"/>
                <View className="w-2 h-[40%] bg-slate-900 mr-1"/>
                <View className="w-2 h-[40%] bg-slate-900 mr-1"/>
                <View className="w-2 h-[40%] bg-slate-900 mr-1"/>
              </View>
              <View className="flex-row w-[70%] justify-end items-center">
                <Pressable className="h-14 w-14 rounded-full border-4 border-slate-700 bg-green-600 active:bg-green-800"
                  onPress={() => alert("Pressed green button.")}/>
                <View className="flex-row">
                  <Pressable className="w-12 h-7 bg-yellow-400 ml-4 flex-col justify-end active:bg-yellow-800"
                    onPress={() => alert("Pressed yellow button.")}>
                    <View className="w-full h-1 bg-yellow-800"/>
                  </Pressable>
                  <Pressable className="w-12 h-7 bg-blue-400 ml-4 flex-col justify-end active:bg-blue-800"
                    onPress={() => alert("Pressed blue button.")}>
                    <View className="w-full h-1 bg-blue-800"/>
                  </Pressable>
                  <Pressable className="w-12 h-7 bg-red-400 ml-4 flex-col justify-end active:bg-red-800"
                    onPress={() => alert("Pressed red button.")}>
                    <View className="w-full h-1 bg-red-800"/>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <View className="w-1/12 flex-row justify-center">
            <View className="w-1 bg-red-800"/>
          </View>
        </View>
        <View className="h-[10%] flex-row bg-slate-800">
          <View className="w-[5%] bg-red-800"/>
          <View className="h-1 w-[90%] bg-red-800"/>
          <View className="w-[5%] bg-red-800"/>
        </View>
      </View>
    </View>
  );
}

// export default function Index() {
//   return (
//     <View className="flex-1 relative">
    {/* //   <View className="absolute z-[1] inset-x-0 flex-1 h-full"> */}
        {/* Top Screen */}
        {/* <View className="flex-1 h-3/5"> */}
          {/* Pokeball and lightbar */}
          {/* <View className="flex relative">
            <View className="absolute inset-x-0 top-0 flex-1">
              <View className="flex-1 relative">
                <View className="absolute inset-x-0 top-0 h-[25rem] bg-red-900 pb-2">
                  <View className="bg-red-800 h-full"></View>
                </View>

                <View className="absolute inset-x-0 top-0 flex-1 items-center">
                  <View className="w-10/12 h-[36rem] bg-white"></View>
                </View>
              </View>
            </View> */}

            {/* Lightbar */}
            {/* <View className="absolute inset-x-0 top-0 h-24 bg-red-800">
              <View className="flex-1 justify-center">
                <View className="h-5 bg-yellow-200"></View>
              </View>
            </View> */}

            {/* Pokeball */}
            {/* <View className="absolute inset-x-0 top-0 flex-1 items-center">
              <View className="w-28 h-28 bg-red-950"></View>
            </View>
          </View> */}

          
          
        {/* </View> */}

        {/* Bottom Screen */}
        {/* <View className="h-2/5 bg-blue-500"></View>
      </View> */}

      {/* Background gray */}
      {/* <View className="flex-1 bg-slate-800 p-5">
          <View className="flex-1 bg-red-900 p-1">
              <View className="flex-1 bg-slate-800"/>
          </View>
      </View> */}


      {/* Red block and shadow containing screen */}
      {/* <View className="absolute z-[3] inset-x-0 top-0 flex-1 items-center">
        <View className="w-10/12 h-[37rem] relative">
          <View className="absolute z-[4] inset-x-0 top-0 h-[36rem] bg-red-600 flex-1 items-center justify-center">
            <View className="w-9/12 bg-slate-500 h-[28rem] p-2">
              <View className="flex-1 bg-blue-300">
              </View>
            </View>
          </View>
          <View className="absolute z-[3] inset-x-0 top-0 h-[37rem] bg-red-900">

          </View>
        </View>
      </View> */}

      {/* Red block and shadow full width */}
      {/* <View className="absolute z-[2] inset-x-0 top-0 h-[25rem] bg-red-600"></View>
      <View className="absolute z-[1] inset-x-0 top-0 h-[26rem] bg-red-900"></View> */}

      {/* Background gray */}
      {/* <View className="flex-1 bg-slate-800 p-5">
          <View className="flex-1 bg-red-900 p-1">
              <View className="flex-1 bg-slate-800"/>
          </View>
      </View> */}
    // </View>
//   );
// }