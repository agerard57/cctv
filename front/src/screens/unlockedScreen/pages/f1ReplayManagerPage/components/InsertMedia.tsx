import styled from "@emotion/styled";
import { UsbMissingIcon, UsbValidIcon, UsbInvalidIcon } from "../assets";
import { Typography, LinearProgress } from "@mui/material";
import { LoadingSpinnerSvg, BlackContainerBase } from "@/core";
import { useInsertMedia } from "../hooks/useInsertMedia";
import { useConstants } from "@/providers/constants";
import { UsbStatuses } from "../typings";
import { DebugInsertMedia } from "./DebugInsertMedia";
import { Dispatch, FC, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

const InsertMediaContainer = styled(BlackContainerBase)`
  padding: 10vh 10vw;
  width: 50vw;
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-self: center;
  align-items: center;
  justify-items: center;
  align-content: center;
  border-radius: 10px;
`;

const ShakeAnimation = styled.img<{ shouldShake: boolean }>`
  height: 7vh;
  object-fit: contain;
  filter: invert(1);
  animation: ${(props) => (props.shouldShake ? "shake 0.5s ease-in-out 0s 1" : "none")};

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    75% {
      transform: translateX(5px);
    }
  }
`;

export const InsertMedia: FC<{
  currentUsbStatus: UsbStatuses;
  setCurrentUsbStatus: Dispatch<SetStateAction<UsbStatuses>>;
}> = ({ currentUsbStatus, setCurrentUsbStatus }) => {
  const { t } = useTranslation("ReplayManagerPage");
  const appConstants = useConstants();

  const { debugDevice, setDebugDevice, loading, shouldShake, progressBarValue, loadingDots } =
    useInsertMedia(setCurrentUsbStatus);

  const showProgressBar = !loading && currentUsbStatus === UsbStatuses.VALID;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
      <InsertMediaContainer>
        <ShakeAnimation
          src={
            loading
              ? LoadingSpinnerSvg
              : currentUsbStatus === UsbStatuses.VALID
                ? UsbValidIcon
                : currentUsbStatus === UsbStatuses.INVALID
                  ? UsbInvalidIcon
                  : UsbMissingIcon
          }
          shouldShake={!loading && shouldShake}
        />
        <Typography variant="sessionStatus">
          {loading
            ? `${t("insertMedia.loading.title")}${loadingDots}`
            : currentUsbStatus === UsbStatuses.VALID
              ? t("insertMedia.valid.title")
              : currentUsbStatus === UsbStatuses.INVALID
                ? t("insertMedia.invalid.title")
                : t("insertMedia.missing.title")}
        </Typography>
        {showProgressBar && <LinearProgress variant="determinate" value={progressBarValue} style={{ width: "100%" }} />}
        <Typography>
          {loading
            ? `${t("insertMedia.loading.message")}${loadingDots}`
            : currentUsbStatus === UsbStatuses.VALID
              ? `${t("insertMedia.valid.message")}${loadingDots}`
              : currentUsbStatus === UsbStatuses.INVALID
                ? t("insertMedia.invalid.message")
                : t("insertMedia.missing.message")}
        </Typography>
      </InsertMediaContainer>
      {appConstants.DEBUG_MODE && <DebugInsertMedia debugDevice={debugDevice} setDebugDevice={setDebugDevice} />}
    </div>
  );
};
