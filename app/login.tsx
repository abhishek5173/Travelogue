import { useAuth } from "@/lib/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [eyes,seteyes] = useState(true);

  const router = useRouter();
  const { user } = useAuth();

  /* Animations */
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(30)).current;

  const inputY = useRef([
    new Animated.Value(20),
    new Animated.Value(20),
  ]).current;

  const inputOpacity = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const planeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  /* Entry animation */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
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
      inputY.map((y, i) =>
        Animated.parallel([
          Animated.timing(y, {
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

  /* Floating airplane */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(planeAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(planeAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  /* Button pulse */
  useEffect(() => {
    if (loading) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [loading]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    }
    if (!email.includes("@")) {
      Toast.show({ type: "error", text1: "Please enter a valid email" });
      return;
    }

    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
      Toast.show({ type: "success", text1: "Welcome back 👋" });
      router.replace("/");
    } catch (error: any) {
      let message = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") message = "Account not found";
      else if (error.code === "auth/wrong-password") message = "Incorrect password";
      else if (error.code === "auth/invalid-email") message = "Invalid email address";
      Toast.show({ type: "error", text1: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#f8fafc", "#eef2ff"]} className="flex-1">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 justify-center px-6">
        <Animated.View
          style={{
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslate }],
          }}
          className="bg-white rounded-2xl px-6 py-8 shadow-lg"
        >
          {/* Header */}
          <View className="items-center mb-8">
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: planeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -8],
                    }),
                  },
                  {
                    rotate: planeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "3deg"],
                    }),
                  },
                ],
              }}
              className="w-14 h-14 rounded-full bg-blue-600 items-center justify-center mb-4"
            >
              <Ionicons name="airplane-outline" size={26} color="#fff" />
            </Animated.View>

            <Text className="text-2xl font-bold text-gray-900">
              Welcome
            </Text>
            <Text className="text-gray-500 text-sm mt-1 text-center">
              Sign in to continue your journey
            </Text>
          </View>

          {/* Inputs */}
          <Animated.View
            style={{
              opacity: inputOpacity[0],
              transform: [{ translateY: inputY[0] }],
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
              opacity: inputOpacity[1],
              transform: [{ translateY: inputY[1] }],
            }}
          >
            <View>
              <FormInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={eyes}
            />
              <TouchableOpacity className="absolute right-0 top-9 mr-4">
                {eyes ?<Ionicons name="eye-off-outline" size={20} color="#6b7280" onPress={()=>seteyes(!eyes)}/>:<Ionicons name="eye-outline" size={20} color="#6b7280" onPress={()=>seteyes(!eyes)}/>}
              </TouchableOpacity>
            </View>
            
          </Animated.View>

          {/* Button */}
          <TouchableOpacity
            disabled={loading}
            activeOpacity={1}
            onPress={handleLogin}
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
              style={{
                transform: [
                  { scale: loading ? 1 : pulseAnim },
                  { scale: buttonScale },
                ],
              }}
              className="bg-blue-600 rounded-xl py-4 items-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Sign In
                </Text>
              )}
            </Animated.View>
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500 text-sm">
              Don’t have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-blue-600 font-semibold ml-1 text-sm">
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      <Toast />
    </LinearGradient>
  );
}

/* ---------- INPUT ---------- */
const FormInput = ({ label, icon, ...props }: any) => {
  const focusAnim = useRef(new Animated.Value(0)).current;

  return (
    <View className="mb-5">
      <Text className="text-xs font-medium text-gray-600 mb-2">
        {label}
      </Text>

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
