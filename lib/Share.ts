import * as Clipboard from "expo-clipboard";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

const isValidInstagramUrl = (text: string) =>
  text.includes("instagram.com/reel") ||
  text.includes("instagram.com/p/");

export function useInstagramShare(onReceive: (url: string) => void) {
  const handledRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const tryReadWithDelay = (source: string) => {
    if (handledRef.current) return;

    console.log(`🟡 [${source}] Scheduling clipboard read...`);

    timeoutRef.current = setTimeout(async () => {
      if (handledRef.current) return;

      const clip = await Clipboard.getStringAsync();

      console.log(`📋 [${source}] Clipboard content:`, clip);

      if (clip && isValidInstagramUrl(clip)) {
        console.log("✅ Instagram URL detected");
        handledRef.current = true;
        onReceive(clip);
      } else {
        console.log("❌ No valid Instagram URL found");
      }
    }, 500);
  };

  useEffect(() => {
    // 1️⃣ First app open
    tryReadWithDelay("mount");

    // 2️⃣ When app comes to foreground
    const sub = AppState.addEventListener("change", (state) => {
      console.log("🔵 AppState changed:", state);
      if (state === "active") {
        tryReadWithDelay("AppState.active");
      }
    });

    return () => {
      sub.remove();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}
