import { FC } from "react";
import { Typography, Button, Box, Card, CardContent } from "@mui/material";

const styles = {
  cardButton: {
    marginTop: "12px",
    backgroundColor: "#00000030",
    "&:hover": { backgroundColor: "#00000050" },
  },
};

interface ControlCardProps {
  label: string;
  value: number;
  customDisplay: string;
  threshold: number;
  icon: React.ReactNode;
  buttonLabel: string;
  onButtonClick: () => void;
  keyboardShortcut?: string;
}

export const ControlCard: FC<ControlCardProps> = ({
  label,
  value,
  customDisplay,
  threshold,
  icon,
  buttonLabel,
  onButtonClick,
  keyboardShortcut,
}) => {
  const style = {
    color: value > threshold ? "orange" : "inherit",
  };

  return (
    <Card
      sx={{
        backgroundColor: "#00000017",
        color: "#fff",
        height: "100%",
        boxShadow: "none",
      }}
    >
      <CardContent style={{ padding: "2vh 2vw" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
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
              {customDisplay}
            </Typography>
          </div>
        </div>
        <Button variant="contained" fullWidth onClick={onButtonClick} sx={styles.cardButton}>
          {buttonLabel}
          {keyboardShortcut && (
            <span
              style={{
                marginLeft: "10px",
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.8em",
              }}
            >
              {keyboardShortcut}
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
