/* ==========================================================================
   IMPOSTOR - Game Engine & State Machine
   ========================================================================== */

import { CustomWordsStore } from '../data/customWordsStore.js';

export const GAME_STATES = {
  LOBBY: 'LOBBY',
  REVEAL: 'REVEAL',
  CLUES: 'CLUES',
  DEBATE: 'DEBATE',
  VOTING: 'VOTING',
  RESOLUTION: 'RESOLUTION',
  GUESS: 'GUESS',
  GAME_OVER: 'GAME_OVER'
};

export const PLAYER_COLORS = [
  '#ff2d55', // Crimson
  '#00f2fe', // Cyan
  '#8a2be2', // Violet
  '#00e676', // Emerald
  '#ffb703', // Amber
  '#ff007f', // Deep Pink
  '#00b4d8', // Ocean Blue
  '#70e000', // Lime
  '#f72585', // Magenta
  '#4cc9f0', // Sky Blue
  '#fb8500', // Orange
  '#9d4edd'  // Purple
];

export class GameEngine {
  constructor() {
    this.state = GAME_STATES.LOBBY;
    
    // Settings
    this.playerCount = 5;
    this.impostorCount = 1;
    this.mode = 'classic'; // 'classic' (Modo 1) or 'trap' (Modo 2: Palabra trampa)
    this.categoryId = 'all';
    this.debateDuration = 90; // seconds (0 = sin límite)
    this.totalClueRounds = 1;

    // Player custom names stored in engine
    this.customPlayerNames = {};

    // Active Game Data
    this.players = [];
    this.currentPair = null;
    this.revealIndex = 0;
    
    // Clues & Speaker tracking
    this.speakerOrder = []; // array of player IDs
    this.currentSpeakerIndex = 0;
    this.currentRound = 1;

    // Voting & Resolution
    this.votes = {}; // playerId -> vote count
    this.selectedSuspectId = null;
    this.eliminatedPlayer = null;

    // Final Outcome
    this.winner = null; // 'CIVIL' | 'IMPOSTOR'
    this.winReason = '';
    this.guessAttempt = '';

    // Listeners for state change
    this.stateChangeListeners = [];
  }

  onStateChange(callback) {
    this.stateChangeListeners.push(callback);
  }

  setState(newState) {
    this.state = newState;
    this.stateChangeListeners.forEach(fn => fn(this.state, this));
  }

  // --- LOBBY CONFIGURATION ---
  setPlayerCount(count) {
    this.playerCount = Math.max(3, Math.min(12, count));
    // Ensure impostors don't exceed allowed ratio
    const maxImpostors = Math.min(3, Math.floor((this.playerCount - 1) / 2));
    if (this.impostorCount > maxImpostors) {
      this.impostorCount = maxImpostors;
    }
  }

  setImpostorCount(count) {
    const maxImpostors = Math.min(3, Math.floor((this.playerCount - 1) / 2));
    this.impostorCount = Math.max(1, Math.min(maxImpostors, count));
  }

  setMode(mode) {
    this.mode = mode === 'trap' ? 'trap' : 'classic';
  }

  setCategory(categoryId) {
    this.categoryId = categoryId;
  }

  setDebateDuration(seconds) {
    this.debateDuration = seconds;
  }

  setClueRounds(rounds) {
    this.totalClueRounds = rounds;
  }

  setPlayerName(index, name) {
    if (name && name.trim()) {
      this.customPlayerNames[index] = name.trim();
    } else {
      delete this.customPlayerNames[index];
    }
  }

  getPlayerName(index) {
    return this.customPlayerNames[index] || `Jugador ${index + 1}`;
  }

  // --- START GAME INITIALIZATION ---
  startGame() {
    // 1. Pick a random word pair
    const playableWords = CustomWordsStore.getPlayableWords(this.categoryId);
    if (!playableWords || playableWords.length === 0) {
      throw new Error('No hay palabras disponibles en esta categoría.');
    }
    const randomIndex = Math.floor(Math.random() * playableWords.length);
    this.currentPair = playableWords[randomIndex];

    // 2. Setup Players
    this.players = [];
    for (let i = 0; i < this.playerCount; i++) {
      this.players.push({
        id: i + 1,
        index: i,
        name: this.getPlayerName(i),
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
        isImpostor: false,
        role: 'CIVIL',
        word: this.currentPair.civil,
        isEliminated: false,
        hasRevealed: false
      });
    }

    // 3. Randomly assign Impostor(s)
    const indices = Array.from({ length: this.playerCount }, (_, i) => i);
    // Shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const impostorIndices = indices.slice(0, this.impostorCount);
    impostorIndices.forEach(idx => {
      const p = this.players[idx];
      p.isImpostor = true;
      p.role = 'IMPOSTOR';
      if (this.mode === 'classic') {
        p.word = null; // In classic mode, impostor has no word
      } else {
        p.word = this.currentPair.impostor; // In trap mode, undercover receives similar word
      }
    });

    // 4. Initialize Reveal Phase
    this.revealIndex = 0;
    this.setState(GAME_STATES.REVEAL);
  }

  // --- PHASE 1: REVEAL (Pass & Play) ---
  getCurrentRevealPlayer() {
    return this.players[this.revealIndex] || null;
  }

  markPlayerRevealed(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (player) {
      player.hasRevealed = true;
    }
  }

  nextRevealPlayer() {
    if (this.revealIndex < this.players.length - 1) {
      this.revealIndex++;
      this.setState(GAME_STATES.REVEAL);
    } else {
      // Everyone has seen their word, move to Clues Phase
      this.startCluesPhase();
    }
  }

