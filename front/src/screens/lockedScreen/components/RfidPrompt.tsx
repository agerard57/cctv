import { FC } from "react";
import { Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

export const RfidPrompt: FC = () => {
  const { t } = useTranslation("LockedScreen");

  return (
    <Typography
      variant="description"
      style={{
        whiteSpace: "pre-line",
      }}
    >
      {t("methods.f2.action")}
    </Typography>
  );
};
