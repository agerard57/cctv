import { useContext } from "react";
import { ProgressContext } from "../contexts";

export const useProgress = () => useContext(ProgressContext);
