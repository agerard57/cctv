import { FC } from "react";
import { Button } from "@mui/material";
import axios from "axios";

type Props = {
  handleRfidCode: (code: string) => void;
  handleSkipRfid: () => void;
};

export const DebugSystemConfigurationRfidButtons: FC<Props> = ({ handleRfidCode, handleSkipRfid }) => {
  const sendOverride = async (overrideCode: string) => {
    try {
      // TODO Change the url
      await axios.get("/api/rfid-code", { params: { override_code: overrideCode } });
      handleRfidCode(overrideCode);
    } catch (error) {
      console.error("Failed to send override code:", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "2vw", justifyContent: "center" }}>
      <Button variant="contained" onClick={() => sendOverride("123456")}>
        Valid RFID Code
      </Button>
      <Button variant="contained" onClick={() => sendOverride("000000")}>
        Invalid RFID Code
      </Button>
      {/* TODO Add skip to other enigmas */}
      <Button variant="contained" onClick={handleSkipRfid}>
        Skip RFID Code
      </Button>
    </div>
  );
};
