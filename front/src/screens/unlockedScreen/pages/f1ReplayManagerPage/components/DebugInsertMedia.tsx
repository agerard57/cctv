import { Button } from "@mui/material";
import { SetStateAction, Dispatch, FC } from "react";
import { UsbStatuses } from "../typings";
import { useProgress } from "../../../../../providers";

export const DebugInsertMedia: FC<{
  debugStatus: UsbStatuses;
  setDebugStatus: Dispatch<SetStateAction<UsbStatuses>>;
}> = ({ setDebugStatus }) => {
  const { setMediaProvided } = useProgress();

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
      <Button variant="contained" onClick={() => setDebugStatus(UsbStatuses.MISSING)}>
        Set Missing
      </Button>
      <Button variant="contained" onClick={() => setDebugStatus(UsbStatuses.INVALID)} style={{ marginLeft: "10px" }}>
        Set Invalid
      </Button>
      <Button variant="contained" onClick={() => setDebugStatus(UsbStatuses.VALID)} style={{ marginLeft: "10px" }}>
        Set Valid
      </Button>
      <Button variant="contained" onClick={() => setMediaProvided(true)} style={{ marginLeft: "10px" }}>
        Hide
      </Button>
    </div>
  );
};
