/**
 * Mock Web Audio API to verify node connections, gain values, and timing calls in AudioEngine & Metronome
 */

class MockAudioParam {
  constructor(val = 1) {
    this.value = val;
  }
  setValueAtTime(val, t) {
    this.value = val;
  }
  linearRampToValueAtTime(val, t) {
    this.value = val;
  }
  exponentialRampToValueAtTime(val, t) {
    if (this.value <= 0) {
      throw new Error('Invalid exponential ramp from 0 or negative value: ' + this.value);
    }
    this.value = val;
  }
  setTargetAtTime(val, t, c) {
    this.value = val;
  }
  cancelScheduledValues(t) {}
}

class MockAudioNode {
  constructor() {
    this.connections = [];
  }
  connect(dest) {
    this.connections.push(dest);
  }
  disconnect() {
    this.connections = [];
  }
}

class MockGainNode extends MockAudioNode {
  constructor() {
    super();
    this.gain = new MockAudioParam(1);
  }
}

class MockOscillatorNode extends MockAudioNode {
  constructor() {
    super();
    this.frequency = new MockAudioParam(440);
    this.detune = new MockAudioParam(0);
    this.type = 'sine';
  }
  start(t) {}
  stop(t) {}
}

class MockAudioContext {
  constructor() {
    this.currentTime = 0.1;
    this.sampleRate = 44100;
    this.state = 'running';
    this.destination = new MockAudioNode();
  }
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillatorNode(); }
  createDynamicsCompressor() {
    return {
      threshold: new MockAudioParam(-12),
      knee: new MockAudioParam(24),
      ratio: new MockAudioParam(8),
      attack: new MockAudioParam(0.003),
      release: new MockAudioParam(0.2),
      connect(dest) {},
      disconnect() {}
    };
  }
  createBiquadFilter() {
    return {
      frequency: new MockAudioParam(1000),
      Q: new MockAudioParam(1),
      connect(dest) {},
      disconnect() {}
    };
  }
  createBuffer(channels, length, rate) {
    return {
      getChannelData() { return new Float32Array(length); }
    };
  }
  createBufferSource() {
    return {
      connect(dest) {},
      disconnect() {},
      start() {},
      stop() {}
    };
  }
  resume() { this.state = 'running'; return Promise.resolve(); }
}

globalThis.window = {
  AudioContext: MockAudioContext
};

import { AudioEngine } from '../src/audio/AudioEngine.js';
import { Metronome } from '../src/audio/Metronome.js';

console.log('Testing AudioEngine...');
const engine = new AudioEngine();
engine.init();

// Test playing several notes
['C4', 'E4', 'G4', 'C5', 'F#4'].forEach(note => {
  console.log(`Playing ${note}...`);
  engine.playNote(note);
  const voice = engine.activeVoices.get(note);
  if (!voice) throw new Error('Voice was not created for ' + note);
  if (voice.voiceGain.gain.value <= 0) {
    throw new Error(`CRITICAL: voiceGain for ${note} is ${voice.voiceGain.gain.value}, expected > 0!`);
  }
  console.log(`  -> Voice for ${note} active, voiceGain = ${voice.voiceGain.gain.value}`);
  engine.stopNote(note);
});

console.log('\nTesting Metronome audio scheduler...');
const metronome = new Metronome(engine.ctx);
metronome._scheduleNote(0, 0.2); // Accent beat
metronome._scheduleNote(1, 0.7); // Regular beat

console.log('\nALL AUDIO GRAPH TESTS PASSED WITHOUT ERRORS!');
