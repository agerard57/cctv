import { FC } from "react";
import { useSettings } from "@/providers";

interface Props {
  children: React.ReactNode;
}

export const Brightness: FC<Props> = ({ children }) => {
  const { settings } = useSettings();

  return (
    <div
      style={{
        filter: `brightness(${settings.brightness}%)`,
      }}
    >
      {children}
    </div>
  );
};
