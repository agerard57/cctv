import { FC, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

// TODO Check if all projects' imports are sorted and using @/
import { ThemeProvider } from "@mui/material";
import { i18n } from "./i18n";
import { ConstantsProvider } from "./constants";
import { KeyStateProvider } from "./keyState";
import { theme } from "./theme";
import { ProgressProvider } from "./progress";
import { SettingsProvider } from "./settings";

interface Props {
  children: ReactNode;
}
export const Providers: FC<Props> = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <ConstantsProvider>
      <ProgressProvider>
        <KeyStateProvider>
          <ThemeProvider theme={theme}>
            <SettingsProvider>{children}</SettingsProvider>
          </ThemeProvider>
        </KeyStateProvider>
      </ProgressProvider>
    </ConstantsProvider>
  </I18nextProvider>
);
