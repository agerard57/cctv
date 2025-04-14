/**
 * Checks if the given key is a single digit (0-9).
 *
 * @param key - The key string to check.
 * @returns `true` if the key is a digit, otherwise `false`.
 *
 * @example
 * isDigitKey("5"); // true
 * isDigitKey("a"); // false
 * isDigitKey("10"); // false
 */
export const isDigitKey = (key: string): boolean => /^\d$/.test(key);
