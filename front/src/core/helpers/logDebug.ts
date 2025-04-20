export type LogDebug = (debugMode: boolean, context: string, message: string) => void;

/**
 * Logs a debug message to the console if debug mode is enabled.
 *
 * @param debugMode - A boolean indicating if debug mode is enabled.
 * @param context - A string representing the context of the log (e.g., "SETTINGS", "PROGRESS").
 * @param message - The message to log.
 */
export const logDebug: LogDebug = (debugMode, context, message) => {
  if (debugMode) {
    console.info(`${context}: ${message}`);
  }
};
