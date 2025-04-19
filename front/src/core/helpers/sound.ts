/**
 * Plays an audio sound with the specified volume
 * @param soundSrc - The URL or path to the audio file to play
 * @param volume - The volume level (0 to 100) for the sound, defaults to 100
 */
export const playSound: (soundSrc: string, volume?: number) => void = (soundSrc, volume = 100) => {
  const audio = new Audio(soundSrc);
  audio.volume = Math.max(0, Math.min(1, volume / 100));
  audio.play().catch(() => {});
};

// TODO This will be used in the future
