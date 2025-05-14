import { KeyState, SupportedKeys } from "../typings";

export const enableIconlessKeys = (keys: SupportedKeys[]): Partial<Record<SupportedKeys, KeyState>> => {
  return keys.reduce(
    (acc, key) => {
      acc[key] = { enabled: true };
      return acc;
    },
    {} as Partial<Record<SupportedKeys, KeyState>>,
  );
};

export const allDigits = [
  SupportedKeys.DIGIT_0,
  SupportedKeys.DIGIT_1,
  SupportedKeys.DIGIT_2,
  SupportedKeys.DIGIT_3,
  SupportedKeys.DIGIT_4,
  SupportedKeys.DIGIT_5,
  SupportedKeys.DIGIT_6,
  SupportedKeys.DIGIT_7,
  SupportedKeys.DIGIT_8,
  SupportedKeys.DIGIT_9,
];
