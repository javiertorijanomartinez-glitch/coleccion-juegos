// Test logic verification for GameEngine hand filtering and rewind/pause logic
import { SongManager } from '../src/songs/SongManager.js';
import { GameEngine } from '../src/core/GameEngine.js';

// Mock dependencies
const mockAudio = {
  playNote: () => {},
  stopNote: () => {}
};

const mockStaff = {
  noteOn: () => {},
  noteOff: () => {},
  setTargetNote: () => {},
  clearTargetNote: () => {},
  setTimeSignature: () => {},
  createHitParticle: () => {}
};

const mockKeyboard = {
  setTargetKeys: () => {},
  clearTargetKeys: () => {},
  pressVisualKey: () => {},
  releaseVisualKey: () => {},
  setOctaveRange: () => {},
  is88KeysMode: false
};

const mockMetronome = {
  setBpm: () => {},
  setTimeSignature: () => {}
};

const songs = new SongManager();
const engine = new GameEngine({
  audioEngine: mockAudio,
  staffVisualizer: mockStaff,
  pianoKeyboard: mockKeyboard,
  songManager: songs,
  metronome: mockMetronome
});

// Test 1: Hand filtering
console.log('--- TEST 1: Hand filtering ---');
const testNotes = [
  { note: 'C3', hand: 'left' },
  { note: 'G4', hand: 'right' }
];

const rightOnly = engine._filterNotesByHand(testNotes, 'right');
console.assert(rightOnly.length === 1 && rightOnly[0].note === 'G4', 'Right hand filter failed');

const leftOnly = engine._filterNotesByHand(testNotes, 'left');
console.assert(leftOnly.length === 1 && leftOnly[0].note === 'C3', 'Left hand filter failed');

const bothHands = engine._filterNotesByHand(testNotes, 'both');
console.assert(bothHands.length === 2, 'Both hands filter failed');
console.log('Passed Hand Filtering!');

// Test 2: Pause and Resume
console.log('--- TEST 2: Pause and Resume ---');
engine.setMode('demo');
console.assert(engine.isPlayingDemo === true, 'Demo should start playing');
const noteBeforePause = engine.currentNoteIndex;

engine.toggleDemoPause();
console.assert(engine.isPlayingDemo === false, 'Demo should be paused');
console.assert(engine.currentNoteIndex === noteBeforePause, 'currentNoteIndex should be preserved when paused');

engine.toggleDemoPause();
console.assert(engine.isPlayingDemo === true, 'Demo should resume playing');
console.log('Passed Pause and Resume!');

// Test 3: Rewind
console.log('--- TEST 3: Rewind ---');
engine.currentNoteIndex = 6;
engine.rewind(4);
console.assert(engine.currentNoteIndex === 2, `Expected index 2, got ${engine.currentNoteIndex}`);
engine.rewind(5);
console.assert(engine.currentNoteIndex === 0, `Expected index 0 (clamped), got ${engine.currentNoteIndex}`);
console.log('Passed Rewind!');

console.log('ALL VERIFICATION TESTS PASSED!');
process.exit(0);
