import { FC } from "react";
import { PinInputStatuses } from "../typings";
import { useTheme } from "@mui/material";
import { LoadingSpinner } from "./LoadingSpinner";
import { getInnerCircleColor } from "../helpers";

interface PinInput {
  status: PinInputStatuses;
  value?: string;
}

interface Props {
  loading?: boolean;
  pins: PinInput[];
  pinShape: "rectangle" | "circle";
  transparent?: boolean;
}

export const PinInputs: FC<Props> = ({ loading = false, pins, pinShape, transparent = false }) => {
  const theme = useTheme();

  if (loading) return <LoadingSpinner color="white" />;

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
