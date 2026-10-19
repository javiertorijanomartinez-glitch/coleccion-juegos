import { OCA_SQUARES, DICE_FACES } from './OcaRules.js';
import { sound } from '../../core/SoundFX.js';
import { Haptics } from '../../core/Haptics.js';
import { StorageManager } from '../../core/Storage.js';

export class OcaGame {
  constructor(container, onShowModal) {
    this.container = container;
    this.onShowModal = onShowModal;
    this.gameMode = '1p'; // '1p' vs Bot o '2p'
    this.players = [
      { id: 1, name: 'Jugador 1 (Rojo)', color: '#ef4444', class: 'p1', numLabel: '1', pos: 1, penalty: 0 },
      { id: 2, name: 'Bot Rival (Azul)', color: '#3b82f6', class: 'p2', numLabel: '2', pos: 1, penalty: 0 }
    ];
    this.currentTurnIndex = 0;
    this.isRolling = false;
    this.isMovingSteps = false;
    this.currentDiceValue = 1;
    this.stepInterval = null;
    this.stats = StorageManager.getStats('oca');
  }

  mount() {
    this.container.classList.add('oca-active');
    this.render();
    this.bindEvents();
    this.updateTokensOnBoard();
    this.updateDiceState();
  }

  getSerpentineOrder() {
    const rows = 9;
    const cols = 7;
    const order = [];

    for (let r = 0; r < rows; r++) {
      const rowNums = [];
      for (let c = 1; c <= cols; c++) {
        rowNums.push(r * cols + c);
      }
      if (r % 2 === 1) {
        rowNums.reverse();
      }
      order.push(...rowNums);
    }
    return order;
  }

