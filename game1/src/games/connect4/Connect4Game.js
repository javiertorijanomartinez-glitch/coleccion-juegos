import { Connect4AI } from './Connect4AI.js';
import { sound } from '../../core/SoundFX.js';
import { Haptics } from '../../core/Haptics.js';
import { StorageManager } from '../../core/Storage.js';

export class Connect4Game {
  constructor(container, onShowModal) {
    this.container = container;
    this.onShowModal = onShowModal;
    this.grid = Array(6).fill(null).map(() => Array(7).fill(0)); // 0: vacio, 1: rojo, 2: amarillo
    this.currentPlayer = 1; // 1 = Rojo (P1), 2 = Amarillo (P2 / CPU)
    this.gameMode = '1p'; // '1p' o '2p'
    this.isLocked = false;
    this.stats = StorageManager.getStats('connect4');
  }

  mount() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="game-hud">
        <div class="hud-top">
          <div class="mode-selector">
            <button class="mode-btn ${this.gameMode === '1p' ? 'active' : ''}" data-mode="1p">1P vs CPU</button>
            <button class="mode-btn ${this.gameMode === '2p' ? 'active' : ''}" data-mode="2p">2 Jugadores</button>
          </div>
          <div class="scoreboard">
            <span class="score-item" style="color: #ef4444;">🔴: <b id="c4-score-p1">${this.stats.p1Wins}</b></span>
            <span class="score-item" style="color: #fbbf24;">🟡: <b id="c4-score-p2">${this.stats.p2Wins}</b></span>
            <span class="score-item" style="color: #94a3b8;">Empates: <b id="c4-score-ties">${this.stats.ties}</b></span>
          </div>
        </div>
        <div class="turn-banner" id="c4-turn-banner">
          <span class="turn-pill" style="background: ${this.currentPlayer === 1 ? '#ef4444' : '#fbbf24'};"></span>
          <span id="c4-turn-text">Turno de: <b>Rojas (Tú)</b></span>
        </div>
      </div>

      <div class="game-play-area">
        <div class="c4-container">
          <!-- Botones superiores de soltar ficha en columna -->
          <div class="c4-col-selectors" id="c4-col-selectors">
            ${Array(7).fill(0).map((_, col) => `
              <button class="c4-col-btn" data-col="${col}" aria-label="Columna ${col + 1}">▼</button>
            `).join('')}
          </div>

