import { FC } from "react";
import styled from "@emotion/styled";
import { LoadingSpinner } from "./LoadingSpinner";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BlackContainerBase } from "../styles";

const LoadingContainer = styled(BlackContainerBase)`
  display: flex;
  flex-direction: column;
  gap: 2vh;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  border-radius: 15px;
`;

export const Loading: FC = () => {
  const { t } = useTranslation("Core");

  return (
    <LoadingContainer>
      <Typography>{t("loading")}</Typography>
      <LoadingSpinner color="white" />
    </LoadingContainer>
  );
};
