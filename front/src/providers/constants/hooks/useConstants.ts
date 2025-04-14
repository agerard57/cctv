import { useContext } from "react";
import { ConstantsContext } from "../contexts";

export const useConstants = () => useContext(ConstantsContext);
