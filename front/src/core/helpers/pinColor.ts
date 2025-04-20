import { PinInputStatuses } from "../typings";
import { Theme } from "@mui/material";

type GetInnerCircleColorProps = (theme: Theme, status: PinInputStatuses) => string;

/**
 * Determines the inner circle color based on the theme and PinInput status.
 * @param theme - The MUI theme object.
 * @param status - The current status of the PinInput.
 * @returns The color for the inner circle.
 */
export const getInnerCircleColor: GetInnerCircleColorProps = (theme: Theme, status: PinInputStatuses) => {
  switch (status) {
    case PinInputStatuses.EMPTY:
      return theme.app.lockedScreen.PinInput.status.empty;
    case PinInputStatuses.FILLED:
      return theme.app.lockedScreen.PinInput.status.filled;
    case PinInputStatuses.ERROR:
      return theme.app.lockedScreen.PinInput.status.error;
    default:
      return theme.app.lockedScreen.PinInput.status.empty;
  }
};
