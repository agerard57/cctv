import { FC, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { AdminControlsCard } from "./AdminControlsCard";
import {
  DoorFrontOutlined,
  LightbulbOutlined,
  AirOutlined,
  AirOutlined as AirQualityIcon,
  WaterDropOutlined,
  VolumeUpOutlined,
} from "@mui/icons-material";
import { StatCard } from "../PowerStatsSection";
import { useKeyDown, useKeyState, useProgress } from "@/providers";
import { enableIconlessKeys, SupportedKeys } from "@/providers/keyState";
import { ControlCard } from "./ControlCard";
import { LoadChart } from "./LoadChart";
import { AllMetrics } from "../ControlCenterPage";

const styles = {
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "24px",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 3fr",
    gap: "24px",
    width: "100%",
    marginBottom: "24px",
  },
  chartContainer: {
    width: "100%",
  },
};

type VentilationMetrics = Pick<AllMetrics, "airQuality" | "humidity" | "noiseLevel" | "ventilationCurrentLoad">;

interface Props {
  metrics: VentilationMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<VentilationMetrics>>;
}

export const VentilationShaftControlSection: FC<Props> = ({ metrics, setMetrics }) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);

  const { progress } = useProgress();

  const [ventilationDoorStatus, setVentilationDoorStatus] = useState<boolean>(false);
  const [ventilationLightStatus, setVentilationLightStatus] = useState<boolean>(false);
  const [ventilationFanStatus, setVentilationFanStatus] = useState<boolean>(false);

  // TODO Add sfx for these buttons, F4, The dialogs and everything else really...
  useKeyDown(
    {
      "1": () => {
        if (!isAuthDialogOpen) {
          setVentilationDoorStatus((prev) => !prev);
        }
      },
      "2": () => {
        console.log("Key 2 pressed");
        if (!isAuthDialogOpen) {
          setVentilationLightStatus((prev) => !prev);
        }
      },
      "3": () => {
        console.log("Key 3 pressed");
        if (!isAuthDialogOpen) {
          setVentilationFanStatus((prev) => !prev);
        }
      },
      "4": () => {
        if (!isAuthDialogOpen && !progress.isElectricalOutletDisconnected) {
          setIsAuthDialogOpen(true);
        }
      },
    },
    undefined,
    [setMetrics, progress.isElectricalOutletDisconnected, isAuthDialogOpen],
  );

  // Key state management
  const { updateKeyState, resetKeyStates } = useKeyState();

  useEffect(() => {
    updateKeyState({
      ...enableIconlessKeys([
        SupportedKeys.DIGIT_1,
        SupportedKeys.DIGIT_2,
        SupportedKeys.DIGIT_3,
        ...(!progress.isElectricalOutletDisconnected ? [SupportedKeys.DIGIT_4] : []),
      ]),
    });
    return () => {
      resetKeyStates();
    };
  }, [updateKeyState, resetKeyStates, progress.isElectricalOutletDisconnected]);

  // Control button configurations
  const controls = [
    {
      label: "Ventilation Door",
      value: ventilationDoorStatus ? 1 : 0,
      customDisplay: ventilationDoorStatus ? "On" : "Off",
      threshold: 1,
      icon: <DoorFrontOutlined />,
      buttonLabel: ventilationDoorStatus ? "Lock Ventilation Door" : "Unlock Ventilation Door",
      onButtonClick: () => {
        setVentilationDoorStatus((prev) => !prev);
      },
      keyboardShortcut: "1",
    },
    {
      label: "Light Status",
      value: ventilationLightStatus ? 1 : 0,
      customDisplay: ventilationLightStatus ? "On" : "Off",
      threshold: 1,
      icon: <LightbulbOutlined />,
      buttonLabel: ventilationLightStatus ? "Turn Off Light" : "Turn On Light",
      onButtonClick: () => {
        setVentilationLightStatus((prev) => !prev);
      },
      keyboardShortcut: "2",
    },
    {
      label: "Fan Status",
      value: ventilationFanStatus ? 1 : 0,
      customDisplay: ventilationFanStatus ? "On" : "Off",
      threshold: 1,
      icon: <AirOutlined />,
      buttonLabel: ventilationFanStatus ? "Turn Off Fan" : "Turn On Fan",
      onButtonClick: () => {
        setVentilationFanStatus((prev) => !prev);
      },
      keyboardShortcut: "3",
    },
  ];

  // Environmental stats
  const otherStatsArray = [
    {
      label: "Air Quality",
      value: metrics.airQuality,
      unit: "%",
      threshold: 90,
      icon: <AirQualityIcon />,
    },
    {
      label: "Humidity",
      value: metrics.humidity,
      unit: "%",
      threshold: 60,
      icon: <WaterDropOutlined />,
    },
    {
      label: "Noise Level",
      value: metrics.noiseLevel,
      unit: "dB",
      threshold: 50,
      icon: <VolumeUpOutlined />,
    },
  ];

  // TODO Current load must be set to 0

  return (
    <Box sx={{ padding: "2vh 0px" }}>
      <div style={styles.statsGrid}>
        {controls.map((control, index) => (
          <ControlCard key={`control-${index}`} {...control} />
        ))}

        {otherStatsArray.map((stat, index) => (
          <StatCard key={`stat-${index}`} {...stat} />
        ))}
      </div>

      <div style={styles.chartsRow}>
        <div style={styles.chartContainer}>
          <LoadChart currentLoad={metrics.ventilationCurrentLoad} />
        </div>

        <div style={styles.chartContainer}>
          <AdminControlsCard isDialogOpen={isAuthDialogOpen} setIsDialogOpen={setIsAuthDialogOpen} />
        </div>
      </div>
    </Box>
  );
};
