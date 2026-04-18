const AUDIO_CONTEXT_SUPPORTED =
  typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);

const BELL_SOUND_PATH = "/sounds/bell.mp3";
const BELL_VOLUME = 0.5;

let bellAudio = null;
let bellLoadError = false;
let ambientContext = null;
let ambientNodes = null;

function clampVolume(value) {
  return Math.max(0, Math.min(1, value));
}

function createToneContext() {
  if (!AUDIO_CONTEXT_SUPPORTED) return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!ambientContext) {
    ambientContext = new AudioCtx();
  }
  if (ambientContext.state === "suspended") {
    void ambientContext.resume();
  }
  return ambientContext;
}

function scheduleTone({ type = "sine", startFrequency, endFrequency = startFrequency, duration = 0.16, volume = 0.05 }) {
  const audio = createToneContext();
  if (!audio) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(startFrequency, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(0.001, endFrequency), now + duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(clampVolume(volume), now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function createBellAudio() {
  if (typeof Audio === "undefined" || bellLoadError) return null;

  if (!bellAudio) {
    bellAudio = new Audio(BELL_SOUND_PATH);
    bellAudio.preload = "auto";
    bellAudio.loop = false;
    bellAudio.volume = BELL_VOLUME;
    bellAudio.addEventListener("error", () => {
      bellLoadError = true;
      bellAudio = null;
    });
  }

  bellAudio.loop = false;
  bellAudio.volume = BELL_VOLUME;
  return bellAudio;
}

export function playBell() {
  const audio = createBellAudio();
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
  audio.loop = false;

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      /* ignore autoplay and asset errors */
    });
  }
}

export function playStart() {
  scheduleTone({ type: "triangle", startFrequency: 420, endFrequency: 640, duration: 0.14, volume: 0.032 });
  scheduleTone({ type: "sine", startFrequency: 640, endFrequency: 720, duration: 0.12, volume: 0.018 });
}

export function playReset() {
  scheduleTone({ type: "square", startFrequency: 520, endFrequency: 180, duration: 0.11, volume: 0.02 });
}

export function startAmbient() {
  const audio = createToneContext();
  if (!audio || ambientNodes) return;

  const now = audio.currentTime;
  const master = audio.createGain();
  const filter = audio.createBiquadFilter();
  const lfo = audio.createOscillator();
  const lfoGain = audio.createGain();
  const droneA = audio.createOscillator();
  const droneB = audio.createOscillator();

  master.gain.value = 0.012;
  master.connect(audio.destination);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(520, now);
  filter.Q.value = 0.2;
  filter.connect(master);

  droneA.type = "sine";
  droneA.frequency.value = 174;
  droneB.type = "triangle";
  droneB.frequency.value = 261.63;

  droneA.connect(filter);
  droneB.connect(filter);

  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 120;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  master.gain.setValueAtTime(0.0001, now);
  master.gain.linearRampToValueAtTime(0.012, now + 0.8);

  droneA.start(now);
  droneB.start(now);
  lfo.start(now);

  ambientNodes = { master, filter, lfo, lfoGain, droneA, droneB };
}

export function stopAmbient() {
  if (!ambientNodes || !ambientContext) return;

  const now = ambientContext.currentTime;
  ambientNodes.master.gain.cancelScheduledValues(now);
  ambientNodes.master.gain.setValueAtTime(ambientNodes.master.gain.value, now);
  ambientNodes.master.gain.linearRampToValueAtTime(0.0001, now + 0.25);

  const { droneA, droneB, lfo } = ambientNodes;
  droneA.stop(now + 0.28);
  droneB.stop(now + 0.28);
  lfo.stop(now + 0.28);
  ambientNodes = null;
}

export function disposeSounds() {
  stopAmbient();
  if (!ambientContext) return;

  window.setTimeout(() => {
    void ambientContext?.close();
    ambientContext = null;
  }, 320);
}
