import { FC, ReactNode, useCallback, useState } from "react";
import { KeyStateContext } from "../contexts";
import { KeyState, KeyStates, SupportedKeys } from "../typings";

interface Props {
  children: ReactNode;
}

// TODO Make it so there are default icons if icons has "default" provided

type NewKeyStates = Partial<Record<SupportedKeys, KeyState | string>>;

const DEFAULT_KEY_STATE: KeyStates = {
  [SupportedKeys.ASTERISK]: { enabled: true },
};

export const KeyStateProvider: FC<Props> = ({ children }) => {
  const [keyStates, setKeyStates] = useState<KeyStates>(DEFAULT_KEY_STATE);

  const updateKeyState = useCallback((newKeyStates: NewKeyStates) => {
    setKeyStates((prev) => ({
      ...prev,
      ...DEFAULT_KEY_STATE,
      ...Object.entries(newKeyStates).reduce((acc, [key, state]) => {
        if (typeof state === "string") {
          acc[key] = { enabled: true, icon: state };
        } else if (state && typeof state === "object") {
          acc[key] = { ...state, enabled: state.enabled ?? true };
        }
        return acc;
      }, {} as KeyStates),
    }));
  }, []);

  const resetKeyStates = useCallback(() => {
    setKeyStates(DEFAULT_KEY_STATE);
  }, []);

  return (
    <KeyStateContext.Provider value={{ keyStates, updateKeyState, resetKeyStates }}>
      {children}
    </KeyStateContext.Provider>
  );
};
