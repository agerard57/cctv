import { FC } from "react";

import styled from "@emotion/styled";
import { Typography, TypographyProps, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

interface SecurityBrandTextProps {
  typographyVariant?: TypographyProps["variant"];
  size?: "small" | "medium";
}

export const SecurityBrandText: FC<SecurityBrandTextProps> = ({
  typographyVariant = "securityBrand",
  size = "medium",
}) => {
  const theme = useTheme();
  const { t } = useTranslation("Core");

  const RegularTypography = styled(Typography)`
    white-space: pre-line;
    text-align: center;
  `;

  const HighlightedTypography = styled(Typography)`
    background: ${theme.app.core.securityBrandAlternativeColor};
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -webkit-text-fill-color: transparent;
  `;

  const parts = t("programBrand").split("//");

  const returnSize = () => {
    if (size === "small") return "1.2vw";
    else if (size === "medium") return "2vw";
  };

  return (
    <RegularTypography variant={typographyVariant} sx={{ fontSize: returnSize() }}>
      {parts.map((part, index) =>
        index % 2 === 0 ? (
          part
        ) : (
          <HighlightedTypography key={index} variant={typographyVariant} sx={{ fontSize: returnSize() }}>
            {part}
          </HighlightedTypography>
        ),
      )}
    </RegularTypography>
  );
};
