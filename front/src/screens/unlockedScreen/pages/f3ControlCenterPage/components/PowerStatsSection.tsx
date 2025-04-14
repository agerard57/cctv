import { FC, useEffect } from "react";
import { Typography, Card, CardContent, Box } from "@mui/material";
import { Line, Bar } from "react-chartjs-2"; // Import Bar chart
import {
  BoltOutlined,
  SpeedOutlined,
  ThermostatOutlined,
  BalanceOutlined,
  WavesOutlined,
  PowerOutlined,
  ElectricBoltOutlined,
  SettingsInputComponentOutlined,
  CompareArrowsOutlined,
} from "@mui/icons-material";
import { useKeyState } from "../../../../../providers";
import { PgDnKeyIcon, PgUpKeyIcon } from "../../f1ReplayManagerPage/assets";
import { useTranslation } from "react-i18next";
import { generateTimeLabels } from "../utils/timeHelpers";

interface PowerStatsProps {
  metrics: {
    currentLoad: any;
    voltage: number;
    powerEfficiency: number;
    batteryHealth: number;
    temperature: number;
    powerFactor: number;
    frequency: number;
    energyConsumption: number;
    reactivePower: number;
    apparentPower: number;
    loadImbalance: number;
  };
  graphData: {
    voltageHistory: (number | null)[];
    harmonicDistortionHistory: (number | null)[];
  };
}

const thresholds = {
  voltage: 240.8,
  currentLoad: 95,
  temperature: 48,
  powerFactor: 0.98,
  frequency: 52,
  energyConsumption: 1900,
  reactivePower: 120,
  apparentPower: 140,
  loadImbalance: 8,
};

// Add CSS styles for grid layout
const styles = {
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "24px",
  },
  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // 2 equal columns
    gap: "24px",
    width: "100%",
  },
  chartContainer: {
    width: "100%",
  },
};

