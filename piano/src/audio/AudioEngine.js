/**
 * AudioEngine.js
 * Sintetizador polifónico de piano acústico de alta calidad mediante Web Audio API.
 * Modela sobretonos armónicos, transitorio de martillo (ataque percusivo) y decaimiento realista.
 */

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.sustainPedal = false;
    this.activeVoices = new Map(); // key: noteName, value: voiceData
    this.volume = 0.9;
    this.isInitialized = false;

    // Mapa de notas a frecuencias estándar (A4 = 440Hz)
    this.noteFrequencies = this._generateFrequencies();

    // Intentar inicializar contexto inmediatamente si está permitido
    this.init();
  }

  /**
   * Inicializa el contexto de audio.
   */
  init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();

      // Compresor dinámico para evitar distorsión en acordes fuertes
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

      // Ganancia maestra
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.compressor.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.isInitialized = true;
    } catch (err) {
      console.warn('AudioContext no se pudo inicializar todavía:', err);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  setSustain(enabled) {
    this.sustainPedal = enabled;
    if (!enabled) {
      // Al soltar el pedal, libera las notas que no estén actualmente presionadas
      for (const [note, voice] of this.activeVoices.entries()) {
        if (voice.isReleasedByFinger) {
          this._stopVoice(note, voice, 0.25);
        }
      }
    }
  }

  /**
   * Toca una nota.
   * @param {string} noteName Ej. "C4", "F#4", "A5"
   * @param {number} velocity Intensidad de 0 a 1 (por defecto 0.9)
   */
  playNote(noteName, velocity = 0.9) {
    // Si el contexto aún no existe o está suspendido, inicializar/reanudar en este evento de usuario
    if (!this.ctx || !this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ctx) return;

    // Si ya sonaba esa nota, apaga la voz anterior limpiamente
    if (this.activeVoices.has(noteName)) {
      const oldVoice = this.activeVoices.get(noteName);
      this._stopVoice(noteName, oldVoice, 0.05);
    }

    const freq = this.noteFrequencies[noteName];
    if (!freq) return;

    const now = this.ctx.currentTime;
    const voiceGains = [];
    const voiceOscs = [];

    // Nodo de ganancia para esta voz individual (se inicia en 1.0)
    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(1.0, now);

    const velGain = Math.max(0.3, Math.min(1.0, Math.pow(velocity, 1.2)));

    // 1. Armónicos del piano acústico (fundamental + sobretonos)
    const harmonics = [
      { mult: 1.0,  gain: 0.70, decay: 2.6, type: 'triangle' },
      { mult: 2.0,  gain: 0.40, decay: 2.0, type: 'sine' },
      { mult: 3.01, gain: 0.20, decay: 1.5, type: 'sine' },
      { mult: 4.02, gain: 0.12, decay: 1.1, type: 'sine' },
      { mult: 5.04, gain: 0.06, decay: 0.7, type: 'sine' }
    ];

    harmonics.forEach(h => {
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();

      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.mult, now);

      // Micro-desafinación cálida de cuerdas de piano
      if (h.mult === 1.0) {
        osc.detune.setValueAtTime((Math.random() - 0.5) * 4, now);
      }

      // Envolvente de ataque ultrarrápido y decaimiento natural
      hGain.gain.setValueAtTime(0.0001, now);
      hGain.gain.linearRampToValueAtTime(h.gain * velGain, now + 0.008);
      hGain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

      osc.connect(hGain);
      hGain.connect(voiceGain);

      osc.start(now);
      voiceOscs.push(osc);
      voiceGains.push(hGain);
    });

    // 2. Golpe de martillo (Hammer strike percusivo)
    this._playHammerStrike(freq, velGain, voiceGain, now);

    // Conectar voz al compresor maestro
    voiceGain.connect(this.compressor);

    // Registrar voz activa
    const voiceData = {
      voiceGain,
      voiceOscs,
      voiceGains,
      startTime: now,
      isReleasedByFinger: false
    };

    this.activeVoices.set(noteName, voiceData);
  }

  /**
   * Genera el golpe seco del martillo sobre la cuerda.
   */
  _playHammerStrike(freq, velGain, destNode, now) {
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.035); // 35ms
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(Math.min(freq * 1.6, 3500), now);
      filter.Q.setValueAtTime(2.5, now);

      const strikeGain = this.ctx.createGain();
      strikeGain.gain.setValueAtTime(0.25 * velGain, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      whiteNoise.connect(filter);
      filter.connect(strikeGain);
      strikeGain.connect(destNode);

      whiteNoise.start(now);
    } catch (e) {
      // Si el buffer falla por alguna razón, los osciladores siguen funcionando
    }
  }

  /**
   * Suelta una nota cuando se levanta el dedo.
   */
  stopNote(noteName) {
    if (!this.activeVoices.has(noteName)) return;
    const voice = this.activeVoices.get(noteName);
    voice.isReleasedByFinger = true;

    // Si el pedal de resonancia está pisado, mantener la nota sonando
    if (this.sustainPedal) {
      return;
    }

    this._stopVoice(noteName, voice, 0.25);
  }

  _stopVoice(noteName, voice, releaseTime = 0.25) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      const currentVal = Math.max(0.0001, voice.voiceGain.gain.value || 1.0);
      voice.voiceGain.gain.cancelScheduledValues(now);
      voice.voiceGain.gain.setValueAtTime(currentVal, now);
      voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

      setTimeout(() => {
        voice.voiceOscs.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        try { voice.voiceGain.disconnect(); } catch (e) {}
        if (this.activeVoices.get(noteName) === voice) {
          this.activeVoices.delete(noteName);
        }
      }, releaseTime * 1000 + 50);
    } catch (e) {
      this.activeVoices.delete(noteName);
    }
  }

  /**
   * Genera el diccionario de frecuencias de notas para el teclado completo de 88 teclas (A0 a C8) y más.
   */
  _generateFrequencies() {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const freqs = {};
    for (let midi = 21; midi <= 108; midi++) {
      const noteName = notes[midi % 12] + (Math.floor(midi / 12) - 1);
      const freq = 440 * Math.pow(2, (midi - 69) / 12);
      freqs[noteName] = freq;
    }
    return freqs;
  }
}
