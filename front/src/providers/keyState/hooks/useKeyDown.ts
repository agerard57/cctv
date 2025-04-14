import { useEffect } from "react";
import { isDigitKey } from "../helpers";
import { SupportedKeys } from "..";

export const useKeyDown = (
  keyCallbacks: Partial<Record<SupportedKeys, () => void>>,
  digitCallback?: (digit: string) => void,
  dependencies: any[] = [],
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (digitCallback && isDigitKey(key)) {
        digitCallback(key);
        return;
      }

      const callback = keyCallbacks[key as SupportedKeys];
      if (callback) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyCallbacks, digitCallback, ...dependencies]);
};
