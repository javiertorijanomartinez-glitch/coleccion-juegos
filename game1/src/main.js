import { GAME_CATALOG } from './core/GameRegistry.js';
import { sound } from './core/SoundFX.js';
import { Haptics } from './core/Haptics.js';

class App {
  constructor() {
    this.currentGame = null;
    this.activeGameId = null;

    // Elementos del DOM
    this.screenTitle = document.getElementById('screen-title');
    this.brandBadge = document.querySelector('.brand-badge');
    this.btnBack = document.getElementById('btn-back');
    this.btnRestart = document.getElementById('btn-restart');
    this.btnSound = document.getElementById('btn-sound');
    this.soundIcon = document.getElementById('sound-icon');
    
    this.hubScreen = document.getElementById('hub-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.gameStage = document.getElementById('game-stage');
    this.gamesGrid = document.getElementById('games-grid');

    // Modal
    this.modal = document.getElementById('game-modal');
    this.modalIcon = document.getElementById('modal-icon');
    this.modalTitle = document.getElementById('modal-title');
    this.modalDesc = document.getElementById('modal-desc');
    this.modalBtnRetry = document.getElementById('modal-btn-retry');
    this.modalBtnMenu = document.getElementById('modal-btn-menu');
    this.onModalRetry = null;
  }

  init() {
    this.renderHub();
    this.bindGlobalEvents();
    this.updateSoundIcon();

    // Desbloquear AudioContext en la primera interacción del usuario (requerido por navegadores y móviles)
    const unlockAudio = () => {
      sound.init();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
  }

  renderHub() {
    this.gamesGrid.innerHTML = GAME_CATALOG.map(game => `
      <div class="game-card ${game.available ? '' : 'disabled'}" data-game-id="${game.id}" style="--card-color: ${game.color};">
        <div class="card-icon-wrapper">${game.icon}</div>
        <h3 class="card-title">${game.title}</h3>
        <p class="card-meta">${game.subtitle}</p>
        <span class="card-badge">${game.badge}</span>
      </div>
    `).join('');

    // Asignar clics a las tarjetas
    this.gamesGrid.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.dataset.gameId;
        const gameConfig = GAME_CATALOG.find(g => g.id === gameId);
        if (!gameConfig || !gameConfig.available) {
          sound.playTrap();
          Haptics.bump();
          return;
        }
        sound.playClick();
        Haptics.tap();
        this.launchGame(gameConfig);
      });
    });
  }

  bindGlobalEvents() {
    // Botón volver al menú
    this.btnBack.addEventListener('click', () => {
      sound.playClick();
      Haptics.tap();
      this.closeGame();
    });

    // Botón reiniciar
    this.btnRestart.addEventListener('click', () => {
      if (this.currentGame && typeof this.currentGame.reset === 'function') {
        sound.playClick();
        Haptics.tap();
        this.currentGame.reset();
      }
    });

    // Botón sonido
    this.btnSound.addEventListener('click', () => {
      const enabled = sound.toggle();
      this.updateSoundIcon();
    });

    // Botones del Modal
    this.modalBtnRetry.addEventListener('click', () => {
      this.hideModal();
      sound.playClick();
      if (this.onModalRetry) this.onModalRetry();
    });

    this.modalBtnMenu.addEventListener('click', () => {
      this.hideModal();
      sound.playClick();
      this.closeGame();
    });
  }

  updateSoundIcon() {
    this.soundIcon.textContent = sound.enabled ? '🔊' : '🔇';
    this.btnSound.title = sound.enabled ? 'Sonido activado' : 'Sonido silenciado';
  }

  launchGame(gameConfig) {
    this.activeGameId = gameConfig.id;
    this.screenTitle.textContent = gameConfig.title;
    this.brandBadge.textContent = gameConfig.badge;

    this.btnBack.classList.remove('hidden');
    this.btnRestart.classList.remove('hidden');

    this.hubScreen.classList.remove('active');
    this.gameScreen.classList.add('active');

    // Limpiar juego previo
    if (this.currentGame && typeof this.currentGame.destroy === 'function') {
      this.currentGame.destroy();
    }
    this.gameStage.innerHTML = '';

    // Instanciar y montar nuevo juego
    const GameClass = gameConfig.gameClass;
    this.currentGame = new GameClass(this.gameStage, (modalData) => {
      this.showModal(modalData);
    });
    this.currentGame.mount();
  }

  closeGame() {
    if (this.currentGame && typeof this.currentGame.destroy === 'function') {
      this.currentGame.destroy();
    }
    this.currentGame = null;
    this.activeGameId = null;

    this.screenTitle.textContent = 'Juegos Clásicos';
    this.brandBadge.textContent = '🎲 INFANCIA';
    this.btnBack.classList.add('hidden');
    this.btnRestart.classList.add('hidden');

    this.gameScreen.classList.remove('active');
    this.hubScreen.classList.add('active');
  }

  showModal({ icon, title, desc, onRetry }) {
    this.modalIcon.textContent = icon || '🏆';
    this.modalTitle.textContent = title;
    this.modalDesc.textContent = desc;
    this.onModalRetry = onRetry;
    this.modal.classList.remove('hidden');
  }

  hideModal() {
    this.modal.classList.add('hidden');
    this.onModalRetry = null;
  }
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
