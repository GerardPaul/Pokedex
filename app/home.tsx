import { View, Text } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function HomeScreen() {
  return (
    <View className="flex-1 flex-row bg-blue-200 justify-center items-center">
      <Entypo name="flow-tree" size={24} color="black" />
      <MaterialIcons name="catching-pokemon" size={24} color="black" />
      <Feather name="settings" size={24} color="black" />
    </View>
  );
}
