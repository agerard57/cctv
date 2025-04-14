import { Dispatch, FC, useState } from "react";
import { Typography, Button, Card, CardContent, Snackbar } from "@mui/material";
import { AdminAuthenticationDialog } from "./AdminAuthenticationDialog";
import { useProgress } from "@/providers";
import { StatCard } from "../PowerStatsSection";
import { ChargingStation, ElectricalServices } from "@mui/icons-material";
import { ShortcutChip, ProgressDialog } from "../../../../components";

const messages = [
  "Initializing power management protocols...",
  "Bypassing safety interlocks...",
  "Preparing circuit isolation sequence...",
  "Redirecting power from main grid...",
  "Verifying ventilation shaft integrity...",
  "Identifying electrical circuit pathways...",
  "Applying gradual voltage reduction...",
  "Monitoring amperage fluctuations...",
  "Checking for residual current...",
  "Neutralizing power surge risk...",
  "Engaging final disconnection sequence...",
];

interface AdminControlsCardProps {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const AdminControlsCard: FC<AdminControlsCardProps> = ({ isDialogOpen, setIsDialogOpen }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const { progress, setElectricalOutletDisconnected } = useProgress();

  // Handler for successful authentication - now just shows progress dialog
  const handleAuthSuccess = () => {
    // Show progress dialog immediately after successful authentication
    setShowProgressDialog(true);
  };

  // Handler for when progress completes - now shows success snackbar
  const handleProgressDone = () => {
    console.log("AdminControls: handleProgressDone called"); // Debug log
    setShowProgressDialog(false);
    setShowSuccess(true);
    setElectricalOutletDisconnected(true);
  };

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#00000017",
          color: "#fff",
          height: "100%",
          boxShadow: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "16px",
            justifyContent: "space-between",
            paddingBottom: "16px !important",
            boxSizing: "border-box",
          }}
        >
          <div>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1, fontSize: "1.2rem" }}>
              Admin Controls
            </Typography>
            <Typography sx={{ margin: "1vh 0", color: "#ffffffb0", lineHeight: 1.5 }}>
              Manage the power supply to the electrical outlet in the ventilation shaft.
            </Typography>
          </div>

          <StatCard
            label="Electrical Outlet Status"
            value={progress.isElectricalOutletDisconnected && !showProgressDialog ? "Off" : "On"}
            icon={<ChargingStation />}
            backgroundColor="transparent"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 2,
              backgroundColor: "#00000017",
              borderRadius: 1,
            }}
          >
            {!progress.isElectricalOutletDisconnected && (
              <Typography sx={{ color: "#ff9800", fontSize: "0.9rem", padding: "1vh 0.3vw" }}>
                You must be an admin to make this change
              </Typography>
            )}
            <Button
              variant="contained"
              fullWidth
              onClick={() => setIsDialogOpen(true)}
              sx={{
                backgroundColor: "#ff5252",
                "&:hover": { backgroundColor: "#ff0000" },
                marginTop: "auto",
                padding: "10px 0",
              }}
              disabled={progress.isElectricalOutletDisconnected}
            >
              Disconnect Electrical Outlet
              {!progress.isElectricalOutletDisconnected && <ShortcutChip shortcut="4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AdminAuthenticationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <ProgressDialog
        open={showProgressDialog}
        title={
          <>
            {/* TODO Change icon */}
            <ElectricalServices />
            Disconnecting Electrical Outlet
          </>
        }
        messages={messages}
        onProgressDone={handleProgressDone}
      />

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message="Electrical outlet disconnected successfully"
      />
    </>
  );
};
