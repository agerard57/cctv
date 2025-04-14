import { FC } from "react";
import { Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

export const UserInfoDisplay: FC = () => {
  const { t } = useTranslation("Core");

  return (
    <div>
      <Typography variant="userName">{t("user.userName")}</Typography>
      <Typography>{t("user.email")}</Typography>
    </div>
  );
};
