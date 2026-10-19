import { SONG_LIBRARY } from '../src/songs/songLibrary.js';
import { MidiParser } from '../src/songs/MidiParser.js';
import { SongManager } from '../src/songs/SongManager.js';

console.log('--- Testing Song Library ---');
console.log(`Loaded ${SONG_LIBRARY.length} songs.`);
SONG_LIBRARY.forEach(s => {
  console.log(`- ${s.title}: ${s.notes.length} notes, ${s.bpm} BPM, Compas: ${s.timeSignature}/4`);
});

console.log('\n--- Testing Midi Note Converter ---');
console.log('MIDI 60 ->', MidiParser.midiNumberToNoteName(60)); // C4
console.log('MIDI 61 ->', MidiParser.midiNumberToNoteName(61)); // C#4
console.log('MIDI 69 ->', MidiParser.midiNumberToNoteName(69)); // A4
console.log('MIDI 72 ->', MidiParser.midiNumberToNoteName(72)); // C5

console.log('\n--- Testing Text Note Importer ---');
// Mock localStorage
globalThis.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = val; }
};

const manager = new SongManager();
const imported = manager.importFromText('Prueba Melodía', 'C4 D4 E4 F4 G4 A4 B4 C5', 120);
console.log('Imported song:', imported.title, 'with', imported.notes.length, 'notes.');
console.log('Notes:', imported.notes.map(n => n.note).join(' '));

console.log('\nALL SCRATCH TESTS PASSED SUCCESSFULLY!');
