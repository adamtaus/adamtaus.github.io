/* Piškvorky: Vzdušný souboj — syntetizované zvukové efekty (Web Audio API, bez souborů) */

const SoundFX = (() => {
  let ctx = null;
  let enabled = true;

  function getContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function setEnabled(value) {
    enabled = value;
  }

  function tone({ freq = 440, duration = 0.15, type = "sine", startGain = 0.18, delay = 0, glideTo = null }) {
    if (!enabled) return;
    const audio = getContext();
    if (!audio) return;

    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audio.currentTime + delay);
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(glideTo, audio.currentTime + delay + duration);
    }

    gain.gain.setValueAtTime(startGain, audio.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + delay + duration);

    osc.connect(gain).connect(audio.destination);
    osc.start(audio.currentTime + delay);
    osc.stop(audio.currentTime + delay + duration + 0.02);
  }

  function moveX() {
    // krátký "engine" swoop pro stíhačku
    tone({ freq: 320, glideTo: 520, duration: 0.16, type: "sawtooth", startGain: 0.12 });
  }

  function moveO() {
    // měkčí "radar ping" pro druhého hráče
    tone({ freq: 660, glideTo: 440, duration: 0.18, type: "sine", startGain: 0.14 });
  }

  function win() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      tone({ freq: f, duration: 0.22, type: "triangle", startGain: 0.16, delay: i * 0.09 });
    });
  }

  function draw() {
    tone({ freq: 260, duration: 0.3, type: "square", startGain: 0.1 });
    tone({ freq: 220, duration: 0.35, type: "square", startGain: 0.08, delay: 0.12 });
  }

  function uiClick() {
    tone({ freq: 880, duration: 0.06, type: "sine", startGain: 0.08 });
  }

  function vibrate(pattern) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) { /* ignorováno */ }
    }
  }

  return { setEnabled, moveX, moveO, win, draw, uiClick, vibrate };
})();
