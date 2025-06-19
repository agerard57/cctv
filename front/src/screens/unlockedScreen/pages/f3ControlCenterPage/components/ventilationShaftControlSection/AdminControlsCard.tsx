import { Dispatch, FC, SetStateAction, useState } from "react";
import { Typography, Button, Card, CardContent, Snackbar } from "@mui/material";
import { useProgress } from "@/providers";
import { StatCard } from "../PowerStatsSection";
import { ChargingStation, ElectricalServices } from "@mui/icons-material";
import { ShortcutChip, ProgressDialog } from "../../../../components";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

const getProgressMessages = (t: TFunction) => [
  t("ventilationShaftControl.progressMessages.initPower"),
  t("ventilationShaftControl.progressMessages.bypassSafety"),
  t("ventilationShaftControl.progressMessages.prepareIsolation"),
  t("ventilationShaftControl.progressMessages.redirectPower"),
  t("ventilationShaftControl.progressMessages.verifyIntegrity"),
  t("ventilationShaftControl.progressMessages.identifyCircuits"),
  t("ventilationShaftControl.progressMessages.reduceVoltage"),
  t("ventilationShaftControl.progressMessages.monitorAmperage"),
  t("ventilationShaftControl.progressMessages.checkResidual"),
  t("ventilationShaftControl.progressMessages.neutralizeSurge"),
  t("ventilationShaftControl.progressMessages.finalSequence"),
];

interface AdminControlsCardProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const AdminControlsCard: FC<AdminControlsCardProps> = ({ dialogOpen, setDialogOpen }) => {
  const [openSnackbarMessage, setOpenSnackbarMessage] = useState(false);
  const { progress, setElectricalOutletDisconnected } = useProgress();
  const { t } = useTranslation("ControlCenterPage");

  const handleProgressDone = () => {
    setDialogOpen(false);
    setOpenSnackbarMessage(true);
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
              {t("ventilationShaftControl.adminControls")}
            </Typography>
            <Typography sx={{ margin: "1vh 0", color: "#ffffffb0", lineHeight: 1.5 }}>
              {t("ventilationShaftControl.manageDescription")}
            </Typography>
          </div>

          <StatCard
            label={t("ventilationShaftControl.outletStatus")}
            value={
              progress.isElectricalOutletDisconnected
                ? t("ventilationShaftControl.statusOff")
                : t("ventilationShaftControl.statusOn")
            }
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
                {t("ventilationShaftControl.adminMessage")}
              </Typography>
            )}
            <Button
              variant="contained"
              fullWidth
              onClick={() => setDialogOpen(true)}
              sx={{
                backgroundColor: "#ff5252",
                "&:hover": { backgroundColor: "#ff0000" },
                marginTop: "auto",
                padding: "10px 0",
              }}
              disabled={progress.isElectricalOutletDisconnected}
            >
              {t("ventilationShaftControl.disconnectButton")}
              {!progress.isElectricalOutletDisconnected && <ShortcutChip shortcut="4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProgressDialog
        open={dialogOpen}
        title={
          <>
            <ElectricalServices />
            {t("ventilationShaftControl.disconnectingTitle")}
          </>
        }
        messages={getProgressMessages(t)}
        onProgressDone={handleProgressDone}
      />

      <Snackbar
        open={openSnackbarMessage}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbarMessage(false)}
        message={t("ventilationShaftControl.successMessage")}
      />
    </>
  );
};
