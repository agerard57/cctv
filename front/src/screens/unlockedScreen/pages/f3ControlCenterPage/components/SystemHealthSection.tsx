import { FC, useEffect } from "react";
import { Box } from "@mui/material";
import { ChartCard, StatCard } from "./PowerStatsSection";
import {
  AirOutlined,
  FavoriteOutlined,
  BatteryChargingFullOutlined,
  BatteryStdOutlined,
  AcUnitOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";
import { useKeyState } from "../../../../../providers";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../f1ReplayManagerPage/assets";

const styles = {
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "24px",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    width: "100%",
  },
  chartContainer: {
    width: "100%",
  },
};

interface SystemHealthProps {
  metrics: {
    fanSpeed: number;
    systemHealth: number;
    powerEfficiency: number;
    batteryHealth: number;
    systemEfficiency: number;
    coolingLoad: number;
    systemStability: number;
  };
  graphData: {
    fanSpeedHistory: (number | null)[];
    systemEfficiencyHistory: (number | null)[];
  };
}

export const SystemHealthSection: FC<SystemHealthProps> = ({ metrics, graphData }) => {
  // Remove local state management since it's handled by parent
  const { updateKeyState, resetKeyStates } = useKeyState();

  useEffect(() => {
    updateKeyState({
      PageUp: PgUpKeyIcon,
      PageDown: PgDnKeyIcon,
    });
    return () => {
      resetKeyStates();
    };
  }, [updateKeyState]);

  const statsArray = [
    { label: "Fan Speed", value: metrics.fanSpeed, unit: "RPM", threshold: 2000, icon: <AirOutlined /> },
    { label: "System Health", value: metrics.systemHealth, unit: "%", threshold: 100, icon: <FavoriteOutlined /> },
    {
      label: "Power Efficiency",
      value: metrics.powerEfficiency,
      unit: "%",
      threshold: 100,
      icon: <BatteryChargingFullOutlined />,
    },
    { label: "Battery Health", value: metrics.batteryHealth, unit: "%", threshold: 100, icon: <BatteryStdOutlined /> },
    {
      label: "Thermal Efficiency",
      value: metrics.systemEfficiency,
      unit: "%",
      threshold: 100,
      icon: <AcUnitOutlined />,
    },
    {
      label: "System Stability",
      value: metrics.systemStability,
      unit: "%",
      threshold: 100,
      icon: <VerifiedOutlined />,
    },
  ];

  const timeLabels = Array.from({ length: 30 }, (_, i) => (30 - i).toString()).concat("Now");

  return (
    <Box sx={{ padding: "2vh 0px" }}>
      <div style={styles.statsGrid}>
        {statsArray.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div style={styles.chartsRow}>
        <div style={styles.chartContainer}>
          <ChartCard
            title="Fan Speed Over Time"
            labels={timeLabels}
            data={graphData.fanSpeedHistory.filter((value): value is number => value !== null)}
            label="Fan Speed"
            borderColor="#7c63d5"
            backgroundColor="rgba(76, 175, 80, 0.2)"
            yAxisLabel="Fan Speed (RPM)"
            chartType="line"
          />
        </div>

        <div style={styles.chartContainer}>
          <ChartCard
            title="System Efficiency Over Time"
            labels={timeLabels}
            data={graphData.systemEfficiencyHistory.filter((value): value is number => value !== null)}
            label="System Efficiency"
            borderColor="#ff9800"
            backgroundColor="rgba(255, 152, 0, 0.2)"
            yAxisLabel="System Efficiency (%)"
            chartType="line"
          />
        </div>
      </div>
    </Box>
  );
};
