/**
 * Synthesized sound design — zero audio files.
 * A shared AudioContext (created lazily on first user gesture, per
 * autoplay policy) drives short UI ticks and the line-blast whoosh.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;
let lastTick = 0;

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
  return ctx;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on) ensureContext();
}

export function isSoundEnabled() {
  return enabled;
}

/** Short glassy blip — hover ticks on letters/lines. Pitch varies per call. */
export function tick(pitch = 1) {
  if (!enabled) return;
  const ac = ensureContext();
  if (!ac || !master) return;
  const now = ac.currentTime;
  // Rate-limit so letter sweeps arpeggiate instead of clipping.
  if (now - lastTick < 0.035) return;
  lastTick = now;

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1100 + pitch * 900 + Math.random() * 120, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.11, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
  osc.connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 0.1);
}

/** Soft pluck for the hero lines — lower, rounder than tick. */
export function pluck(intensity = 1) {
  if (!enabled) return;
  const ac = ensureContext();
  if (!ac || !master) return;
  const now = ac.currentTime;
  if (now - lastTick < 0.05) return;
  lastTick = now;

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180 + intensity * 160 + Math.random() * 40, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
  osc.connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 0.3);
}

/** Filtered-noise burst for hold-to-blast. */
export function blast() {
  if (!enabled) return;
  const ac = ensureContext();
  if (!ac || !master) return;
  const now = ac.currentTime;

  const dur = 0.6;
  const buffer = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.2);
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;

  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2600, now);
  filter.frequency.exponentialRampToValueAtTime(140, now + dur);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.32, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  src.connect(filter).connect(gain).connect(master);
  src.start(now);
}
