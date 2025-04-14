import { FC } from "react";

interface Props {
  shortcut: string;
}

export const ShortcutChip: FC<Props> = ({ shortcut }) => (
  <span
    style={{
      margin: "0 10px",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: "2px 6px",
      borderRadius: "4px",
      display: "inline-block",
      color: "#fff",
      fontSize: "0.8em",
    }}
  >
    {shortcut}
  </span>
);
