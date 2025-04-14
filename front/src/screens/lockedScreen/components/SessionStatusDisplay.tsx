import { FC } from "react";
import { Typography, useTheme } from "@mui/material";

import { SessionStatuses } from "../typings";
import { useTranslation } from "react-i18next";

interface Props {
  sessionStatus: SessionStatuses;
}

export const SessionStatusDisplay: FC<Props> = ({ sessionStatus }) => {
  const { t } = useTranslation("LockedScreen");
  const theme = useTheme();

  return (
    <Typography
      variant="sessionStatus"
      style={{
        color: theme.app.lockedScreen.sessionStatus.locked,
        // TODO: This changes depending on stuff. You know.
      }}
    >
      {t(`sessionStatus.${sessionStatus}.title`)}
    </Typography>
  );
};
