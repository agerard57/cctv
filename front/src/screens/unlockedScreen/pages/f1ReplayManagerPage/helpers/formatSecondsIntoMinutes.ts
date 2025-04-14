type FormatSecondsIntoMinutes = (seconds: number) => string;

/**
 * Converts a given duration in seconds into a formatted string of "MM:SS".
 *
 * @param seconds - The duration in seconds.
 * @returns A string representing the duration in the "MM:SS" format.
 */
export const formatSecondsIntoMinutes: FormatSecondsIntoMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  // Format the minutes and seconds with leading zeros if needed
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};
