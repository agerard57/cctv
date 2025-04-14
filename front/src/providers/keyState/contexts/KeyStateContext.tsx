import { createContext } from "react";
import { KeyState, KeyStates, SupportedKeys } from "../typings";

interface KeyStateContextProps {
  keyStates: KeyStates;
  updateKeyState: (keyStates: Partial<Record<SupportedKeys, KeyState | string>>) => void;
  resetKeyStates: () => void;
  // TODO Just a clue
  /*   useKeyActions: (
    keyActions: Partial<
      Record<
        SupportedKeys,
        {
          callback: () => void;
          icon?: string;
        }
      >
    >,
    dependencies?: any[],
  ) => void; */
}

export const KeyStateContext = createContext<KeyStateContextProps | undefined>(undefined);
