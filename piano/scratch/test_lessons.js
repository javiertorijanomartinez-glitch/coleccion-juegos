// Test script for LessonManager, LessonValidator, and GameEngine integration
import { LessonManager } from '../src/lessons/LessonManager.js';
import { LessonValidator } from '../src/lessons/LessonValidator.js';
import { GameEngine } from '../src/core/GameEngine.js';
import { SongManager } from '../src/songs/SongManager.js';

console.log('=== TEST 1: LessonManager Data & Modules ===');
const lm = new LessonManager();
const modules = lm.getModules();
console.assert(modules.length === 4, `Expected 4 modules, got ${modules.length}`);
const allLessons = lm.getAllLessons();
console.assert(allLessons.length === 15, `Expected 15 lessons, got ${allLessons.length}`);
console.log(`Loaded ${allLessons.length} lessons across ${modules.length} modules.`);

console.log('=== TEST 2: Lesson 1 Step & Single Note Validation ===');
const lv = new LessonValidator();
const l1 = lm.getLesson('lesson-01');
lv.loadLesson(l1);

let step1 = lv.getCurrentStep();
console.assert(step1 && step1.noteName === 'C4', `Expected C4 in step 1, got ${step1?.noteName}`);
console.assert(step1.finger === 1, `Expected finger 1, got ${step1?.finger}`);

let advanced = false;
lv.onSuccess = (fb) => {
  advanced = true;
};
lv.handleNoteOn('C4');
console.assert(advanced, 'Step 1 should advance on C4');

let step2 = lv.getCurrentStep();
console.assert(step2 && step2.noteName === 'D4', `Expected D4 in step 2, got ${step2?.noteName}`);
console.assert(step2.finger === 2, `Expected finger 2, got ${step2?.finger}`);
console.log('Lesson 1 single note validation passed!');

console.log('=== TEST 3: Lesson 7 Simultaneous Chord Validation ===');
const l7 = lm.getLesson('lesson-07');
lv.loadLesson(l7);
const chordStep = lv.getCurrentStep();
console.assert(chordStep && chordStep.chordName === 'C Mayor', 'Expected C Mayor in step 1 of lesson 7');

let chordCompleted = false;
lv.onSuccess = (fb) => {
  chordCompleted = true;
};

// Play C4, then E4, then G4 within window
lv.handleNoteOn('C4');
lv.handleNoteOn('E4');
lv.handleNoteOn('G4');
console.assert(chordCompleted, 'Chord C-E-G should be completed within window');
console.log('Lesson 7 simultaneous chord validation passed!');

console.log('=== TEST 4: Lesson 12 Velocity Dynamic Validation ===');
const l12 = lm.getLesson('lesson-12');
lv.loadLesson(l12);
const dynStep = lv.getCurrentStep();
console.assert(dynStep && dynStep.expectedDynamic === 'piano', 'Expected piano dynamic in step 1 of lesson 12');

let dynSuccess = false;
let dynMistake = false;
lv.onSuccess = () => { dynSuccess = true; };
lv.onMistake = () => { dynMistake = true; };

// Play forte (velocity 0.9) when piano is expected (< 0.45)
lv.handleNoteOn('C4', 0.9);
console.assert(dynMistake, 'Velocity 0.9 should trigger a mistake when piano (<0.45) is expected');

// Play piano (velocity 0.3)
dynMistake = false;
lv.handleNoteOn('C4', 0.3);
console.assert(dynSuccess, 'Velocity 0.3 should pass piano threshold');
console.log('Lesson 12 velocity dynamic validation passed!');

console.log('=== TEST 5: GameEngine in Lesson Mode ===');
const mockAudio = { playNote: () => {}, stopNote: () => {} };
let renderedTargets = null;
const mockStaff = {
  noteOn: () => {},
  noteOff: () => {},
  setTargetNote: (current, upcoming, hand, past) => {
    renderedTargets = { current, upcoming, hand, past };
  },
  clearTargetNote: () => { renderedTargets = null; },
  setTimeSignature: () => {},
  createHitParticle: () => {}
};
let keyboardTargets = null;
const mockKeyboard = {
  setTargetKeys: (targets) => { keyboardTargets = targets; },
  clearTargetKeys: () => { keyboardTargets = null; },
  pressVisualKey: () => {},
  releaseVisualKey: () => {},
  setOctaveRange: () => {},
  is88KeysMode: false
};
const mockMetronome = { setBpm: () => {}, setTimeSignature: () => {} };

const engine = new GameEngine({
  audioEngine: mockAudio,
  metronome: mockMetronome,
  staffVisualizer: mockStaff,
  pianoKeyboard: mockKeyboard,
  songManager: new SongManager(),
  lessonManager: lm,
  lessonValidator: lv
});

engine.setMode('lesson');
engine.setLesson('lesson-01');

console.assert(engine.mode === 'lesson', 'Engine should be in lesson mode');
console.assert(keyboardTargets && keyboardTargets.length === 1, 'Keyboard should have 1 target key');
console.assert(keyboardTargets[0].note === 'C4' && keyboardTargets[0].finger === 1, 'Target should be C4 with finger 1');
console.assert(renderedTargets !== null, 'Staff should have target note rendered');
console.log('GameEngine lesson mode integration passed!');

console.log('ALL LESSON TESTS PASSED SUCCESSFULLY!');
process.exit(0);
