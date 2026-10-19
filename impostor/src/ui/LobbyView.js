/* ==========================================================================
   IMPOSTOR - Lobby View (Game Setup & Configuration)
   ========================================================================== */

import { CATEGORIES } from '../data/defaultWords.js';
import { CustomWordsStore } from '../data/customWordsStore.js';
import { sound } from '../audio/soundEngine.js';
import { RulesModal } from './RulesModal.js';
import { CustomWordsModal } from './CustomWordsModal.js';

export class LobbyView {
  constructor(engine) {
    this.engine = engine;
    this.showPlayerNames = false;
  }

  render(container) {
    container.innerHTML = `
      <div class="view-container anim-fade-in-up">
        <!-- Header -->
        <header class="app-header">
          <div class="header-brand">
            <div class="header-logo">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.82.62-3.49 1.64-4.83 1.43 1.83 3.61 3.01 6.09 3.06-.8 1.1-1.33 2.4-1.55 3.82-.41-.12-.84-.2-1.29-.2-2.21 0-4 1.79-4 4 0 .39.06.77.16 1.12C6.88 19.46 9.3 20 12 20zm5.84-2.88c-.61-.98-1.52-1.74-2.61-2.17.2-.67.32-1.38.32-2.11 0-1.82-.62-3.49-1.64-4.83 2.48-.05 4.66-1.23 6.09-3.06C21.38 6.51 22 8.18 22 10c0 3.28-1.82 6.13-4.16 7.12z"/></svg>
            </div>
            <h1 class="app-title">Impostor</h1>
          </div>
          <div class="header-actions">
            <button id="custom-words-btn" class="icon-btn" title="Palabras Personalizadas" aria-label="Palabras Personalizadas">
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button id="rules-btn" class="icon-btn" title="Reglas del juego" aria-label="Reglas">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 11.9 12 12.5 12 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
            </button>
            <button id="sound-btn" class="icon-btn" title="Activar/Silenciar sonido" aria-label="Sonido">
              <svg id="sound-icon" viewBox="0 0 24 24"><path d="${sound.isSoundEnabled() ? 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' : 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'}"/></svg>
            </button>
          </div>
        </header>

        <!-- Main Configuration Card -->
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px;">
          
          <!-- Players & Impostors Steppers -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="glass-card" style="padding: 14px;">
              <span class="stepper-label">Jugadores</span>
              <div class="stepper-control" style="margin-top: 8px;">
                <button id="dec-players" class="stepper-btn" ${this.engine.playerCount <= 3 ? 'disabled' : ''}>-</button>
                <div class="stepper-value">
                  <span id="players-val" class="stepper-number">${this.engine.playerCount}</span>
                </div>
                <button id="inc-players" class="stepper-btn" ${this.engine.playerCount >= 12 ? 'disabled' : ''}>+</button>
              </div>
            </div>

            <div class="glass-card" style="padding: 14px;">
              <span class="stepper-label" style="color: var(--crimson);">Impostores</span>
              <div class="stepper-control" style="margin-top: 8px; border-color: rgba(255, 45, 85, 0.3);">
                <button id="dec-impostors" class="stepper-btn" ${this.engine.impostorCount <= 1 ? 'disabled' : ''}>-</button>
                <div class="stepper-value">
                  <span id="impostors-val" class="stepper-number" style="color: var(--crimson);">${this.engine.impostorCount}</span>
                </div>
                <button id="inc-impostors" class="stepper-btn" ${this.engine.impostorCount >= Math.min(3, Math.floor((this.engine.playerCount - 1) / 2)) ? 'disabled' : ''}>+</button>
              </div>
            </div>
          </div>

          <!-- Game Mode Selector -->
          <div class="glass-card" style="padding: 14px;">
            <span class="stepper-label">Modo de Juego para el Impostor</span>
            <div class="segmented-control" style="margin-top: 8px;">
              <button id="mode-classic" class="segmented-btn ${this.engine.mode === 'classic' ? 'active' : ''}">
                <span>Modo Clásico</span>
                <span class="sub-text">"Eres el Impostor" (Sin palabra)</span>
              </button>
              <button id="mode-trap" class="segmented-btn ${this.engine.mode === 'trap' ? 'active' : ''}">
                <span>Palabra Trampa</span>
                <span class="sub-text">Palabra similar señuelo</span>
              </button>
            </div>
          </div>

          <!-- Category Selector -->
          <div class="glass-card" style="padding: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span class="stepper-label">Categoría de Palabras</span>
              <button id="manage-custom-words-link" style="background: none; border: none; color: var(--cyan); font-size: 0.76rem; font-weight: 700; cursor: pointer;">
                + Añadir propias
              </button>
            </div>
            <div class="categories-grid" id="categories-container">
              ${CATEGORIES.map(cat => `
                <button class="category-chip ${this.engine.categoryId === cat.id ? 'active' : ''}" data-cat-id="${cat.id}">
                  <span class="chip-icon">${cat.icon}</span>
                  <span>${cat.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Debate Timer & Clue Rounds Settings -->
          <div class="glass-card" style="padding: 14px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <span class="stepper-label">Tiempo de Debate</span>
                <select id="timer-select" class="text-input" style="margin-top: 6px; padding: 8px; font-weight: 700;">
                  <option value="30" ${this.engine.debateDuration === 30 ? 'selected' : ''}>30 seg</option>
                  <option value="60" ${this.engine.debateDuration === 60 ? 'selected' : ''}>60 seg</option>
                  <option value="90" ${this.engine.debateDuration === 90 ? 'selected' : ''}>90 seg (Recomendado)</option>
                  <option value="120" ${this.engine.debateDuration === 120 ? 'selected' : ''}>120 seg</option>
                  <option value="0" ${this.engine.debateDuration === 0 ? 'selected' : ''}>Sin límite</option>
                </select>
              </div>

              <div>
                <span class="stepper-label">Rondas de Pistas</span>
                <select id="rounds-select" class="text-input" style="margin-top: 6px; padding: 8px; font-weight: 700;">
                  <option value="1" ${this.engine.totalClueRounds === 1 ? 'selected' : ''}>1 Ronda</option>
                  <option value="2" ${this.engine.totalClueRounds === 2 ? 'selected' : ''}>2 Rondas</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Player Names Customization (Collapsible) -->
          <div class="glass-card" style="padding: 14px;">
            <button id="toggle-player-names-btn" style="width: 100%; display: flex; align-items: center; justify-content: space-between; background: none; border: none; color: var(--text-main); font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; cursor: pointer;">
              <span>Personalizar nombres (${this.engine.playerCount} jugadores)</span>
              <span id="player-names-chevron">${this.showPlayerNames ? '▲' : '▼'}</span>
            </button>
            <div id="player-names-list" class="player-list" style="margin-top: 10px; display: ${this.showPlayerNames ? 'flex' : 'none'};">
              ${Array.from({ length: this.engine.playerCount }, (_, i) => `
                <div class="player-item">
                  <div class="player-avatar" style="background: ${this.engine.players[i]?.color || '#ff2d55'};">
                    ${i + 1}
                  </div>
                  <input type="text" class="player-name-input" data-player-idx="${i}" value="${this.engine.getPlayerName(i)}" placeholder="Jugador ${i + 1}" maxlength="20" />
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Start Game CTA Button -->
        <button id="start-game-btn" class="btn btn-primary anim-pulse-glow" style="margin-top: auto; font-size: 1.15rem;">
          <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>
          ¡Comenzar Partida!
        </button>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    // Sound Toggle
    const soundBtn = container.querySelector('#sound-btn');
    const soundIcon = container.querySelector('#sound-icon');
    soundBtn.addEventListener('click', () => {
      const enabled = sound.toggleSound();
      soundIcon.querySelector('path').setAttribute('d', enabled ? 
        'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z' :
        'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'
      );
    });

    // Rules Modal
    container.querySelector('#rules-btn').addEventListener('click', () => {
      sound.playTap();
      RulesModal.render();
    });

    // Custom Words Modal
    const openCustomWords = () => {
      sound.playTap();
      CustomWordsModal.render(() => {
        // Callback if words modified
      });
    };
    container.querySelector('#custom-words-btn').addEventListener('click', openCustomWords);
    container.querySelector('#manage-custom-words-link').addEventListener('click', openCustomWords);

    // Steppers: Players
    const decPlayers = container.querySelector('#dec-players');
    const incPlayers = container.querySelector('#inc-players');
    const playersVal = container.querySelector('#players-val');
    const decImpostors = container.querySelector('#dec-impostors');
    const incImpostors = container.querySelector('#inc-impostors');
    const impostorsVal = container.querySelector('#impostors-val');

    decPlayers.addEventListener('click', () => {
      sound.playTap();
      this.engine.setPlayerCount(this.engine.playerCount - 1);
      this.render(container);
    });

    incPlayers.addEventListener('click', () => {
      sound.playTap();
      this.engine.setPlayerCount(this.engine.playerCount + 1);
      this.render(container);
    });

    // Steppers: Impostors
    decImpostors.addEventListener('click', () => {
      sound.playTap();
      this.engine.setImpostorCount(this.engine.impostorCount - 1);
      this.render(container);
    });

    incImpostors.addEventListener('click', () => {
      sound.playTap();
      this.engine.setImpostorCount(this.engine.impostorCount + 1);
      this.render(container);
    });

    // Mode Selector
    const modeClassic = container.querySelector('#mode-classic');
    const modeTrap = container.querySelector('#mode-trap');

    modeClassic.addEventListener('click', () => {
      sound.playTap();
      this.engine.setMode('classic');
      modeClassic.classList.add('active');
      modeTrap.classList.remove('active');
    });

    modeTrap.addEventListener('click', () => {
      sound.playTap();
      this.engine.setMode('trap');
      modeTrap.classList.add('active');
      modeClassic.classList.remove('active');
    });

    // Categories
    container.querySelectorAll('.category-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sound.playTap();
        const catId = chip.getAttribute('data-cat-id');
        this.engine.setCategory(catId);
        container.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Debate Timer & Rounds
    container.querySelector('#timer-select').addEventListener('change', (e) => {
      this.engine.setDebateDuration(parseInt(e.target.value, 10));
    });

    container.querySelector('#rounds-select').addEventListener('change', (e) => {
      this.engine.setClueRounds(parseInt(e.target.value, 10));
    });

    // Toggle Player Names
    const toggleNamesBtn = container.querySelector('#toggle-player-names-btn');
    toggleNamesBtn.addEventListener('click', () => {
      sound.playTap();
      this.showPlayerNames = !this.showPlayerNames;
      const list = container.querySelector('#player-names-list');
      const chevron = container.querySelector('#player-names-chevron');
      list.style.display = this.showPlayerNames ? 'flex' : 'none';
      chevron.textContent = this.showPlayerNames ? '▲' : '▼';
    });

    // Name Inputs
    container.querySelectorAll('.player-name-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-player-idx'), 10);
        this.engine.setPlayerName(idx, e.target.value);
      });
    });

    // Start Game
    container.querySelector('#start-game-btn').addEventListener('click', () => {
      sound.playTap();
      try {
        this.engine.startGame();
      } catch (err) {
        alert(err.message || 'Error al iniciar la partida');
      }
    });
  }
}
