import { JSX } from "react";
import { LockedScreen } from "./lockedScreen/components/LockedScreen";
import { UnlockedScreen } from "./unlockedScreen/components/UnlockedScreen";

export enum Screens {
  LOCKED_SCREEN = "lockedScreen",
  UNLOCKED_SCREEN = "unlockedScreen",
}

export type Routes = {
  [Page in Screens]: {
    name: Page;
    path: string;
    element: JSX.Element;
  };
};

export const screens: Routes = {
  [Screens.LOCKED_SCREEN]: { name: Screens.LOCKED_SCREEN, path: "/", element: <LockedScreen /> },
  [Screens.UNLOCKED_SCREEN]: {
    name: Screens.UNLOCKED_SCREEN,
    path: `/${Screens.UNLOCKED_SCREEN}`,
    element: <UnlockedScreen />,
  },
};
