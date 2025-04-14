import { useContext } from "react";
import { KeyStateContext } from "../contexts";

export const useKeyState = () => {
  const context = useContext(KeyStateContext);

  if (!context) {
    throw new Error("useKeyState must be used within a KeyStateProvider");
  }

  return context;
};
