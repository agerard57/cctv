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

interface PowerStatsProps {
  metrics: {
    voltage: number;
    currentLoad: number;
    temperature: number;
    powerEfficiency: number;
    batteryHealth: number;
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
}> = ({ title, labels, data, label, borderColor, backgroundColor, yAxisLabel, chartType = "line" }) => (
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
                  text: "Time (seconds)",
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
                  text: "Metrics",
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

export const PowerStatsSection: FC<PowerStatsProps> = ({ metrics, graphData }) => {
  // Remove local state and random updates since they're now handled by parent
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

  const timeLabels = Array.from({ length: 30 }, (_, i) => (30 - i).toString()).concat("Now");

  const statsArray = [
    { label: "Voltage", value: metrics.voltage, unit: "V", threshold: thresholds.voltage, icon: <BoltOutlined /> },
    {
      label: "Current Load",
      value: metrics.currentLoad,
      unit: "%",
      threshold: thresholds.currentLoad,
      icon: <SpeedOutlined />,
    },
    {
      label: "Temperature",
      value: metrics.temperature,
      unit: "°C",
      threshold: thresholds.temperature,
      icon: <ThermostatOutlined />,
    },
    {
      label: "Power Factor",
      value: metrics.powerFactor,
      unit: "",
      threshold: thresholds.powerFactor,
      icon: <BalanceOutlined />,
    },
    {
      label: "Frequency",
      value: metrics.frequency,
      unit: "Hz",
      threshold: thresholds.frequency,
      icon: <WavesOutlined />,
    },
    {
      label: "Energy Consumption",
      value: metrics.energyConsumption,
      unit: "kWh",
      threshold: thresholds.energyConsumption,
      icon: <PowerOutlined />,
    },
    {
      label: "Reactive Power",
      value: metrics.reactivePower,
      unit: "kVAR",
      threshold: thresholds.reactivePower,
      icon: <ElectricBoltOutlined />,
    },
    {
      label: "Apparent Power",
      value: metrics.apparentPower,
      unit: "kVA",
      threshold: thresholds.apparentPower,
      icon: <SettingsInputComponentOutlined />,
    },
    {
      label: "Load Imbalance",
      value: metrics.loadImbalance,
      unit: "%",
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

      {/* TODO Graph doesnt work anymore... */}
      <div style={styles.chartsRow}>
        <div style={styles.chartContainer}>
          <ChartCard
            title="Voltage Over Time"
            labels={timeLabels}
            /* TODO Test this GPT ass answer */
            data={graphData.voltageHistory.filter((value): value is number => value !== null)}
            label="Voltage"
            borderColor="#4caf50"
            backgroundColor="rgba(76, 175, 80, 0.2)"
            yAxisLabel="Voltage (V)"
          />
        </div>

        <div style={styles.chartContainer}>
          <ChartCard
            title="Harmonic Distortion Over Time"
            labels={timeLabels}
            /* TODO Test this GPT ass answer */
            data={graphData.harmonicDistortionHistory.filter((value): value is number => value !== null)}
            label="Harmonic Distortion"
            borderColor="#673ab7"
            backgroundColor="rgba(103, 58, 183, 0.2)"
            yAxisLabel="Harmonic Distortion (%)"
          />
        </div>
      </div>
    </Box>
  );
};
