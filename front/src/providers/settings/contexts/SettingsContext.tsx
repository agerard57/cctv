import { createContext } from "react";
import { SettingsContextType, SettingsContextTypeInitializer } from "../typings";

export const SettingsContext = createContext<SettingsContextType>(SettingsContextTypeInitializer);
