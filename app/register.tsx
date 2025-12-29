import { useAuth } from "@/lib/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const cardFade = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(30)).current;

  const inputAnim = useRef([
    new Animated.Value(20),
    new Animated.Value(20),
    new Animated.Value(20),
  ]).current;

  const inputOpacity = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const floatIcon = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  /* CARD + INPUT ENTRANCE */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslate, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(
      120,
      inputAnim.map((anim, i) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(inputOpacity[i], {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, []);

  /* FLOATING ICON */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatIcon, {
          toValue: -6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatIcon, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    }
    if (!email.includes("@")) {
      Toast.show({ type: "error", text1: "Invalid email address" });
      return;
    }
    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await auth().createUserWithEmailAndPassword(email, password);
      await res.user.updateProfile({ displayName: name });

      Toast.show({ type: "success", text1: "Account created successfully!" });
      router.replace("/");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#f8fafc", "#eef2ff"]} className="flex-1">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* CARD */}
          <Animated.View
            style={{
              opacity: cardFade,
              transform: [{ translateY: cardTranslate }],
            }}
            className="bg-white rounded-2xl px-6 py-8 shadow-lg"
          >
            {/* HEADER */}
            <View className="items-center mb-8">
              <Animated.View
                style={{ transform: [{ translateY: floatIcon }] }}
                className="w-14 h-14 rounded-full bg-blue-600 items-center justify-center mb-4"
              >
                <Ionicons name="airplane-outline" size={26} color="#fff" />
              </Animated.View>

              <Text className="text-2xl font-bold text-gray-900">
                Create Account
              </Text>
              <Text className="text-gray-500 text-sm mt-1 text-center">
                Join us and start exploring
              </Text>
            </View>

            {/* INPUTS */}
            <Animated.View
              style={{
                opacity: inputOpacity[0],
                transform: [{ translateY: inputAnim[0] }],
              }}
            >
              <FormInput
                label="Full Name"
                icon="person-outline"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
              />
            </Animated.View>

            <Animated.View
              style={{
                opacity: inputOpacity[1],
                transform: [{ translateY: inputAnim[1] }],
              }}
            >
              <FormInput
                label="Email Address"
                icon="mail-outline"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Animated.View>

            <Animated.View
              style={{
                opacity: inputOpacity[2],
                transform: [{ translateY: inputAnim[2] }],
              }}
            >
              <FormInput
                label="Password"
                icon="lock-closed-outline"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </Animated.View>

            {/* CTA */}
            <TouchableOpacity
              disabled={loading}
              activeOpacity={1}
              onPress={handleRegister}
              onPressIn={() =>
                Animated.spring(buttonScale, {
                  toValue: 0.95,
                  useNativeDriver: true,
                }).start()
              }
              onPressOut={() =>
                Animated.spring(buttonScale, {
                  toValue: 1,
                  friction: 6,
                  useNativeDriver: true,
                }).start()
              }
              className="mt-4"
            >
              <Animated.View
                style={{ transform: [{ scale: buttonScale }] }}
                className="bg-blue-600 rounded-xl py-4 items-center"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-base font-semibold">
                    Create Account
                  </Text>
                )}
              </Animated.View>
            </TouchableOpacity>

            {/* FOOTER */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-500 text-sm">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-blue-600 font-semibold ml-1 text-sm">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast />
    </LinearGradient>
  );
}

/* ---------- INPUT ---------- */
const FormInput = ({ label, icon, ...props }: any) => {
  const focusAnim = useRef(new Animated.Value(0)).current;

  return (
    <View className="mb-5">
      <Text className="text-xs font-medium text-gray-600 mb-2">{label}</Text>

      <Animated.View
        style={{
          borderColor: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["#e5e7eb", "#3b82f6"],
          }),
        }}
        className="flex-row items-center border rounded-xl px-4 h-12 bg-gray-50"
      >
        <Ionicons name={icon} size={18} color="#6b7280" />
        <TextInput
          {...props}
          className="flex-1 ml-3 text-gray-900 text-sm"
          placeholderTextColor="#9ca3af"
          onFocus={() =>
            Animated.timing(focusAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }).start()
          }
          onBlur={() =>
            Animated.timing(focusAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }).start()
          }
        />
      </Animated.View>
    </View>
  );
};
