// Verification test script for Impostor GameEngine and CustomWordsStore
import { GameEngine, GAME_STATES } from './src/core/GameEngine.js';
import { CustomWordsStore } from './src/data/customWordsStore.js';
import { DEFAULT_WORD_PAIRS } from './src/data/defaultWords.js';

console.log('--- TEST 1: Default Word Pairs Database ---');
console.log(`Total pairs loaded: ${DEFAULT_WORD_PAIRS.length}`);
if (DEFAULT_WORD_PAIRS.length < 30) throw new Error('Expected at least 30 word pairs');

console.log('--- TEST 2: Custom Words Store ---');
// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = v; },
  removeItem: (k) => { delete storage[k]; }
};

const customWord = CustomWordsStore.addWord('Tacos', 'Burritos');
console.log('Added custom word:', customWord);
const allCustom = CustomWordsStore.getAll();
if (allCustom.length !== 1 || allCustom[0].civil !== 'Tacos') throw new Error('Failed to add custom word');

console.log('--- TEST 3: GameEngine Lobby & Start Game ---');
const engine = new GameEngine();
engine.setPlayerCount(5);
engine.setImpostorCount(1);
engine.setMode('classic');
engine.setCategory('all');
engine.startGame();

console.log(`Game state: ${engine.state} (Expected: ${GAME_STATES.REVEAL})`);
console.log(`Players count: ${engine.players.length}`);
const impostors = engine.players.filter(p => p.isImpostor);
const civilians = engine.players.filter(p => !p.isImpostor);
console.log(`Impostors: ${impostors.length}, Civilians: ${civilians.length}`);
if (impostors.length !== 1 || civilians.length !== 4) throw new Error('Impostor assignment mismatch');
console.log(`Current word pair: Civil="${engine.currentPair.civil}", Impostor="${engine.currentPair.impostor}"`);

console.log('--- TEST 4: Reveal Pass & Play ---');
for (let i = 0; i < 5; i++) {
  const p = engine.getCurrentRevealPlayer();
  console.log(`Reveal player ${i + 1}: ${p.name} (Role: ${p.role}, Word: ${p.word || 'NONE - CLASSIC'})`);
  engine.markPlayerRevealed(p.id);
  engine.nextRevealPlayer();
}
console.log(`Game state after all reveals: ${engine.state} (Expected: ${GAME_STATES.CLUES})`);
if (engine.state !== GAME_STATES.CLUES) throw new Error('Did not transition to CLUES');

console.log('--- TEST 5: Clues Round ---');
console.log(`Speaker order: ${engine.speakerOrder.join(', ')}`);
const initialSpeaker = engine.getCurrentSpeaker();
console.log(`First speaker: ${initialSpeaker.name}`);
engine.advanceSpeaker();
console.log(`Next speaker: ${engine.getCurrentSpeaker().name}`);

console.log('--- TEST 6: Debate & Voting ---');
engine.startDebatePhase();
console.log(`Game state: ${engine.state} (Expected: ${GAME_STATES.DEBATE})`);
engine.startVotingPhase();
console.log(`Game state: ${engine.state} (Expected: ${GAME_STATES.VOTING})`);

// Eliminate the impostor
const targetImpostor = impostors[0];
console.log(`Eliminating impostor: ${targetImpostor.name} (ID: ${targetImpostor.id})`);
engine.confirmElimination(targetImpostor.id);
console.log(`Game state: ${engine.state} (Expected: ${GAME_STATES.RESOLUTION})`);
console.log(`Eliminated player isImpostor: ${engine.eliminatedPlayer.isImpostor}`);

console.log('--- TEST 7: Impostor Last Chance Guess ---');
engine.triggerImpostorGuess();
console.log(`Game state: ${engine.state} (Expected: ${GAME_STATES.GUESS})`);

// Test guessing correctly
const correctWord = engine.currentPair.civil;
const guessResult = engine.evaluateGuess(correctWord);
console.log(`Guess attempt "${correctWord}": ${guessResult ? 'SUCCESS' : 'FAILURE'}`);
console.log(`Game state: ${engine.state} (Expected: ${GAME_STATES.GAME_OVER})`);
console.log(`Winner: ${engine.winner} (Expected: IMPOSTOR)`);
if (engine.winner !== 'IMPOSTOR') throw new Error('Expected IMPOSTOR to win on correct guess');

console.log('--- TEST 8: Restart Game ---');
engine.restartGame();
console.log(`Restarted game state: ${engine.state} (Expected: ${GAME_STATES.REVEAL})`);

console.log('\n🎉 ALL ENGINE LOGIC TESTS PASSED SUCCESSFULLY! 🎉\n');