  // --- PHASE 2: CLUES ---
  startCluesPhase() {
    // Generate randomized speaker order of non-eliminated players
    const activePlayerIds = this.players.filter(p => !p.isEliminated).map(p => p.id);
    for (let i = activePlayerIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activePlayerIds[i], activePlayerIds[j]] = [activePlayerIds[j], activePlayerIds[i]];
    }
    this.speakerOrder = activePlayerIds;
    this.currentSpeakerIndex = 0;
    this.currentRound = 1;
    this.setState(GAME_STATES.CLUES);
  }

  getCurrentSpeaker() {
    const id = this.speakerOrder[this.currentSpeakerIndex];
    return this.players.find(p => p.id === id) || null;
  }

  getNextSpeaker() {
    const nextIdx = (this.currentSpeakerIndex + 1) % this.speakerOrder.length;
    const id = this.speakerOrder[nextIdx];
    return this.players.find(p => p.id === id) || null;
  }

  advanceSpeaker() {
    if (this.currentSpeakerIndex < this.speakerOrder.length - 1) {
      this.currentSpeakerIndex++;
      this.setState(GAME_STATES.CLUES);
    } else {
      // Finished a round
      if (this.currentRound < this.totalClueRounds) {
        this.currentRound++;
        this.currentSpeakerIndex = 0;
        this.setState(GAME_STATES.CLUES);
      } else {
        // Ready for debate
        this.startDebatePhase();
      }
    }
  }

  // --- PHASE 3: DEBATE & VOTING ---
  startDebatePhase() {
    this.setState(GAME_STATES.DEBATE);
  }

  startVotingPhase() {
    // Reset votes
    this.votes = {};
    this.selectedSuspectId = null;
    this.setState(GAME_STATES.VOTING);
  }

  getActivePlayers() {
    return this.players.filter(p => !p.isEliminated);
  }

  selectSuspect(playerId) {
    this.selectedSuspectId = playerId;
  }

  confirmElimination(playerId = null) {
    const targetId = playerId || this.selectedSuspectId;
    if (!targetId) return;

    this.eliminatedPlayer = this.players.find(p => p.id === targetId);
    if (!this.eliminatedPlayer) return;

    this.eliminatedPlayer.isEliminated = true;
    this.setState(GAME_STATES.RESOLUTION);
  }

  // --- PHASE 4: RESOLUTION & GUESS ---
  triggerImpostorGuess() {
    this.setState(GAME_STATES.GUESS);
  }

  evaluateGuess(wordAttempt) {
    this.guessAttempt = wordAttempt.trim();
    const cleanAttempt = this.normalizeWord(this.guessAttempt);
    const cleanSecret = this.normalizeWord(this.currentPair.civil);

    const isCorrect = cleanAttempt.length > 0 && cleanAttempt === cleanSecret;

    if (isCorrect) {
      // Impostor wins by guessing secret word!
      this.winner = 'IMPOSTOR';
      this.winReason = `¡El Impostor acertó la palabra secreta ("${this.currentPair.civil}") en su última oportunidad!`;
      this.setState(GAME_STATES.GAME_OVER);
      return true;
    } else {
      // Impostor failed the guess! Check if there are remaining impostors
      this.checkAfterImpostorEliminated();
      return false;
    }
  }

  impostorGivesUp() {
    this.guessAttempt = '';
    this.checkAfterImpostorEliminated();
  }

  checkAfterImpostorEliminated() {
    const remainingImpostors = this.players.filter(p => p.isImpostor && !p.isEliminated);
    if (remainingImpostors.length === 0) {
      // All impostors eliminated and word guess failed -> Civilians Win!
      this.winner = 'CIVIL';
      this.winReason = `¡Los Civiles ganan! Todos los impostores han sido descubiertos y no pudieron adivinar la palabra secreta.`;
      this.setState(GAME_STATES.GAME_OVER);
    } else {
      // There is still another impostor in play, continue game!
      this.startCluesPhase();
    }
  }

  continueAfterCivilianEliminated() {
    const remainingCivilians = this.players.filter(p => !p.isImpostor && !p.isEliminated);
    const remainingImpostors = this.players.filter(p => p.isImpostor && !p.isEliminated);

    // If impostors equal or outnumber civilians, Impostors automatically win!
    if (remainingImpostors.length >= remainingCivilians.length) {
      this.winner = 'IMPOSTOR';
      this.winReason = `¡Los Impostores ganan! Han logrado camuflarse y superar en número a los civiles supervivientes.`;
      this.setState(GAME_STATES.GAME_OVER);
    } else {
      // Civilians still have the majority, next round of clues and debate!
      this.startCluesPhase();
    }
  }

  endGameWithImpostorVictory(reason = null) {
    this.winner = 'IMPOSTOR';
    this.winReason = reason || `¡Victoria del Impostor! Los civiles eliminaron a un inocente.`;
    this.setState(GAME_STATES.GAME_OVER);
  }

  // Utility to normalize words (lowercase, remove accents/diacritics, trim spaces)
  normalizeWord(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  // Reset to Play Again (keeps same player list & configuration)
  restartGame() {
    this.startGame();
  }

  // Return to Lobby
  resetToLobby() {
    this.state = GAME_STATES.LOBBY;
    this.players = [];
    this.currentPair = null;
    this.winner = null;
    this.winReason = '';
    this.eliminatedPlayer = null;
    this.selectedSuspectId = null;
    this.setState(GAME_STATES.LOBBY);
  }
}
