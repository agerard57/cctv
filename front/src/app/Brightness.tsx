import { FC } from "react";
import { useSettings } from "@/providers";

interface Props {
  children: React.ReactNode;
}

export const Brightness: FC<Props> = ({ children }) => {
  const { appSettings } = useSettings();

  return (
    <div
      style={{
        filter: `brightness(${appSettings.brightness}%)`,
      }}
    >
      {children}
    </div>
  );
};
