import { FC } from "react";
import { Typography } from "@mui/material";
import { KeyButton } from "@/core";
import { LoginMethods } from "../typings";
import { F1KeyIcon, F2KeyIcon } from "../assets";
import { useTranslation } from "react-i18next";

const functionButtons = {
  [LoginMethods.KEYPAD]: {
    label: LoginMethods.KEYPAD,
    icon: F1KeyIcon,
  },
  [LoginMethods.CARD_READER]: {
    label: LoginMethods.CARD_READER,
    icon: F2KeyIcon,
  },
};

interface Props {
  selectedMethod: LoginMethods;
}

export const LoginMethodSelector: FC<Props> = ({ selectedMethod }) => {
  const { t } = useTranslation("LockedScreen");

  return (
    <div style={{ position: "absolute", top: "3vh", right: "3vw" }}>
      <Typography>{t("otherMethods.text")}</Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: "2vh",
          gap: "1vh",
          alignItems: "flex-end",
        }}
      >
        {Object.entries(functionButtons).map(([key, { label, icon }]) => (
          <KeyButton key={key} label={label} icon={icon} isEnabled={selectedMethod === key} />
        ))}
      </div>
    </div>
  );
};
