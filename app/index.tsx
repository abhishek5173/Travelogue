import { useAuth } from "@/lib/AuthContext";
import { auth } from "@/lib/firebaseConfig";
import { useInstagramShare } from "@/lib/Share";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useAuth();
  const [url, setUrl] = useState<string | null>(null);

  useInstagramShare((receivedUrl) => {
    setUrl(receivedUrl);
  });

  return (
    <View className="flex-1 bg-white/70">
      <StatusBar barStyle="dark-content" />

      <SafeAreaView className="flex-1 px-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View className="flex-row justify-between items-center mt-4">
            {/* <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full flex justify-center items-center bg-gray-300">
                <Ionicons name="person-outline" size={20} color="#6b7280" />
              </View>
              <View className="ml-3">
                <Text className="text-sm font-semibold text-gray-900">
                  {user?.displayName || "Guest"}
                </Text>
                <Text className="text-xs text-gray-500">Welcome</Text>
              </View>
            </View> */}

            <View>
              <Text className="text-3xl font-bold text-blue-600 italic">
                Travelogue
              </Text>
            </View>

            <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
              <Pressable onPress={() => auth().signOut()}>
                <Ionicons name="log-out-outline" size={28} />
              </Pressable>
            </View>
          </View>
          {/* SEARCH */}
          <View className="flex-row items-center mt-5">
            <View className="flex-1 bg-white rounded-full px-4 py-3 flex-row items-center">
              <Ionicons name="search-outline" size={18} color="#6b7280" />
              <TextInput
                placeholder="Search destination"
                className="ml-2 flex-1 text-gray-700"
              />
              <Pressable className="ml-3 bg-blue-500 px-5 py-3 rounded-full">
                <Ionicons name="search-outline" size={18} color="white" />
              </Pressable>
            </View>
          </View>

          {/* COUNTRY CHIPS */}
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-6"
          >
            {["Norway", "Turkey", "Italy", "Japan", "Thailand"].map(
              (item, index) => (
                <View
                  key={index}
                  className="items-center mr-4"
                >
                  <View className="w-16 h-16 rounded-full bg-white mb-2" />
                  <Text className="text-xs text-gray-700">{item}</Text>
                </View>
              )
            )}
          </ScrollView> */}

          <View className="flex-row bg-white mt-2 rounded-3xl p-2">
            {/* Icon / Image Section */}
            <View className="w-[34%] items-center justify-center">
              <View className="self-start bg-blue-100 px-2 py-1 rounded-full mb-1">
                <Text className="text-[11px] font-semibold text-blue-600">
                  ✨ NEW EXPERIENCE
                </Text>
              </View>
              <Image
                source={require("../assets/images/iconn.png")}
                className="w-24 h-24 rounded-xl"
                resizeMode="contain"
              />
            </View>

            {/* Content Section */}
            <View className="flex-1 pl-3 justify-center">
              {/* Badge */}

              {/* Headline */}
              <Text className="text-lg font-extrabold text-gray-900 leading-6">
                Turn Social Media{" "}
                <Text className="text-blue-500">Inspirations</Text>
              </Text>
              <Text className="text-lg font-extrabold leading-6">
                Into <Text className="text-blue-500">Smart Travel</Text> Plans
              </Text>

              {/* Description */}
              <Text className="text-sm text-gray-500 mt-1.5 leading-5">
                Drop your favorite{" "}
                <Text className="font-semibold text-gray-700">reels</Text> or{" "}
                <Text className="font-semibold text-gray-700">posts</Text>
              </Text>

              {/* CTA */}
              <Pressable className="mt-4 flex-row items-center bg-blue-500 text-white px-2 py-1 rounded-2xl self-start">
                <Text className="text-sm text-white font-semibold ">
                  Start planning
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color="white"
                  style={{ marginLeft: 6 }}
                />
              </Pressable>
            </View>
          </View>

          {/* TOP RECOMMENDATION */}
          <Text className="text-xl font-semibold text-gray-900 mt-3 mb-4">
            Plan And Discover ✨
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((_, index) => (
              <View
                key={index}
                className="bg-white rounded-3xl w-64 mr-5 overflow-hidden"
              >
                {/* Image Placeholder */}
                <View className="h-40 bg-gray-300" />

                {/* Content */}
                <View className="p-4">
                  <Text className="text-lg font-bold text-gray-900">
                    Pisa Tower
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    Toscana, Italy
                  </Text>

                  <View className="flex-row justify-between items-center mt-4">
                    <View>
                      <Text className="text-xs text-gray-500">Distance</Text>
                      <Text className="font-semibold">2.8 km</Text>
                    </View>

                    <Pressable className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center">
                      <Ionicons name="arrow-forward" size={18} color="white" />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="h-28" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
