import { TicTacToeAI } from './TicTacToeAI.js';
import { sound } from '../../core/SoundFX.js';
import { Haptics } from '../../core/Haptics.js';
import { StorageManager } from '../../core/Storage.js';

export class TicTacToeGame {
  constructor(container, onShowModal) {
    this.container = container;
    this.onShowModal = onShowModal;
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X'; // X empieza siempre
    this.gameMode = '1p'; // '1p' (vs CPU) o '2p' (local)
    this.difficulty = 'hard';
    this.isLocked = false;
    this.stats = StorageManager.getStats('tictactoe');
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
            <span class="score-item" style="color: #38bdf8;">X: <b id="ttt-score-x">${this.stats.p1Wins}</b></span>
            <span class="score-item" style="color: #f43f5e;">O: <b id="ttt-score-o">${this.stats.p2Wins}</b></span>
            <span class="score-item" style="color: #94a3b8;">Empates: <b id="ttt-score-ties">${this.stats.ties}</b></span>
          </div>
        </div>
        <div class="turn-banner" id="ttt-turn-banner">
          <span class="turn-pill"></span>
          <span id="turn-text">Turno de: <b>Jugador X</b></span>
        </div>
      </div>

      <div class="game-play-area">
        <div class="ttt-container">
          <div class="ttt-board" id="ttt-grid">
            ${this.board.map((val, idx) => `
              <div class="ttt-cell ${val ? val.toLowerCase() : ''}" data-index="${idx}">
                ${val || ''}
              </div>
            `).join('')}
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

    // Celdas del tablero
    const grid = this.container.querySelector('#ttt-grid');
    grid.addEventListener('click', (e) => {
      const cell = e.target.closest('.ttt-cell');
      if (!cell || this.isLocked) return;
      const index = parseInt(cell.dataset.index, 10);
      this.handleCellClick(index);
    });
  }

  handleCellClick(index) {
    if (this.board[index] || this.isLocked) return;

    this.makeMove(index, this.currentPlayer);

    const winInfo = this.checkWin();
    if (winInfo) {
      this.handleWin(winInfo);
      return;
    }

    if (this.board.every(cell => cell !== null)) {
      this.handleDraw();
      return;
    }

    // Cambiar turno
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.updateTurnDisplay();

    // Turno de la CPU
    if (this.gameMode === '1p' && this.currentPlayer === 'O') {
      this.isLocked = true;
      setTimeout(() => {
        const cpuMove = TicTacToeAI.getBestMove(this.board, this.difficulty);
        if (cpuMove !== null) {
          this.makeMove(cpuMove, 'O');
          const cpuWin = this.checkWin();
          if (cpuWin) {
            this.handleWin(cpuWin);
          } else if (this.board.every(cell => cell !== null)) {
            this.handleDraw();
          } else {
            this.currentPlayer = 'X';
            this.updateTurnDisplay();
            this.isLocked = false;
          }
        }
      }, 400);
    }
  }

  makeMove(index, player) {
    this.board[index] = player;
    const cell = this.container.querySelector(`.ttt-cell[data-index="${index}"]`);
    if (cell) {
      cell.textContent = player;
      cell.classList.add(player.toLowerCase());
    }
    sound.playMove();
    Haptics.tap();
  }

  updateTurnDisplay() {
    const turnText = this.container.querySelector('#turn-text');
    if (!turnText) return;

    if (this.gameMode === '1p') {
      turnText.innerHTML = this.currentPlayer === 'X' 
        ? 'Tu turno (<b>X</b>)' 
        : 'Pensando la CPU... (<b>O</b>)';
    } else {
      turnText.innerHTML = `Turno de: <b>Jugador ${this.currentPlayer}</b>`;
    }
  }

  checkWin() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return { winner: this.board[a], line: [a, b, c] };
      }
    }
    return null;
  }

  handleWin(winInfo) {
    this.isLocked = true;
    winInfo.line.forEach(idx => {
      const cell = this.container.querySelector(`.ttt-cell[data-index="${idx}"]`);
      if (cell) cell.classList.add('win-highlight');
    });

    sound.playWin();
    Haptics.win();

    this.stats = StorageManager.recordWin('tictactoe', winInfo.winner === 'X' ? 'p1' : 'p2');
    this.updateScores();

    setTimeout(() => {
      const winnerName = this.gameMode === '1p'
        ? (winInfo.winner === 'X' ? '¡Has ganado!' : '¡La CPU ha ganado!')
        : `¡Jugador ${winInfo.winner} ha ganado!`;

      this.onShowModal({
        icon: winInfo.winner === 'X' ? '🏆' : '🤖',
        title: winnerName,
        desc: `¡Gran partida! Tres en raya completado.`,
        onRetry: () => this.reset()
      });
    }, 600);
  }

  handleDraw() {
    this.isLocked = true;
    sound.playClick();
    this.stats = StorageManager.recordWin('tictactoe', 'tie');
    this.updateScores();

    setTimeout(() => {
      this.onShowModal({
        icon: '🤝',
        title: '¡Tablas / Empate!',
        desc: 'Nadie ha conseguido hacer tres en raya en esta ronda.',
        onRetry: () => this.reset()
      });
    }, 400);
  }

  updateScores() {
    const elX = this.container.querySelector('#ttt-score-x');
    const elO = this.container.querySelector('#ttt-score-o');
    const elT = this.container.querySelector('#ttt-score-ties');
    if (elX) elX.textContent = this.stats.p1Wins;
    if (elO) elO.textContent = this.stats.p2Wins;
    if (elT) elT.textContent = this.stats.ties;
  }

  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.isLocked = false;
    this.render();
    this.bindEvents();
  }

  destroy() {
    this.container.innerHTML = '';
  }
}
