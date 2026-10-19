/* ==========================================================================
   IMPOSTOR - Procedural Web Audio API Sound Engine
   Works 100% offline without external assets
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('impostor_sound_enabled') !== 'false';
    this.holdOscillator = null;
    this.holdGain = null;
    this.holdFilter = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('impostor_sound_enabled', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.initContext();
      this.playTap();
    }
    return this.enabled;
  }

  isSoundEnabled() {
    return this.enabled;
  }

  vibrate(pattern = 30) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignored if device doesn't allow
      }
    }
  }

  /* 1. Subtle UI Button Tap */
  playTap() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
    this.vibrate(15);
  }

  /* 2. Tension Drone during Hold-to-Reveal */
  startHoldTension() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    this.stopHoldTension();

    const now = this.ctx.currentTime;
    this.holdOscillator = this.ctx.createOscillator();
    this.holdFilter = this.ctx.createBiquadFilter();
    this.holdGain = this.ctx.createGain();

    this.holdOscillator.type = 'sawtooth';
    this.holdOscillator.frequency.setValueAtTime(75, now);
    this.holdOscillator.frequency.linearRampToValueAtTime(140, now + 2.5);

    this.holdFilter.type = 'lowpass';
    this.holdFilter.frequency.setValueAtTime(180, now);
    this.holdFilter.frequency.linearRampToValueAtTime(450, now + 2.5);

    this.holdGain.gain.setValueAtTime(0.01, now);
    this.holdGain.gain.linearRampToValueAtTime(0.18, now + 0.5);

    this.holdOscillator.connect(this.holdFilter);
    this.holdFilter.connect(this.holdGain);
    this.holdGain.connect(this.ctx.destination);

    this.holdOscillator.start(now);
    this.vibrate([20, 80, 20]);
  }

  stopHoldTension() {
    if (this.holdGain && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.holdGain.gain.linearRampToValueAtTime(0.001, now + 0.1);
        if (this.holdOscillator) {
          this.holdOscillator.stop(now + 0.1);
        }
      } catch (e) {}
    }
    this.holdOscillator = null;
    this.holdGain = null;
    this.holdFilter = null;
  }

  /* 3. Mystical Reveal Sound */
  playReveal() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [329.63, 440, 554.37, 659.25]; // E4, A4, C#5, E5
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });

    this.vibrate([40, 40, 60]);
  }

  /* 4. Turn Rotation Whoosh */
  playTurn() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
    this.vibrate(20);
  }

  /* 5. Debate Clock Tick */
  playTick(isUrgent = false) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = isUrgent ? 'sawtooth' : 'sine';
    const freq = isUrgent ? 880 : 520;
    osc.frequency.setValueAtTime(freq, now);

    const volume = isUrgent ? 0.3 : 0.12;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isUrgent ? 0.1 : 0.05));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
    if (isUrgent) {
      this.vibrate(30);
    }
  }

  /* 6. Dramatic Suspense Gong / Sting */
  playGong() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(90, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 1.2);

    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.2);

    // Ominous bell harmonic
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'triangle';
    bellOsc.frequency.setValueAtTime(220, now);
    bellGain.gain.setValueAtTime(0.25, now);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    bellOsc.connect(bellGain);
    bellGain.connect(this.ctx.destination);
    bellOsc.start(now);
    bellOsc.stop(now + 1.5);

    this.vibrate([80, 50, 150]);
  }

  /* 7. Victory Fanfare */
  playVictory() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [
      { f: 392, d: 0.15 },  // G4
      { f: 523.25, d: 0.15 },// C5
      { f: 659.25, d: 0.18 },// E5
      { f: 783.99, d: 0.45 } // G5
    ];

    let start = this.ctx.currentTime;
    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);

      gain.gain.setValueAtTime(0.28, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + n.d);
      start += n.d * 0.85;
    });

    this.vibrate([60, 40, 60, 40, 150]);
  }

  /* 8. Defeat / Impostor Got Away */
  playDefeat() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [
      { f: 440, d: 0.25 }, // A4
      { f: 415.3, d: 0.25 },// Ab4
      { f: 392, d: 0.3 },   // G4
      { f: 349.23, d: 0.6 } // F4
    ];

    let start = this.ctx.currentTime;
    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, start);

      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + n.d);
      start += n.d * 0.9;
    });

    this.vibrate([100, 60, 200]);
  }
}

export const sound = new SoundEngine();
