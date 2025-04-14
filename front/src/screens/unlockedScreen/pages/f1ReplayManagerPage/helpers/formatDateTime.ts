import { Languages } from "@/providers";
import { DateTime } from "luxon";

type FormatDateTime = (dateTime: DateTime, language: Languages, format: "date" | "time" | "humanDate") => string;

/**
 * Formats a DateTime object based on the desired format and the user's language preference.
 *
 * @param dateTime - The DateTime object to be formatted.
 * @param language - The language to use for formatting.
 * @param format - The format to use for the output, either "date", "time", or "humanDate".
 * @returns The formatted date/time string based on the provided parameters.
 *
 * @example
 * // Example 1: Formatting date
 * const dateTime = DateTime.fromISO('2025-03-13T14:45:00');
 * formatDateTime(dateTime, 'fr', 'date'); // Returns: '13-03-2025'
 * formatDateTime(dateTime, 'en', 'date'); // Returns: '2025-03-13'
 *
 * @example
 * // Example 2: Formatting time
 * const dateTime = DateTime.fromISO('2025-03-13T14:45:00');
 * formatDateTime(dateTime, 'fr', 'time'); // Returns: '14:45'
 * formatDateTime(dateTime, 'en', 'time'); // Returns: '02:45 PM'
 *
 * @example
 * // Example 3: Formatting full date in human-readable form (French)
 * const dateTime = DateTime.fromISO('2025-03-13T14:45:00');
 * formatDateTime(dateTime, 'fr', 'humanDate'); // Returns: '13 mars 2025'
 * formatDateTime(dateTime, 'en', 'humanDate'); // Returns: 'March 13, 2025'
 */
export const formatDateTime: FormatDateTime = (dateTime, language, format) => {
  switch (format) {
    case "date":
      return dateTime.toFormat(language === "fr" ? "dd-MM-yyyy" : "yyyy-MM-dd");
    case "time":
      return dateTime.toFormat(language === "fr" ? "HH:mm" : "hh:mm a");
    case "humanDate":
      return dateTime.setLocale(language).toLocaleString(DateTime.DATE_FULL);
    default:
      throw new Error("Invalid format type");
  }
};
