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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("ControlCenterPage");
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
        if (!isAuthDialogOpen) {
          setVentilationLightStatus((prev) => !prev);
        }
      },
      "3": () => {
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
      label: t("ventilationShaftControl.controls.ventilationDoor"),
      value: ventilationDoorStatus ? 1 : 0,
      customDisplay: ventilationDoorStatus
        ? t("ventilationShaftControl.doorStatus.locked")
        : t("ventilationShaftControl.doorStatus.unlocked"),
      threshold: 1,
      icon: <DoorFrontOutlined />,
      buttonLabel: ventilationDoorStatus
        ? t("ventilationShaftControl.controls.lockDoor")
        : t("ventilationShaftControl.controls.unlockDoor"),
      onButtonClick: () => {
        setVentilationDoorStatus((prev) => !prev);
      },
      keyboardShortcut: "1",
    },
    {
      label: t("ventilationShaftControl.controls.lightStatus"),
      value: ventilationLightStatus ? 1 : 0,
      customDisplay: ventilationLightStatus
        ? t("ventilationShaftControl.lightStatus.on")
        : t("ventilationShaftControl.lightStatus.off"),
      threshold: 1,
      icon: <LightbulbOutlined />,
      buttonLabel: ventilationLightStatus
        ? t("ventilationShaftControl.controls.turnOffLight")
        : t("ventilationShaftControl.controls.turnOnLight"),
      onButtonClick: () => {
        setVentilationLightStatus((prev) => !prev);
      },
      keyboardShortcut: "2",
    },
    {
      label: t("ventilationShaftControl.controls.fanStatus"),
      value: ventilationFanStatus ? 1 : 0,
      customDisplay: ventilationFanStatus
        ? t("ventilationShaftControl.status.on")
        : t("ventilationShaftControl.status.off"),
      threshold: 1,
      icon: <AirOutlined />,
      buttonLabel: ventilationFanStatus
        ? t("ventilationShaftControl.controls.turnOffFan")
        : t("ventilationShaftControl.controls.turnOnFan"),
      onButtonClick: () => {
        setVentilationFanStatus((prev) => !prev);
      },
      keyboardShortcut: "3",
    },
  ];

  // Environmental stats
  const otherStatsArray = [
    {
      label: t("ventilationShaftControl.envStats.airQuality"),
      value: metrics.airQuality,
      unit: "%",
      threshold: 90,
      icon: <AirQualityIcon />,
    },
    {
      label: t("ventilationShaftControl.envStats.humidity"),
      value: metrics.humidity,
      unit: "%",
      threshold: 60,
      icon: <WaterDropOutlined />,
    },
    {
      label: t("ventilationShaftControl.envStats.noiseLevel"),
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
