import { FC, ReactNode, useEffect, useState } from "react";
import { useConstants } from "../providers";

interface Props {
  children: ReactNode;
}

export const BackendCheck: FC<Props> = ({ children }) => {
  const [isBackendUp, setIsBackendUp] = useState(true);
  const { DEBUG_MODE } = useConstants();

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch("/api/health");
        setIsBackendUp(response.ok);
      } catch {
        setIsBackendUp(false);
      }
    };

    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isBackendUp && !DEBUG_MODE) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%", fontSize: "1.5rem", color: "red" }}>
        The backend is currently unavailable. Please try again later.
      </div>
    );
  }

  return <>{children}</>;
};
