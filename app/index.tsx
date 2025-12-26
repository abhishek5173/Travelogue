import { auth } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
   <View className="flex-1 bg-white">
     <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

     <View className="flex-1 items-center justify-center">
      <Text className="text-blue-600">Welcome</Text>
      <TouchableOpacity onPress={() => auth().signOut()}>
        <Ionicons name="log-out" size={38} color="black" />
      </TouchableOpacity>
    </View>
   </View>
  );
}
