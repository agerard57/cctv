import { FC, useEffect, useState } from "react";
import { CategoryLayout } from "@/screens/unlockedScreen/components/CategoryLayout";
import { PowerStatsSection } from "./PowerStatsSection";
import { SystemHealthSection } from "./SystemHealthSection";
import { VentilationShaftControlSection } from "./ventilationShaftControlSection";
import { ControlCenterPageSections } from "../..";

interface GraphData {
  voltageHistory: (number | null)[];
  harmonicDistortionHistory: (number | null)[];
  fanSpeedHistory: (number | null)[];
  systemEfficiencyHistory: (number | null)[];
}

export interface AllMetrics {
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

  fanSpeed: number;
  systemHealth: number;
  systemEfficiency: number;
  coolingLoad: number;
  systemStability: number;

  ventilationCurrentLoad: number;
  airQuality: number;
  humidity: number;
  co2Level: number;
}

export const ControlCenterPage: FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    voltageHistory: Array(31)
      .fill(240)
      .map((val) => val + (Math.random() - 0.5) * 0.1),
    harmonicDistortionHistory: Array(31)
      .fill(5)
      .map((val) => val + (Math.random() - 0.5) * 0.5),
    fanSpeedHistory: Array(31)
      .fill(1200)
      .map((val) => val + (Math.random() - 0.5) * 20),
    systemEfficiencyHistory: Array(31)
      .fill(80)
      .map((val) => val + (Math.random() - 0.5) * 1),
  });

  const [metrics, setMetrics] = useState<AllMetrics>({
    voltage: 240,
    currentLoad: 75,
    temperature: 35,
    powerEfficiency: 85,
    batteryHealth: 95,
    powerFactor: 0.95,
    frequency: 50,
    energyConsumption: 1500,
    reactivePower: 100,
    apparentPower: 120,
    loadImbalance: 5,

    fanSpeed: 1200,
    systemHealth: 90,
    systemEfficiency: 80,
    coolingLoad: 75,
    systemStability: 95,

    airQuality: 85,
    humidity: 45,
    co2Level: 400,
    ventilationCurrentLoad: 75,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setGraphData((prev) => {
        const latestHarmonic = prev.harmonicDistortionHistory[prev.harmonicDistortionHistory.length - 1] || 5;
        const newHarmonic = Math.max(3, Math.min(10, latestHarmonic + (Math.random() - 0.5) * 0.5));

        const voltageWithVariation = metrics.voltage + (Math.random() - 0.5) * 0.1;
        const fanSpeedWithVariation = metrics.fanSpeed + (Math.random() - 0.5) * 20;
        const systemEfficiencyWithVariation = metrics.systemEfficiency + (Math.random() - 0.5) * 1;

        return {
          voltageHistory: [...prev.voltageHistory.slice(1), voltageWithVariation],
          harmonicDistortionHistory: [...prev.harmonicDistortionHistory.slice(1), newHarmonic],
          fanSpeedHistory: [...prev.fanSpeedHistory.slice(1), fanSpeedWithVariation],
          systemEfficiencyHistory: [...prev.systemEfficiencyHistory.slice(1), systemEfficiencyWithVariation],
        };
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getRandomInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    const updatePowerMetricsGroup1 = () => {
      setMetrics((prev) => ({
        ...prev,
        voltage: Math.max(240, Math.min(241, prev.voltage + (Math.random() - 0.5) * 0.1)),
        currentLoad: Math.max(0, Math.min(100, prev.currentLoad + (Math.random() - 0.5) * 2)),
        temperature: Math.max(20, Math.min(50, prev.temperature + (Math.random() - 0.5) * 1)),
      }));

      const nextInterval = getRandomInterval(800, 1500);
      timeoutRef.current = setTimeout(updatePowerMetricsGroup1, nextInterval);
    };

    const timeoutRef = { current: setTimeout(updatePowerMetricsGroup1, getRandomInterval(800, 1500)) };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const updatePowerMetricsGroup2 = () => {
      setMetrics((prev) => ({
        ...prev,
        powerEfficiency: Math.max(50, Math.min(100, prev.powerEfficiency + (Math.random() - 0.5) * 1)),
        batteryHealth: Math.max(80, Math.min(100, prev.batteryHealth + (Math.random() - 0.5) * 0.5)),
        powerFactor: Math.max(0.8, Math.min(1, prev.powerFactor + (Math.random() - 0.5) * 0.01)),
      }));

      const nextInterval = getRandomInterval(900, 1700);
      timeoutRef.current = setTimeout(updatePowerMetricsGroup2, nextInterval);
    };

    const timeoutRef = { current: setTimeout(updatePowerMetricsGroup2, getRandomInterval(900, 1700)) };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const updatePowerMetricsGroup3 = () => {
      setMetrics((prev) => ({
        ...prev,
        frequency: Math.max(45, Math.min(55, prev.frequency + (Math.random() - 0.5) * 0.2)),
        energyConsumption: Math.max(1000, Math.min(2000, prev.energyConsumption + (Math.random() - 0.5) * 10)),
        reactivePower: Math.max(80, Math.min(120, prev.reactivePower + (Math.random() - 0.5) * 2)),
        apparentPower: Math.max(100, Math.min(140, prev.apparentPower + (Math.random() - 0.5) * 2)),
        loadImbalance: Math.max(3, Math.min(8, prev.loadImbalance + (Math.random() - 0.5) * 0.3)),
      }));

      const nextInterval = getRandomInterval(700, 1600);
      timeoutRef.current = setTimeout(updatePowerMetricsGroup3, nextInterval);
    };

    const timeoutRef = { current: setTimeout(updatePowerMetricsGroup3, getRandomInterval(700, 1600)) };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const updateSystemHealthGroup1 = () => {
      setMetrics((prev) => ({
        ...prev,
        fanSpeed: Math.max(1000, Math.min(2000, prev.fanSpeed + (Math.random() - 0.5) * 20)),
        systemHealth: Math.max(50, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2)),
      }));

      const nextInterval = getRandomInterval(850, 1550);
      timeoutRef.current = setTimeout(updateSystemHealthGroup1, nextInterval);
    };

    const timeoutRef = { current: setTimeout(updateSystemHealthGroup1, getRandomInterval(850, 1550)) };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const updateSystemHealthGroup2 = () => {
      setMetrics((prev) => ({
        ...prev,
        systemEfficiency: Math.max(70, Math.min(95, prev.systemEfficiency + (Math.random() - 0.5) * 1)),
        coolingLoad: Math.max(50, Math.min(90, prev.coolingLoad + (Math.random() - 0.5) * 1)),
        systemStability: Math.max(80, Math.min(100, prev.systemStability + (Math.random() - 0.5) * 0.7)),
      }));

      const nextInterval = getRandomInterval(750, 1650);
      timeoutRef.current = setTimeout(updateSystemHealthGroup2, nextInterval);
    };

    const timeoutRef = { current: setTimeout(updateSystemHealthGroup2, getRandomInterval(750, 1650)) };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const updateVentilationMetrics = () => {
      setMetrics((prev) => ({
        ...prev,
        ventilationCurrentLoad: Math.max(50, Math.min(100, prev.ventilationCurrentLoad + (Math.random() - 0.5) * 2)),
        airQuality: Math.max(70, Math.min(99, prev.airQuality + (Math.random() - 0.5) * 1)),
        humidity: Math.max(30, Math.min(60, prev.humidity + (Math.random() - 0.5) * 1)),
        co2Level: Math.max(300, Math.min(1000, prev.co2Level + (Math.random() - 0.5) * 10)),
      }));

      const nextInterval = getRandomInterval(800, 1500);
      timeoutRef.current = setTimeout(updateVentilationMetrics, nextInterval);
    };

    const timeoutRef = { current: setTimeout(updateVentilationMetrics, getRandomInterval(800, 1500)) };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const categories = [
    {
      categoryName: ControlCenterPageSections.POWER_STATS,
      content: <PowerStatsSection metrics={metrics} graphData={graphData} />,
    },
    {
      categoryName: ControlCenterPageSections.SYSTEM_HEALTH,
      content: <SystemHealthSection metrics={metrics} graphData={graphData} />,
    },
    {
      categoryName: ControlCenterPageSections.VENTILATION_SHAFT_CONTROL,
      content: (
        <VentilationShaftControlSection
          metrics={metrics}
          setMetrics={(updatedVentilationMetrics) =>
            setMetrics((prev) => ({
              ...prev,
              ...updatedVentilationMetrics,
            }))
          }
        />
      ),
    },
  ];

  return <CategoryLayout<ControlCenterPageSections> categories={categories} namespace="ControlCenterPage" />;
};
