import { Slot } from "expo-router";
import "../assets/css/global.css";
import 'react-native-reanimated';
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Slot/>
      <StatusBar hidden={true} />
    </>
  );
}
