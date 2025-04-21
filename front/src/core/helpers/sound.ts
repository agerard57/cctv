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

// Store audio instances to control playback
const audioInstances: Record<string, HTMLAudioElement> = {};

/**
 * Plays an audio sound in a loop with the specified volume
 * @param id - Unique identifier for this sound
 * @param soundSrc - The URL or path to the audio file to play
 * @param volume - The volume level (0 to 100) for the sound, defaults to 100
 * @returns The audio element for further control
 */
export const playLoopingSound = (id: string, soundSrc: string, volume = 100): HTMLAudioElement => {
  // Stop any existing sound with the same ID
  stopSound(id);

  const audio = new Audio(soundSrc);
  audio.loop = true;
  audio.volume = Math.max(0, Math.min(1, volume / 100));
  audioInstances[id] = audio;

  audio.play().catch(() => {});
  return audio;
};

/**
 * Stops a sound that was started with playLoopingSound
 * @param id - The identifier of the sound to stop
 */
export const stopSound = (id: string): void => {
  if (audioInstances[id]) {
    audioInstances[id].pause();
    audioInstances[id].currentTime = 0;
    delete audioInstances[id];
  }
};

/**
 * Pauses a sound that was started with playLoopingSound
 * @param id - The identifier of the sound to pause
 */
export const pauseSound = (id: string): void => {
  if (audioInstances[id]) {
    audioInstances[id].pause();
  }
};

/**
 * Resumes a paused sound that was started with playLoopingSound
 * @param id - The identifier of the sound to resume
 */
export const resumeSound = (id: string): void => {
  if (audioInstances[id]) {
    audioInstances[id].play().catch(() => {});
  }
};

// TODO SFX For F1, F2, ... too
// TODO Move the SFX hook to core since F1 menus are on multiple pages
// TODO The GStreamer FDK AAC plugin is missing, AAC playback is unlikely to work.
// TODO SFX The Flip Side Pager
// TODO Make a list of all sfx and maybe change them all
// TODO Normalize sound
