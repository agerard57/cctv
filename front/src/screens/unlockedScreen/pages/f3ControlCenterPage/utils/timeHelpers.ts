import { TFunction } from "i18next";

/**
 * Generates time labels for charts with proper translations
 * @param count Number of time labels to generate
 * @param t Translation function
 * @returns Array of time labels with the last one being "Now"
 */
export const generateTimeLabels = (count: number, t: TFunction): string[] => {
  const labels = Array.from({ length: count }, (_, i) => t("time.ago", { time: count - i }));

  return labels.concat(t("time.now"));
};
