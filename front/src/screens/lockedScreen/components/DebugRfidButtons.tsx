import { FC } from "react";
import { Button } from "@mui/material";
import { useConstants } from "@/providers/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Screens } from "../../Screens";
import { useProgress } from "@/providers";

type Props = {
  handleRfidCode: (code: string) => void;
};

export const DebugRfidButtons: FC<Props> = () => {
  const appConstants = useConstants();
  const navigate = useNavigate();
  const { setSessionUnlocked } = useProgress();

  const sendOverride = async (overrideCode: string) => {
    try {
      await axios.get("/api/rfid-code", { params: { override_code: overrideCode } });
    } catch (error) {
      console.error("Failed to send override code:", error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "2vw" }}>
      <Button variant="contained" onClick={() => sendOverride(appConstants.lockedScreen.cardReader.VALID_RFID_CODE)}>
        Good RFID Code
      </Button>
      <Button variant="contained" onClick={() => sendOverride(appConstants.lockedScreen.cardReader.DEBUG_BAD_RFID)}>
        Bad RFID Code
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setSessionUnlocked(true);
          navigate(Screens.UNLOCKED_SCREEN);
        }}
      >
        Skip RFID
      </Button>
    </div>
  );
};
