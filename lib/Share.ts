import * as Clipboard from "expo-clipboard";
import { useEffect } from "react";
import { AppState, NativeModules } from "react-native";

const { ShareModule } = NativeModules;

export function useInstagramShare(onReceive: (url: string) => void) {
  useEffect(() => {
    let handled = false;

    const tryRecover = async () => {
      if (handled) return;

      let url = null;

      // 1️⃣ Try native intent
      if (ShareModule?.getSharedText) {
        url = await ShareModule.getSharedText();
      }

      // 2️⃣ Fallback to clipboard
      if (!url) {
        const clip = await Clipboard.getStringAsync();
        if (clip?.includes("instagram.com")) {
          url = clip;
        }
      }

      if (url && !handled) {
        handled = true;
        onReceive(url);
      }
    };

    tryRecover();

    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") tryRecover();
    });

    return () => sub.remove();
  }, []);
}
