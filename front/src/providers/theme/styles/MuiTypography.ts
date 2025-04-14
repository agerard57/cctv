import { colorPalette } from "../colorPalette";

export const MuiTypography = {
  styleOverrides: {
    root: {
      fontFamily: "Overpass",
      fontSize: "1.2vw",
      fontWeightLight: 400,
      lineHeight: 1,
      color: colorPalette.white,
    },
    securityBrand: {
      fontFamily: "Oxygen Mono",
      fontWeight: 600,
      fontStyle: "normal",
      letterSpacing: "1px",
    },
    userName: {
      fontSize: "3vw",
    },
    sessionStatus: {
      fontSize: "2.2vw",
    },
    description: {
      fontSize: "1.7vw",
      fontWeight: 300,
      lineHeight: 1.2,
    },
    fButtons: {
      fontFamily: "Barlow",
      fontWeight: 600,
    },
    metadata: {
      fontFamily: "Oxygen Mono",
      fontStyle: "normal",
      fontSize: "1.3vw",
      lineHeight: 1.5,
      letterSpacing: "1px",
    },
    pageTitle: {
      fontSize: "1.4vw",
      fontWeight: 300,
    },
    tableContent: {
      fontSize: "0.9vw",
    },
    chipLabel: {
      fontSize: "0.7vw",
    },
    settingsLabel: {
      fontSize: "1.1vw",
      fontWeight: 300,
      lineHeight: 1.5,
    },
  },
};
