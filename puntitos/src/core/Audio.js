// Motor de audio procedural usando Web Audio API (cero dependencias externas y latencia cero)
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.pentatonic = [
      261.63, 293.66, 329.63, 392.00, 440.00, // C4, D4, E4, G4, A4
      523.25, 587.33, 659.25, 783.99, 880.00, // C5, D5, E5, G5, A5
      1046.50, 1174.66, 1318.51, 1567.98, 1760.00 // C6...
    ];
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
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
    return this.enabled;
  }

  // Sonido al conectar un punto: escala musical que asciende conforme avanzas
  playDotConnect(index = 0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const noteFreq = this.pentatonic[index % this.pentatonic.length] * (1 + Math.floor(index / this.pentatonic.length) * 0.2);
    const now = this.ctx.currentTime;

    // Oscilador principal (triángulo para sonido de marimba cálido)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteFreq, now);

    // Envolvente de volumen (ataque instantáneo y caída percusiva suave)
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    // Armónico suave para dar brillo de campana
    const oscHarmonic = this.ctx.createOscillator();
    const gainHarmonic = this.ctx.createGain();
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(noteFreq * 2, now);
    gainHarmonic.gain.setValueAtTime(0.001, now);
    gainHarmonic.gain.linearRampToValueAtTime(0.12, now + 0.01);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    oscHarmonic.connect(gainHarmonic);
    gainHarmonic.connect(this.ctx.destination);

    osc.start(now);
    oscHarmonic.start(now);
    osc.stop(now + 0.36);
    oscHarmonic.stop(now + 0.26);
  }

  // Sonido de error suave si se pulsa un punto que no toca
  playWrongDot() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Clic de interfaz
  playUiClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Gran fanfarria alegre al completar el dibujo
  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Acorde triunfal arpegiado: C - E - G - B - C'
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

    notes.forEach((freq, i) => {
      const startTime = now + i * 0.09;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      const duration = (i === notes.length - 1) ? 1.2 : 0.4;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  }

  // Sonido de pincel / coloreado
  playBrushStroke() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350 + Math.random() * 200, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }
}

export const audio = new SoundEngine();
