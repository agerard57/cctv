import { FC, ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export const BackendCheck: FC<Props> = ({ children }) => {
  const [isBackendUp, setIsBackendUp] = useState(true);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch("/api/health"); // Replace with your backend health endpoint
        setIsBackendUp(response.ok);
      } catch {
        setIsBackendUp(false);
      }
    };

    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!isBackendUp) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%", fontSize: "1.5rem", color: "red" }}>
        The backend is currently unavailable. Please try again later.
      </div>
    );
  }

  return <>{children}</>;
};