          <!-- Tablero azul perforado con ranuras -->
          <div class="c4-board-chassis" id="c4-chassis">
            <div class="c4-grid">
              ${this.grid.map((row, r) => 
                row.map((val, c) => `
                  <div class="c4-slot" data-row="${r}" data-col="${c}">
                    ${val !== 0 ? `<div class="c4-piece ${val === 1 ? 'red' : 'yellow'}"></div>` : ''}
                  </div>
                `).join('')
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Selector de modo
    const modeBtns = this.container.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const newMode = e.target.dataset.mode;
        if (newMode !== this.gameMode) {
          this.gameMode = newMode;
          sound.playClick();
          this.reset();
        }
      });
    });

    // Clic en selectores de columna superiores
    const colBtns = this.container.querySelectorAll('.c4-col-btn');
    colBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const col = parseInt(btn.dataset.col, 10);
        this.dropInColumn(col);
      });
    });

    // Clic directo en cualquier ranura del tablero
    const chassis = this.container.querySelector('#c4-chassis');
    chassis.addEventListener('click', (e) => {
      const slot = e.target.closest('.c4-slot');
      if (!slot) return;
      const col = parseInt(slot.dataset.col, 10);
      this.dropInColumn(col);
    });
  }

  dropInColumn(col) {
    if (this.isLocked || isNaN(col)) return;

    // Buscar la fila libre más baja
    const targetRow = Connect4AI.getNextOpenRow(this.grid, col);
    if (targetRow === -1) return; // Columna llena

    this.placePiece(targetRow, col, this.currentPlayer);

    const winInfo = this.checkWin(this.currentPlayer);
    if (winInfo) {
      this.handleWin(winInfo);
      return;
    }

    if (this.isGridFull()) {
      this.handleDraw();
      return;
    }

    // Cambiar de turno
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.updateTurnDisplay();

    // Turno de la CPU
    if (this.gameMode === '1p' && this.currentPlayer === 2) {
      this.isLocked = true;
      setTimeout(() => {
        const cpuCol = Connect4AI.getBestMove(this.grid);
        if (cpuCol !== null) {
          const cpuRow = Connect4AI.getNextOpenRow(this.grid, cpuCol);
          if (cpuRow !== -1) {
            this.placePiece(cpuRow, cpuCol, 2);
            const cpuWin = this.checkWin(2);
            if (cpuWin) {
              this.handleWin(cpuWin);
            } else if (this.isGridFull()) {
              this.handleDraw();
            } else {
              this.currentPlayer = 1;
              this.updateTurnDisplay();
              this.isLocked = false;
            }
          }
        }
      }, 450);
    }
  }

  placePiece(row, col, player) {
    this.grid[row][col] = player;
    const slot = this.container.querySelector(`.c4-slot[data-row="${row}"][data-col="${col}"]`);
    if (slot) {
      slot.innerHTML = `<div class="c4-piece ${player === 1 ? 'red' : 'yellow'}"></div>`;
    }
    sound.playDrop();
    Haptics.bump();
  }

  updateTurnDisplay() {
    const turnText = this.container.querySelector('#c4-turn-text');
    const pill = this.container.querySelector('.turn-pill');
    if (!turnText || !pill) return;

    const colorHex = this.currentPlayer === 1 ? '#ef4444' : '#fbbf24';
    pill.style.background = colorHex;
    pill.style.boxShadow = `0 0 8px ${colorHex}`;

    if (this.gameMode === '1p') {
      turnText.innerHTML = this.currentPlayer === 1 
        ? 'Tu turno (<b>Rojas 🔴</b>)' 
        : 'Pensando CPU... (<b>Amarillas 🟡</b>)';
    } else {
      turnText.innerHTML = `Turno de: <b>${this.currentPlayer === 1 ? 'Jugador 1 🔴' : 'Jugador 2 🟡'}</b>`;
    }
  }

  checkWin(player) {
    // Horizontal
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === player && this.grid[r][c+1] === player && this.grid[r][c+2] === player && this.grid[r][c+3] === player) {
          return { player, slots: [[r,c], [r,c+1], [r,c+2], [r,c+3]] };
        }
      }
    }
    // Vertical
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        if (this.grid[r][c] === player && this.grid[r+1][c] === player && this.grid[r+2][c] === player && this.grid[r+3][c] === player) {
          return { player, slots: [[r,c], [r+1,c], [r+2,c], [r+3,c]] };
        }
      }
    }
    // Diagonal \
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === player && this.grid[r+1][c+1] === player && this.grid[r+2][c+2] === player && this.grid[r+3][c+3] === player) {
          return { player, slots: [[r,c], [r+1,c+1], [r+2,c+2], [r+3,c+3]] };
        }
      }
    }
    // Diagonal /
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === player && this.grid[r-1][c+1] === player && this.grid[r-2][c+2] === player && this.grid[r-3][c+3] === player) {
          return { player, slots: [[r,c], [r-1,c+1], [r-2,c+2], [r-3,c+3]] };
        }
      }
    }
    return null;
  }

  isGridFull() {
    return this.grid[0].every(cell => cell !== 0);
  }

  handleWin(winInfo) {
    this.isLocked = true;
    winInfo.slots.forEach(([r, c]) => {
      const slot = this.container.querySelector(`.c4-slot[data-row="${r}"][data-col="${c}"] .c4-piece`);
      if (slot) slot.classList.add('win-piece');
    });

    sound.playWin();
    Haptics.win();

    this.stats = StorageManager.recordWin('connect4', winInfo.player === 1 ? 'p1' : 'p2');
    this.updateScores();

    setTimeout(() => {
      const winnerTitle = this.gameMode === '1p'
        ? (winInfo.player === 1 ? '¡Has ganado!' : '¡Ha ganado la CPU!')
        : `¡Jugador ${winInfo.player} ha ganado!`;

      this.onShowModal({
        icon: winInfo.player === 1 ? '🏆' : '🤖',
        title: winnerTitle,
        desc: `¡4 en raya conseguido con éxito!`,
        onRetry: () => this.reset()
      });
    }, 700);
  }

  handleDraw() {
    this.isLocked = true;
    sound.playClick();
    this.stats = StorageManager.recordWin('connect4', 'tie');
    this.updateScores();

    setTimeout(() => {
      this.onShowModal({
        icon: '🤝',
        title: '¡Tablero Lleno!',
        desc: 'Nadie ha conseguido conectar cuatro fichas esta vez.',
        onRetry: () => this.reset()
      });
    }, 400);
  }

  updateScores() {
    const elP1 = this.container.querySelector('#c4-score-p1');
    const elP2 = this.container.querySelector('#c4-score-p2');
    const elT = this.container.querySelector('#c4-score-ties');
    if (elP1) elP1.textContent = this.stats.p1Wins;
    if (elP2) elP2.textContent = this.stats.p2Wins;
    if (elT) elT.textContent = this.stats.ties;
  }

  reset() {
    this.grid = Array(6).fill(null).map(() => Array(7).fill(0));
    this.currentPlayer = 1;
    this.isLocked = false;
    this.render();
    this.bindEvents();
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
