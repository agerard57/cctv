import { createTheme } from "@mui/material";
import { muiTheme } from "./muiTheme";
import { appTheme } from "./appTheme";

export const theme = createTheme(muiTheme, appTheme);
