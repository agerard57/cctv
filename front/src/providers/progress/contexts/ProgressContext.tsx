import { createContext } from "react";
import { ProgressContextType, ProgressContextTypeInitializer } from "../typings";

export const ProgressContext = createContext<ProgressContextType>(ProgressContextTypeInitializer);
