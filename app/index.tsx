import { auth } from "@/lib/firebaseConfig";
import { useShareListener } from "@/lib/Share";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [url, setUrl] = useState<string | null>(null);

  useShareListener((sharedUrl) => {
    console.log("📥 Shared URL received:", sharedUrl);
    setUrl(sharedUrl);
  });

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 items-center justify-center">
        <Text className="text-blue-600 text-lg">Welcome</Text>

        {url ? (
          <Text className="text-black mt-2 text-center px-4">
            {url}
          </Text>
        ) : (
          <Text className="text-gray-400 mt-2">
            Share an Instagram post to this app
          </Text>
        )}

        <TouchableOpacity onPress={() => auth().signOut()} className="mt-6">
          <Ionicons name="log-out" size={38} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

