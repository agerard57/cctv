export interface KeyState {
  enabled: boolean;
  icon?: string;
}

export type KeyStates = Record<string, KeyState>;
