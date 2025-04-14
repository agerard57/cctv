import { alpha } from "@mui/material";
import { colorPalette } from "./colorPalette";

export const appTheme = {
  app: {
    core: {
      securityBrandAlternativeColor: colorPalette.red,
      whiteTransparentBackground: alpha(colorPalette.white, 0.12),
      keyButtons: {
        backgroundColor: colorPalette.grey1,
        textColor: alpha(colorPalette.black, 0.7),
      },
    },
    lockedScreen: {
      sessionStatus: {
        locked: alpha(colorPalette.black, 0.7),
      },
      PinInput: {
        backgroundColor: alpha(colorPalette.black, 0.25),
        status: {
          empty: "transparent",
          filled: alpha(colorPalette.white, 0.9),
          error: alpha(colorPalette.red, 0.9),
        },
      },
    },
  },
} as const;
