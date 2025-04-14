import { FC } from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { Doughnut } from "react-chartjs-2";

interface LoadChartProps {
  currentLoad: number;
}

export const LoadChart: FC<LoadChartProps> = ({ currentLoad }) => {
  const loadData = [currentLoad, 100 - currentLoad];

  return (
    <Card sx={{ backgroundColor: "#00000017", color: "#fff", height: "100%", boxShadow: "none" }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 2, fontSize: "1.2rem" }}>
          Current Load
        </Typography>
        <Doughnut
          data={{
            labels: ["Current Load", "Remaining Capacity"],
            datasets: [
              {
                data: loadData,
                backgroundColor: ["#FF6384", "#36A2EB"],
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: "#ffffffb0",
                  font: { size: 14 },
                },
              },
            },
          }}
          style={{ maxHeight: "200px" }}
        />
      </CardContent>
    </Card>
  );
};
