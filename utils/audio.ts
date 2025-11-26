let audioCtx: AudioContext | null = null;

export const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  return audioCtx!;
};

export const initAudio = (): void => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch((err) => console.error('Audio resume failed:', err));
    }
  } catch (e) {
    console.error('Audio initialization failed', e);
  }
};

const createOscillator = (
  ctx: AudioContext,
  type: OscillatorType,
  freqStart: number,
  freqEnd: number,
  duration: number,
  volStart: number,
  volEnd: number,
  delay: number = 0
) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  const startTime = ctx.currentTime + delay;
  const endTime = startTime + duration;

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, startTime);
  if (freqStart !== freqEnd) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, endTime);
  }

  gain.gain.setValueAtTime(volStart, startTime);
  gain.gain.exponentialRampToValueAtTime(volEnd, endTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(endTime);
};

export const playEatSound = (): void => {
  try {
    const ctx = getAudioContext();
    // High pitched retro "bloop" - fast upward sweep
    // Layer 1: Main tone
    createOscillator(ctx, 'square', 880, 1760, 0.1, 0.05, 0.01, 0); 
    // Layer 2: Harmony/Texture
    createOscillator(ctx, 'triangle', 1100, 2200, 0.1, 0.03, 0.001, 0.02);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playGameOverSound = (): void => {
  try {
    const ctx = getAudioContext();
    // Crash / Explosion effect
    // Layer 1: Low sawtooth drop
    createOscillator(ctx, 'sawtooth', 150, 30, 0.5, 0.2, 0.001, 0);
    // Layer 2: Sub-bass
    createOscillator(ctx, 'square', 60, 20, 0.4, 0.2, 0.001, 0.05);
    // Layer 3: Dissonant high decay
    createOscillator(ctx, 'sawtooth', 400, 100, 0.3, 0.05, 0.001, 0);
  } catch (e) {
    // Ignore audio errors
  }
};
