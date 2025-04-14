import { FC } from "react";
import { LoadingSpinnerSvg } from "../assets";

interface LoadingSpinnerProps {
  color?: "white" | "black";
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ color = "black" }) => (
  <img
    src={LoadingSpinnerSvg}
    style={{
      height: "3vw",
      filter: color === "white" ? "invert(1)" : "none",
    }}
  />
);