  render() {
    const serpentineCells = this.getSerpentineOrder();

    this.container.innerHTML = `
      <div class="game-hud">
        <div class="hud-top">
          <div class="mode-selector">
            <button class="mode-btn ${this.gameMode === '1p' ? 'active' : ''}" data-mode="1p">1P vs Bot</button>
            <button class="mode-btn ${this.gameMode === '2p' ? 'active' : ''}" data-mode="2p">2 Jugadores</button>
          </div>
          <div class="scoreboard">
            <span class="score-item" style="color: #ef4444;">🔴 P1: <b id="oca-score-p1">${this.stats.p1Wins}</b></span>
            <span class="score-item" style="color: #3b82f6;">🔵 P2: <b id="oca-score-p2">${this.stats.p2Wins}</b></span>
          </div>
        </div>
      </div>

      <div class="oca-wrapper">
        <!-- Tablero 100% visible en pantalla completa sin desplazamiento -->
        <div class="oca-board-container" id="oca-board-container">
          <div class="oca-board-grid" id="oca-grid">
            ${serpentineCells.map(num => {
              const square = OCA_SQUARES[num];
              const cellClass = square.type !== 'normal' ? `type-${square.type}` : '';
              return `
                <div class="oca-cell ${cellClass}" data-num="${num}" id="cell-${num}">
                  <span class="oca-cell-num">${num}</span>
                  ${square.badge ? `<span class="oca-cell-badge">${square.badge}</span>` : ''}
                  <span class="oca-cell-icon">${square.icon}</span>
                  <div class="oca-tokens-container" id="tokens-${num}"></div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Controlador del dado con borde dinámico según el jugador -->
        <div class="oca-floating-controller">
          <div class="oca-status-bubble" id="oca-status-msg">
            <b>🔴 Tu turno:</b> ¡Toca el dado para tirar!
          </div>
          <button id="oca-dice-action" class="dice-btn-action ready" aria-label="Tirar dado">
            <div class="dice-wrapper" id="dice-wrapper">
              <span id="dice-face">${DICE_FACES[this.currentDiceValue - 1]}</span>
            </div>
            <span class="dice-action-label" id="dice-action-label">¡TIRA!</span>
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const modeBtns = this.container.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const newMode = e.target.dataset.mode;
        if (newMode !== this.gameMode) {
          this.gameMode = newMode;
          this.players[1].name = newMode === '1p' ? 'Bot Rival (Azul)' : 'Jugador 2 (Azul)';
          sound.playClick();
          this.reset();
        }
      });
    });

    const diceAction = this.container.querySelector('#oca-dice-action');
    diceAction.addEventListener('click', () => {
      this.handlePlayerRoll();
    });
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  handlePlayerRoll() {
    if (this.isRolling || this.isMovingSteps) return;

    if (this.gameMode === '1p' && this.currentTurnIndex === 1) return;

    const player = this.getCurrentPlayer();

    if (player.penalty > 0) {
      player.penalty--;
      this.setStatus(`${player.name} cumple castigo (quedan ${player.penalty} turnos). Pasa turno.`);
      sound.playTrap();
      Haptics.trap();
      this.nextTurn();
      return;
    }

    this.rollDiceAndMove(player);
  }

  rollDiceAndMove(player) {
    this.isRolling = true;
    this.updateDiceState();

    const diceWrapper = this.container.querySelector('#dice-wrapper');
    const diceFace = this.container.querySelector('#dice-face');

    diceWrapper.classList.add('rolling');
    sound.playDice();
    Haptics.tap();

    let rollInterval = setInterval(() => {
      const rand = Math.floor(Math.random() * 6);
      diceFace.textContent = DICE_FACES[rand];
    }, 80);

    setTimeout(() => {
      clearInterval(rollInterval);
      diceWrapper.classList.remove('rolling');

      const roll = Math.floor(Math.random() * 6) + 1;
      this.currentDiceValue = roll;
      diceFace.textContent = DICE_FACES[roll - 1];

      this.isRolling = false;
      this.processStepByStepMove(player, roll);
    }, 650);
  }

  // Movimiento paso a paso contando 1, 2, 3...
  processStepByStepMove(player, roll) {
    this.isMovingSteps = true;
    this.updateDiceState();

    const numberWords = ['¡Uno!', '¡Dos!', '¡Tres!', '¡Cuatro!', '¡Cinco!', '¡Seis!'];
    const pathPositions = [];
    let curPos = player.pos;
    let forward = true;

    for (let i = 1; i <= roll; i++) {
      if (curPos === 63) forward = false;
      if (forward) {
        curPos++;
        if (curPos > 63) {
          curPos = 62;
          forward = false;
        }
      } else {
        curPos--;
      }
      pathPositions.push(curPos);
    }

    this.setStatus(`<b>${player.name}</b> saca un <b>${roll}</b>. Iniciando marcha...`);

    // Limpiar cualquier voz previa
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    (async () => {
      for (let i = 0; i < pathPositions.length; i++) {
        if (!this.isMovingSteps) break;
        const stepNum = i + 1;
        player.pos = pathPositions[i];
        this.updateTokensOnBoard();

        // Efecto sonoro musical ascendente por paso
        sound.playStep(stepNum);
        Haptics.tap();

        const word = numberWords[stepNum - 1] || `¡${stepNum}!`;
        this.setStatus(`<b>${player.name}</b>: <b>${word}</b> (Casilla ${player.pos})`);
        
        // Esperar a que la voz termine de pronunciar el número antes del siguiente salto
        await this.speakWord(word, 1.3);
        await this.delay(80); // Pausa rítmica natural entre saltos
      }

      if (this.isMovingSteps) {
        await this.delay(200);
        this.isMovingSteps = false;
        this.finishMove(player, roll);
      }
    })();
  }

  finishMove(player, roll) {
    let msg = `<b>${player.name}</b> llegó a la <b>casilla ${player.pos}</b>. `;

    // Victoria en 63
    if (player.pos === 63) {
      this.setStatus(msg + '¡JARDÍN DE LA OCA!');
      this.speak('¡Has ganado!');
      this.handleWin(player);
      return;
    }

    const square = OCA_SQUARES[player.pos];
    if (square && square.type !== 'normal') {
      setTimeout(() => {
        this.handleSpecialSquare(player, square);
      }, 550);
    } else {
      this.setStatus(msg + `(${square.icon} ${square.name}).`);
      setTimeout(() => {
        this.nextTurn();
      }, 750);
    }
  }

  handleSpecialSquare(player, square) {
    this.setStatus(`<b>${square.icon} ${square.msg}</b>`);

    if (square.type === 'oca') {
      sound.playGoose();
      Haptics.win();
      this.speak('De oca a oca');
      player.pos = square.target;
      this.updateTokensOnBoard();

      if (player.pos === 63) {
        this.handleWin(player);
        return;
      }

      // Repite tirada
      setTimeout(() => {
        this.updateDiceState();
        if (this.gameMode === '1p' && this.currentTurnIndex === 1) {
          this.triggerBotTurn();
        }
      }, 850);
      return;
    }

    if (square.type === 'puente') {
      sound.playMove();
      Haptics.bump();
      this.speak('De puente a puente');
      player.pos = square.target;
      this.updateTokensOnBoard();

      // Repite tirada
      setTimeout(() => {
        this.updateDiceState();
        if (this.gameMode === '1p' && this.currentTurnIndex === 1) {
          this.triggerBotTurn();
        }
      }, 850);
      return;
    }

    if (square.penaltyTurns) {
      sound.playTrap();
      Haptics.trap();
      player.penalty = square.penaltyTurns;
    }

    if (square.type === 'laberinto' || square.type === 'muerte') {
      sound.playTrap();
      Haptics.trap();
      this.speak(square.type === 'muerte' ? 'Calavera' : 'Laberinto');
      player.pos = square.target;
      this.updateTokensOnBoard();
    }

    setTimeout(() => {
      this.nextTurn();
    }, 950);
  }

  nextTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    this.updateTokensOnBoard();
    this.updateDiceState();

    const current = this.getCurrentPlayer();
    if (this.gameMode === '1p') {
      if (this.currentTurnIndex === 0) {
        this.setStatus(`<b>🔴 Tu turno:</b> ¡Toca el dado para tirar!`);
      } else {
        this.setStatus(`<b>🤖 Turno del Bot:</b> Tirando dado...`);
        setTimeout(() => this.triggerBotTurn(), 800);
      }
    } else {
      this.setStatus(`<b>Turno de ${current.name}:</b> ¡Toca el dado!`);
    }
  }

  triggerBotTurn() {
    if (this.isRolling || this.isMovingSteps) return;
    const bot = this.players[1];

    if (bot.penalty > 0) {
      bot.penalty--;
      this.setStatus(`${bot.name} está penalizado (${bot.penalty} turnos restantes).`);
      sound.playTrap();
      setTimeout(() => this.nextTurn(), 800);
      return;
    }

    this.rollDiceAndMove(bot);
  }

  updateTokensOnBoard() {
    for (let i = 1; i <= 63; i++) {
      const container = this.container.querySelector(`#tokens-${i}`);
      if (container) container.innerHTML = '';
    }

    this.players.forEach((p, idx) => {
      const container = this.container.querySelector(`#tokens-${p.pos}`);
      if (container) {
        const token = document.createElement('div');
        const isCurrentTurn = idx === this.currentTurnIndex;
        token.className = `oca-token ${p.class} ${isCurrentTurn ? 'active-turn' : ''}`;
        token.textContent = p.numLabel;
        token.title = `${p.name} (Casilla ${p.pos})`;
        container.appendChild(token);
      }
    });
  }

  // Actualiza el dado con el borde del color del jugador en turno
  updateDiceState() {
    const diceAction = this.container.querySelector('#oca-dice-action');
    const diceWrapper = this.container.querySelector('#dice-wrapper');
    const actionLabel = this.container.querySelector('#dice-action-label');
    if (!diceAction || !diceWrapper || !actionLabel) return;

    const current = this.getCurrentPlayer();
    const isHumanTurn = this.gameMode === '2p' || (this.gameMode === '1p' && this.currentTurnIndex === 0);
    const canRoll = !this.isRolling && !this.isMovingSteps && isHumanTurn;

    // Borde dinámico: ROJO para la ficha roja, AZUL para la ficha azul
    diceWrapper.style.setProperty('--dice-player-color', current.color);
    diceWrapper.style.borderColor = current.color;
    diceWrapper.style.borderWidth = '3px';

    if (canRoll) {
      diceAction.classList.add('ready');
      diceWrapper.style.boxShadow = `0 0 16px ${current.color}, 0 6px 16px rgba(0, 0, 0, 0.5)`;
      actionLabel.textContent = '¡TIRA!';
      actionLabel.style.color = current.color;
    } else {
      diceAction.classList.remove('ready');
      diceWrapper.style.boxShadow = `0 0 6px ${current.color}88, 0 4px 10px rgba(0, 0, 0, 0.4)`;
      actionLabel.textContent = (this.isRolling || this.isMovingSteps) ? 'AVANZANDO...' : 'ESPERA';
      actionLabel.style.color = 'var(--text-muted)';
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  speakWord(text, rate = 1.3) {
    return new Promise((resolve) => {
      if (!sound.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setTimeout(resolve, 360);
        return;
      }

      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'es-ES';
        utter.rate = rate;
        utter.pitch = 1.05;

        let finished = false;
        const done = () => {
          if (!finished) {
            finished = true;
            resolve();
          }
        };

        utter.onend = done;
        utter.onerror = done;

        const maxWaitMs = Math.max(480, text.length * 105);
        setTimeout(done, maxWaitMs);

        window.speechSynthesis.speak(utter);
      } catch (_) {
        setTimeout(resolve, 360);
      }
    });
  }

  speak(text) {
    if (!sound.enabled) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'es-ES';
        utter.rate = 1.25;
        utter.pitch = 1.1;
        window.speechSynthesis.speak(utter);
      } catch (_) {}
    }
  }

  setStatus(html) {
    const el = this.container.querySelector('#oca-status-msg');
    if (el) el.innerHTML = html;
  }

  handleWin(winner) {
    this.isRolling = true;
    this.updateDiceState();
    sound.playWin();
    Haptics.win();

    this.stats = StorageManager.recordWin('oca', winner.id === 1 ? 'p1' : 'p2');
    const scoreP1 = this.container.querySelector('#oca-score-p1');
    const scoreP2 = this.container.querySelector('#oca-score-p2');
    if (scoreP1) scoreP1.textContent = this.stats.p1Wins;
    if (scoreP2) scoreP2.textContent = this.stats.p2Wins;

    setTimeout(() => {
      this.onShowModal({
        icon: winner.id === 1 ? '👑' : '🦆',
        title: `¡${winner.name} Gana!`,
        desc: `¡Ha coronado el Jardín de la Oca (casilla 63)!`,
        onRetry: () => this.reset()
      });
    }, 600);
  }

  reset() {
    this.isMovingSteps = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }
    this.players.forEach(p => {
      p.pos = 1;
      p.penalty = 0;
    });
    this.currentTurnIndex = 0;
    this.isRolling = false;
    this.render();
    this.bindEvents();
    this.updateTokensOnBoard();
    this.updateDiceState();
  }

  destroy() {
    this.isMovingSteps = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }
    this.container.classList.remove('oca-active');
    this.container.innerHTML = '';
  }
}
