import { appTheme } from "../appTheme";

declare module "@mui/material" {
  interface Theme {
    app: typeof appTheme.app;
  }

  interface ThemeOptions {
    app?: typeof appTheme.app;
  }
}
