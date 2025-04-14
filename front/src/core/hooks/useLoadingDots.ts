import { useState, useEffect } from "react";

type LoadingDots = "" | "." | ".." | "...";

type UseLoadingDots = (isActive: boolean) => {
  loadingDots: LoadingDots;
};

const INTERVAL = 500;

/**
 * Hook that provides a string of loading dots (`"."`) that cycles
 * between 0 to 3 dots at a specified interval (500ms).
 *
 * @param isActive - A boolean indicating whether the loading dots should be active.
 * @returns An object containing the current string of loading dots.
 */
export const useLoadingDots: UseLoadingDots = (isActive) => {
  const [loadingDots, setLoadingDots] = useState<LoadingDots>("");

  useEffect(() => {
    if (!isActive) {
      setLoadingDots("");
      return;
    }

    const intervalId = setInterval(() => {
      setLoadingDots((prevDots) => {
        if (prevDots.length === 3) {
          return "" as LoadingDots;
        } else {
          return (prevDots + ".") as LoadingDots;
        }
      });
    }, INTERVAL);

    return () => clearInterval(intervalId);
  }, [INTERVAL, isActive]);

  return { loadingDots };
};
