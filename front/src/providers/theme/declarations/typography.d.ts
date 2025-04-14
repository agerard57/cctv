import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariantsOptions {
    securityBrand?: CSSProperties;
    userName?: CSSProperties;
    sessionStatus?: CSSProperties;
    description?: CSSProperties;
    fButtons?: CSSProperties;
    metadata?: CSSProperties;
    pageTitle?: CSSProperties;
    tableContent?: CSSProperties;
    chipLabel?: CSSProperties;
    settingsLabel?: CSSProperties;
  }

  interface TypographyVariants {
    securityBrand: CSSProperties;
    userName: CSSProperties;
    sessionStatus: CSSProperties;
    description: CSSProperties;
    fButtons: CSSProperties;
    metadata: CSSProperties;
    pageTitle: CSSProperties;
    tableContent: CSSProperties;
    chipLabel: CSSProperties;
    settingsLabel: CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    securityBrand: true;
    userName: true;
    sessionStatus: true;
    description: true;
    fButtons: true;
    metadata: true;
    pageTitle: true;
    tableContent: true;
    chipLabel: true;
    settingsLabel: true;
    inherit: true;
  }
}
