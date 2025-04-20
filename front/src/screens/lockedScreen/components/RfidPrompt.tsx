import { FC } from "react";
import { Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../../../core";

interface Props {
  loading: boolean;
}

export const RfidPrompt: FC<Props> = ({ loading }) => {
  const { t } = useTranslation("LockedScreen");

  if (loading) return <LoadingSpinner color="white" />;

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
