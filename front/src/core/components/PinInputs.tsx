import { FC } from "react";
import { PinInputStatuses } from "../typings";
import { Theme, useTheme } from "@mui/material";

// TODO Move helper
const getInnerCircleColor = (theme: Theme, status: PinInputStatuses) => {
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

// TODO Enum for shape, interface for Props and Pin in another file
interface Props {
  pins: { status: PinInputStatuses; value?: string }[];
  pinShape: "rectangle" | "circle";
  transparent?: boolean; // Add new prop to control background transparency
}

export const PinInputs: FC<Props> = ({ pins, pinShape, transparent = false }) => {
  const theme = useTheme();

  return pins.map((pin, index) => (
    <div
      key={index}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: pinShape === "circle" ? "50%" : "15%",
        width: pinShape === "circle" ? "3vw" : "2vw",
        height: "3vw",
        backgroundColor: transparent ? "transparent" : theme.app.lockedScreen.PinInput.backgroundColor,
        position: "relative",
        fontSize: "1.5vw",
        fontWeight: "bold",
        color: pin.value ? getInnerCircleColor(theme, pin.status) : undefined,
      }}
    >
      {pin.value ? (
        pin.value
      ) : (
        <div
          style={{
            borderRadius: "50%",
            width: "1vw",
            height: "1vw",
            backgroundColor: getInnerCircleColor(theme, pin.status),
          }}
        />
      )}
    </div>
  ));
};
