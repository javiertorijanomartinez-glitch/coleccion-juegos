/* ==========================================================================
   IMPOSTOR - Main Entrypoint & View Controller
   ========================================================================== */

import { GameEngine, GAME_STATES } from './core/GameEngine.js';
import { sound } from './audio/soundEngine.js';

import { LobbyView } from './ui/LobbyView.js';
import { RevealView } from './ui/RevealView.js';
import { CluesView } from './ui/CluesView.js';
import { DebateView } from './ui/DebateView.js';
import { VotingView } from './ui/VotingView.js';
import { ResolutionView } from './ui/ResolutionView.js';
import { GuessView } from './ui/GuessView.js';
import { GameOverView } from './ui/GameOverView.js';

class ImpostorApp {
  constructor() {
    this.appRoot = document.getElementById('app');
    this.engine = new GameEngine();

    // Instantiate View Controllers
    this.views = {
      [GAME_STATES.LOBBY]: new LobbyView(this.engine),
      [GAME_STATES.REVEAL]: new RevealView(this.engine),
      [GAME_STATES.CLUES]: new CluesView(this.engine),
      [GAME_STATES.DEBATE]: new DebateView(this.engine),
      [GAME_STATES.VOTING]: new VotingView(this.engine),
      [GAME_STATES.RESOLUTION]: new ResolutionView(this.engine),
      [GAME_STATES.GUESS]: new GuessView(this.engine),
      [GAME_STATES.GAME_OVER]: new GameOverView(this.engine)
    };

    this.init();
  }

  init() {
    // Audio unlock on first touch/click
    const unlockAudio = () => {
      sound.initContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // Listen to Engine State Changes
    this.engine.onStateChange((state) => {
      this.renderState(state);
    });

    // Initial render
    this.renderState(this.engine.state);
  }

  renderState(state) {
    const view = this.views[state];
    if (view && typeof view.render === 'function') {
      window.scrollTo(0, 0);
      view.render(this.appRoot);
    } else {
      console.error(`No view found for state: ${state}`);
    }
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ImpostorApp();
});
