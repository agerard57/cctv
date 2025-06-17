import { Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { SetStateAction, Dispatch, FC, useState } from "react";
import { useProgress } from "../../../../../providers";
import { useConstants } from "@/providers/constants";

export const DebugInsertMedia: FC<{
  debugDevice: string | undefined;
  setDebugDevice: Dispatch<SetStateAction<string | undefined>>;
}> = ({ setDebugDevice }) => {
  const { setMediaProvided } = useProgress();
  const appConstants = useConstants();
  const { VALID_USB } = appConstants.unlockedScreen.replayManager.USB;
  const [selectedScenario, setSelectedScenario] = useState<string>("no-usb");

  const handleScenarioChange = (scenario: string) => {
    setSelectedScenario(scenario);

    switch (scenario) {
      case "valid-usb":
        console.log("Debug: Simulating valid USB device");
        setDebugDevice(VALID_USB);
        break;
      case "invalid-usb":
        console.log("Debug: Simulating invalid USB device");
        setDebugDevice("1");
        break;
      case "no-usb":
        console.log("Debug: Simulating no USB devices");
        setDebugDevice(undefined);
        break;
      default:
        setDebugDevice(undefined);
    }
  };

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
      <FormControl style={{ minWidth: 200 }}>
        <InputLabel>Debug USB Scenario</InputLabel>
        <Select
          value={selectedScenario}
          onChange={(e) => handleScenarioChange(e.target.value as string)}
          label="Debug USB Scenario"
        >
          <MenuItem value="no-usb">No USB</MenuItem>
          <MenuItem value="valid-usb">Valid USB (T1)</MenuItem>
          <MenuItem value="invalid-usb">Invalid USB (T2)</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={() => setMediaProvided(true)}>
        Skip USB Validation
      </Button>
    </div>
  );
};
