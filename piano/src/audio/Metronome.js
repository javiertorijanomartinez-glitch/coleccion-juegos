/**
 * Metronome.js
 * Metrónomo de alta precisión temporal con Web Audio API.
 * Emplea programación anticipada (lookahead) para garantizar precisión milimétrica en el ritmo.
 */

export class Metronome {
  constructor(audioContext) {
    this.ctx = audioContext;
    this.bpm = 100;
    this.beatsPerBar = 4;
    this.currentBeat = 0;
    this.isPlaying = false;
    this.volume = 0.8;
    this.isMuted = false;

    // Callbacks para la interfaz gráfica
    this.onTick = null; // function(beatIndex, isAccent, nextTickTime)

    // Variables internas del planificador de audio
    this.lookahead = 25.0; // ms de anticipación para calcular notas
    this.scheduleAheadTime = 0.1; // segundos hacia el futuro para programar Web Audio
    this.nextNoteTime = 0.0;
    this.timerId = null;

    // Detección de Tap Tempo
    this.tapTimes = [];
  }

  setAudioContext(ctx) {
    this.ctx = ctx;
  }

  setBpm(bpm) {
    this.bpm = Math.max(30, Math.min(260, Math.round(bpm)));
  }

  setTimeSignature(beats) {
    this.beatsPerBar = beats;
    this.currentBeat = 0;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  start() {
    if (this.isPlaying) return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentBeat = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    this.timerId = setInterval(() => this._scheduler(), this.lookahead);
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    clearInterval(this.timerId);
    this.timerId = null;
    this.currentBeat = 0;
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  /**
   * Registra un toque manual para calcular el tempo promedio (Tap Tempo).
   */
  tap() {
    const now = performance.now();
    this.tapTimes.push(now);

    // Conservar solo toques de los últimos 2.5 segundos
    this.tapTimes = this.tapTimes.filter(t => now - t < 2500);

    if (this.tapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < this.tapTimes.length; i++) {
        intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      this.setBpm(calculatedBpm);
      return this.bpm;
    }
    return null;
  }

  _scheduler() {
    if (!this.isPlaying || !this.ctx) return;

    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this._scheduleNote(this.currentBeat, this.nextNoteTime);
      this._nextNote();
    }
  }

  _nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;
    this.currentBeat = (this.currentBeat + 1) % this.beatsPerBar;
  }

  _scheduleNote(beatNumber, time) {
    const isAccent = beatNumber === 0;

    // 1. Sonido de click / woodblock
    if (!this.isMuted) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // El primer tiempo es más agudo (acento rítmico)
      osc.frequency.setValueAtTime(isAccent ? 1200 : 800, time);
      osc.type = 'sine';

      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(isAccent ? 0.7 * this.volume : 0.45 * this.volume, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + (isAccent ? 0.08 : 0.05));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.1);
    }

    // 2. Notificar a la UI en el momento exacto
    const delayMs = Math.max(0, (time - this.ctx.currentTime) * 1000);
    setTimeout(() => {
      if (this.isPlaying && this.onTick) {
        this.onTick(beatNumber, isAccent);
      }
    }, delayMs);
  }
}
