import * as Linking from "expo-linking";
import { useEffect } from "react";
import { AppState } from "react-native";

/**
 * Listens for shared text (Instagram, WhatsApp, etc.)
 */
export function useShareListener(onShare: (url: string) => void) {
  useEffect(() => {
    let isMounted = true;

    // 1️⃣ Handle app opened via share (cold start)
    const handleInitial = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && isMounted) {
          onShare(initialUrl);
        }
      } catch (e) {
        console.warn("Initial share error", e);
      }
    };

    handleInitial();

    // 2️⃣ Handle app already open (background → foreground)
    const sub = Linking.addEventListener("url", ({ url }) => {
      if (url && isMounted) {
        onShare(url);
      }
    });

    // 3️⃣ Android share fix (Instagram sends text, not URL)
    const appStateSub = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        const url = await Linking.getInitialURL();
        if (url && isMounted) {
          onShare(url);
        }
      }
    });

    return () => {
      isMounted = false;
      sub.remove();
      appStateSub.remove();
    };
  }, []);
}
