import { FC } from "react";
import { Button } from "@mui/material";
import { useConstants } from "@/providers/constants";
import { RfidStatuses } from "../typings";
import { fetchRfidStatus } from "../helpers/rfid";

type Props = {
  validRfidCode: string;
  onHandleRfid: (code: RfidStatuses) => void;
  onRfidSkip: () => void;
};

export const DebugRfidButtons: FC<Props> = ({ validRfidCode, onHandleRfid, onRfidSkip }) => {
  const appConstants = useConstants();

  return (
    <div style={{ display: "flex", gap: "2vw" }}>
      <Button variant="contained" onClick={() => fetchRfidStatus(validRfidCode, validRfidCode, onHandleRfid)}>
        Good RFID Code
      </Button>
      <Button
        variant="contained"
        onClick={() => fetchRfidStatus(validRfidCode, appConstants.DEBUG_BAD_RFID, onHandleRfid)}
      >
        Bad RFID Code
      </Button>
      <Button variant="contained" onClick={onRfidSkip}>
        Skip RFID
      </Button>
    </div>
  );
};
