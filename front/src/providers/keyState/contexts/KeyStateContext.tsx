import { createContext } from "react";
import { KeyState, KeyStates, SupportedKeys } from "../typings";

interface KeyStateContextProps {
  keyStates: KeyStates;
  updateKeyState: (keyStates: Partial<Record<SupportedKeys, KeyState | string>>) => void;
  resetKeyStates: () => void;
}

export const KeyStateContext = createContext<KeyStateContextProps | undefined>(undefined);
