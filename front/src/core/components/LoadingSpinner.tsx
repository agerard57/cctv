import { FC } from "react";
import { LoadingSpinnerSvg } from "../assets";

interface LoadingSpinnerProps {
  color?: "white" | "black";
  height?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ color = "black", height = "3vw" }) => (
  <img
    src={LoadingSpinnerSvg}
    style={{
      height,
      filter: color === "white" ? "invert(1)" : "none",
    }}
  />
);
