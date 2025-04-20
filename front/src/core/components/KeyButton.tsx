import { FC } from "react";
import { Typography, useTheme } from "@mui/material";

interface Props {
  label: string;
  icon?: string;
  isEnabled?: boolean;
  width?: string;
  padding?: string;
  direction?: "row" | "column";
  reversed?: boolean;
}

export const KeyButton: FC<Props> = ({
  label,
  icon,
  isEnabled,
  width = "6vw",
  padding = "0.5vh 1vw",
  direction = "row",
  reversed = false,
}) => {
  const theme = useTheme();

  return (
    <div
      key={label}
      style={{
        backgroundColor: theme.app.core.keyButtons.backgroundColor,
        padding: padding,
        width: width,
        height: direction === "row" ? "5vh" : "6vh",
        borderRadius: "5px",
        display: "flex",
        gap: "10%",
        flexDirection: reversed ? (direction === "row" ? "row-reverse" : "column-reverse") : direction,
        alignItems: "center",
        justifyContent: "space-around",
        opacity: isEnabled ? 1 : 0.5,
      }}
    >
      <Typography variant="fButtons" style={{ color: theme.app.core.keyButtons.textColor }}>
        {label}
      </Typography>
      {icon && (
        <img
          src={icon}
          alt={`${label} icon`}
          style={{
            width: direction === "column" ? "2vh" : "auto",
            height: direction === "column" ? "auto" : "1.3vw",
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
};
