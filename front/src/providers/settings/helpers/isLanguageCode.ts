import { Languages } from "../typings";

type IsLanguageCode = (code: string) => boolean;

/**
 * Checks if a given code is a valid language code (EN or FR).
 *
 * @param code - The language code to check.
 * @returns A boolean indicating if the code is either "EN" or "FR".
 */
export const isLanguageCode: IsLanguageCode = (code) => {
  return Object.values(Languages).includes(code as Languages);
};
