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
import { useTranslation } from "react-i18next";
import { generateTimeLabels } from "../utils/timeHelpers";

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
  const { t } = useTranslation("ControlCenterPage");
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
  }, [updateKeyState, resetKeyStates]);

  const statsArray = [
    {
      label: t("systemHealth.stats.fanSpeed"),
      value: metrics.fanSpeed,
      unit: t("units.rpm"),
      threshold: 2000,
      icon: <AirOutlined />,
    },
    {
      label: t("systemHealth.stats.systemHealth"),
      value: metrics.systemHealth,
      unit: t("units.percent"),
      threshold: 100,
      icon: <FavoriteOutlined />,
    },
    {
      label: t("systemHealth.stats.powerEfficiency"),
      value: metrics.powerEfficiency,
      unit: t("units.percent"),
      threshold: 100,
      icon: <BatteryChargingFullOutlined />,
    },
    {
      label: t("systemHealth.stats.batteryHealth"),
      value: metrics.batteryHealth,
      unit: t("units.percent"),
      threshold: 100,
      icon: <BatteryStdOutlined />,
    },
    {
      label: t("systemHealth.stats.thermalEfficiency"),
      value: metrics.systemEfficiency,
      unit: t("units.percent"),
      threshold: 100,
      icon: <AcUnitOutlined />,
    },
    {
      label: t("systemHealth.stats.systemStability"),
      value: metrics.systemStability,
      unit: t("units.percent"),
      threshold: 100,
      icon: <VerifiedOutlined />,
    },
  ];

  const timeLabels = generateTimeLabels(30, t);

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
            title={t("systemHealth.charts.fanSpeedOverTime")}
            labels={timeLabels}
            data={graphData.fanSpeedHistory.map((v) => (v === null ? 0 : v))}
            label={t("systemHealth.stats.fanSpeed")}
            borderColor="#5bc6ef"
            backgroundColor="rgba(76, 175, 80, 0.2)"
            yAxisLabel={t("systemHealth.charts.fanSpeedAxisLabel")}
            chartType="line"
          />
        </div>

        <div style={styles.chartContainer}>
          <ChartCard
            title={t("systemHealth.charts.systemEfficiencyOverTime")}
            labels={timeLabels}
            data={graphData.systemEfficiencyHistory.map((v) => (v === null ? 0 : v))}
            label={t("systemHealth.stats.thermalEfficiency")}
            borderColor="#ff9800"
            backgroundColor="rgba(255, 152, 0, 0.2)"
            yAxisLabel={t("systemHealth.charts.systemEfficiencyAxisLabel")}
            chartType="line"
          />
        </div>
      </div>
    </Box>
  );
};
