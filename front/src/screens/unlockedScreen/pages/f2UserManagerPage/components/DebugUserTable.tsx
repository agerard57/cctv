import { FC } from "react";
import { Button } from "@mui/material";

interface Props {
  onClick: () => void;
}

export const DebugUserTable: FC<Props> = ({ onClick }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
    <Button variant="contained" onClick={onClick}>
      Skip
    </Button>
  </div>
);
