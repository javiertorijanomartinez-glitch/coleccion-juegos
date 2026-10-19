import { MidiInputManager } from '../src/audio/MidiInputManager.js';
import { AudioEngine } from '../src/audio/AudioEngine.js';

console.log('=== TEST 1: Note Frequencies in AudioEngine (Full 88-Key Range) ===');
// Mock AudioContext for Node.js
globalThis.window = {};
const audioEngine = new AudioEngine();
const freqs = audioEngine.noteFrequencies;

console.log('Total frequencies generated:', Object.keys(freqs).length);
console.log('A0 (MIDI 21):', freqs['A0'], 'Hz (esperado ~27.5)');
console.log('C4 (MIDI 60):', freqs['C4'], 'Hz (esperado ~261.63)');
console.log('A4 (MIDI 69):', freqs['A4'], 'Hz (esperado 440)');
console.log('C8 (MIDI 108):', freqs['C8'], 'Hz (esperado ~4186.01)');

if (!freqs['A0'] || !freqs['C4'] || !freqs['C8']) {
  throw new Error('Frecuencias 88 teclas incompletas');
}

console.log('\n=== TEST 2: MidiInputManager Note & CC Decoding ===');
const midiManager = new MidiInputManager();

// Test note conversion
console.log('MIDI 21 ->', midiManager.midiNumberToNote(21)); // A0
console.log('MIDI 60 ->', midiManager.midiNumberToNote(60)); // C4
console.log('MIDI 61 ->', midiManager.midiNumberToNote(61)); // C#4
console.log('MIDI 108 ->', midiManager.midiNumberToNote(108)); // C8

if (midiManager.midiNumberToNote(60) !== 'C4' || midiManager.midiNumberToNote(21) !== 'A0') {
  throw new Error('Conversión de nota MIDI fallida');
}

// Mock callback listeners
let noteDownReceived = null;
let noteUpReceived = null;
let sustainReceived = null;

midiManager.onNoteDown = (note, vel, midi, ch) => {
  noteDownReceived = { note, vel, midi, ch };
};

midiManager.onNoteUp = (note, midi, ch) => {
  noteUpReceived = { note, midi, ch };
};

midiManager.onSustain = (isPressed) => {
  sustainReceived = isPressed;
};

// Simulate Note On (Status 0x90 = 144, Channel 1, Note 60 C4, Velocity 100)
midiManager._handleMidiMessage({ data: new Uint8Array([0x90, 60, 100]) }, { id: 'test-keyboard' });
console.log('Note On Received:', noteDownReceived);
if (!noteDownReceived || noteDownReceived.note !== 'C4' || noteDownReceived.vel <= 0) {
  throw new Error('Fallo al procesar Note On');
}

// Simulate Note Off (Status 0x80 = 128, Channel 1, Note 60 C4)
midiManager._handleMidiMessage({ data: new Uint8Array([0x80, 60, 64]) }, { id: 'test-keyboard' });
console.log('Note Off Received:', noteUpReceived);
if (!noteUpReceived || noteUpReceived.note !== 'C4') {
  throw new Error('Fallo al procesar Note Off');
}

// Simulate Note On with Velocity 0 (debe tratarse como Note Off)
noteUpReceived = null;
midiManager._handleMidiMessage({ data: new Uint8Array([0x90, 62, 0]) }, { id: 'test-keyboard' });
console.log('Note On (vel=0) treated as Note Off:', noteUpReceived);
if (!noteUpReceived || noteUpReceived.note !== 'D4') {
  throw new Error('Fallo en Note On vel=0 -> Note Off');
}

// Simulate CC 64 (Sustain Pedal Down: 127)
midiManager._handleMidiMessage({ data: new Uint8Array([0xB0, 64, 127]) }, { id: 'test-keyboard' });
console.log('Sustain Down Received:', sustainReceived);
if (sustainReceived !== true) {
  throw new Error('Fallo al procesar Sustain Pedal Down');
}

// Simulate CC 64 (Sustain Pedal Up: 0)
midiManager._handleMidiMessage({ data: new Uint8Array([0xB0, 64, 0]) }, { id: 'test-keyboard' });
console.log('Sustain Up Received:', sustainReceived);
if (sustainReceived !== false) {
  throw new Error('Fallo al procesar Sustain Pedal Up');
}

console.log('\n🎉 ALL MIDI INTEGRATION TESTS PASSED!');
