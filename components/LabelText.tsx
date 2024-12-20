import { View, Text } from "react-native";
import { Link } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export function LabelText() {
  return (
    <Link href="/pokemon" className="p-2 bg-red-500 rounded-full text-white">
      <FontAwesomeIcon icon={"home"} color="white"></FontAwesomeIcon>
    </Link>
  );
}