export const StatCard: FC<{
  label: string;
  value: number | string;
  backgroundColor?: string;
  unit?: string;
  threshold?: number;
  icon?: React.ReactNode; // Add icon prop
  customDisplay?: string; // Add optional customDisplay prop
}> = ({ label, value, backgroundColor = "#00000017", unit, threshold, icon, customDisplay }) => {
  const style = {
    color: typeof value === "number" && value > (threshold ?? Number.MAX_VALUE) ? "orange" : "inherit",
  };

  return (
    <Card
      sx={{
        backgroundColor,
        color: "#fff",
        boxShadow: "none",
      }}
    >
      <CardContent style={{ padding: "2vh 2vw" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {icon && <Box sx={{ mr: 4 }}>{icon}</Box>}
          <div>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                margin: "0 0 10px 0",
                fontSize: "1.2rem",
                color: "#fffff",
              }}
            >
              {label}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                ...style,
                fontSize: "1.5rem",
              }}
            >
              {customDisplay ||
                (typeof value === "number" ? `${value.toFixed(2)} ${unit}` : `${value || "N/A"} ${unit || ""}`)}
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ChartCard: FC<{
  title: string;
  labels: string[];
  data: number[];
  label: string;
  borderColor: string;
  backgroundColor: string;
  yAxisLabel: string;
  chartType?: "line" | "bar"; // Add chartType prop
}> = ({ title, labels, data, label, borderColor, backgroundColor, yAxisLabel, chartType = "line" }) => {
  const { t } = useTranslation("ControlCenterPage");

  return (
    <Card
      sx={{
        backgroundColor: "#00000017",
        color: "#fff",
        height: "100%",
        boxShadow: "none",
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            fontSize: "1.2rem",
            color: "#fffff",
          }}
        >
          {title}
        </Typography>
        {chartType === "line" ? (
          <Line
            data={{
              labels,
              datasets: [
                {
                  label,
                  data,
                  borderColor,
                  backgroundColor,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    font: {
                      size: 14,
                    },
                    color: "#ffffffb0",
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#ffffffb0",
                    font: {
                      size: 14,
                    },
                  },
                  title: {
                    display: true,
                    text: t("charts.timeAxisLabel"),
                    font: {
                      size: 14,
                    },
                    color: "#ffffffb0",
                  },
                },
                y: {
                  ticks: {
                    color: "#ffffffb0",
                    font: {
                      size: 14,
                    },
                  },
                  title: {
                    display: true,
                    text: yAxisLabel,
                    font: {
                      size: 14,
                    },
                    color: "#ffffffb0",
                  },
                },
              },
            }}
            style={{ maxHeight: "200px", maxWidth: "100%" }}
          />
        ) : (
          <Bar
            data={{
              labels,
              datasets: [
                {
                  label,
                  data,
                  backgroundColor,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    font: {
                      size: 14,
                    },
                    color: "#ffffffb0",
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#ffffffb0",
                    font: {
                      size: 14,
                    },
                  },
                  title: {
                    display: true,
                    text: t("charts.metricsAxisLabel"),
                    font: {
                      size: 14,
                    },
                    color: "#ffffffb0",
                  },
                },
                y: {
                  ticks: {
                    color: "#ffffffb0",
                    font: {
                      size: 14,
                    },
                  },
                  title: {
                    display: true,
                    text: yAxisLabel,
                    font: {
                      size: 14,
                    },
                    color: "#ffffffb0",
                  },
                },
              },
            }}
            style={{ maxHeight: "200px", maxWidth: "100%" }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export const PowerStatsSection: FC<PowerStatsProps> = ({ metrics, graphData }) => {
  // Remove local state and random updates since they're now handled by parent
  const { updateKeyState, resetKeyStates } = useKeyState();
  const { t } = useTranslation("ControlCenterPage");

  useEffect(() => {
    updateKeyState({
      PageUp: PgUpKeyIcon,
      PageDown: PgDnKeyIcon,
    });
    return () => {
      resetKeyStates();
    };
  }, [updateKeyState, resetKeyStates]);

  // Replace hardcoded timeLabels with the helper function
  const timeLabels = generateTimeLabels(30, t);

  const statsArray = [
    {
      label: t("powerStats.metrics.voltage"),
      value: metrics.voltage,
      unit: t("units.volts"),
      threshold: thresholds.voltage,
      icon: <BoltOutlined />,
    },
    {
      label: t("powerStats.metrics.currentLoad"),
      value: metrics.currentLoad,
      unit: t("units.percent"),
      threshold: thresholds.currentLoad,
      icon: <SpeedOutlined />,
    },
    {
      label: t("powerStats.metrics.temperature"),
      value: metrics.temperature,
      unit: t("units.celsius"),
      threshold: thresholds.temperature,
      icon: <ThermostatOutlined />,
    },
    {
      label: t("powerStats.metrics.powerFactor"),
      value: metrics.powerFactor,
      unit: "",
      threshold: thresholds.powerFactor,
      icon: <BalanceOutlined />,
    },
    {
      label: t("powerStats.metrics.frequency"),
      value: metrics.frequency,
      unit: t("units.hertz"),
      threshold: thresholds.frequency,
      icon: <WavesOutlined />,
    },
    {
      label: t("powerStats.metrics.energyConsumption"),
      value: metrics.energyConsumption,
      unit: t("units.kilowattHour"),
      threshold: thresholds.energyConsumption,
      icon: <PowerOutlined />,
    },
    {
      label: t("powerStats.metrics.reactivePower"),
      value: metrics.reactivePower,
      unit: t("units.kiloVoltAmpereReactive"),
      threshold: thresholds.reactivePower,
      icon: <ElectricBoltOutlined />,
    },
    {
      label: t("powerStats.metrics.apparentPower"),
      value: metrics.apparentPower,
      unit: t("units.kiloVoltAmpere"),
      threshold: thresholds.apparentPower,
      icon: <SettingsInputComponentOutlined />,
    },
    {
      label: t("powerStats.metrics.loadImbalance"),
      value: metrics.loadImbalance,
      unit: t("units.percent"),
      threshold: thresholds.loadImbalance,
      icon: <CompareArrowsOutlined />,
    },
  ];

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
            title={t("charts.voltageOverTime")}
            labels={timeLabels}
            data={graphData.voltageHistory.map((v) => (v === null ? 0 : v))}
            label={t("charts.voltage")}
            borderColor="#4caf50"
            backgroundColor="rgba(76, 175, 80, 0.2)"
            yAxisLabel={t("charts.voltageAxisLabel")}
          />
        </div>

        <div style={styles.chartContainer}>
          <ChartCard
            title={t("charts.harmonicDistortionOverTime")}
            labels={timeLabels}
            data={graphData.harmonicDistortionHistory.map((v) => (v === null ? 0 : v))}
            label={t("charts.harmonicDistortion")}
            borderColor="#673ab7"
            backgroundColor="rgba(103, 58, 183, 0.2)"
            yAxisLabel={t("charts.harmonicDistortionAxisLabel")}
          />
        </div>
      </div>
    </Box>
  );
};
