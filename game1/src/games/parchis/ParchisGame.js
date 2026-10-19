import { PARCHIS_COLORS } from './ParchisRules.js';
import { ParchisBoardSVG } from './ParchisBoardSVG.js';
import { ParchisAI } from './ParchisAI.js';
import { sound } from '../../core/SoundFX.js';
import { Haptics } from '../../core/Haptics.js';
import { StorageManager } from '../../core/Storage.js';

export class ParchisGame {
  constructor(container, onShowModal) {
    this.container = container;
    this.onShowModal = onShowModal;
    this.gameMode = '1p'; // '1p' (Rojo vs 3 Bots), '2p' (Rojo vs Amarillo en esquina opuesta), '4p' (4 humanos)
    this.currentTurnIndex = 0;
    this.currentDiceValue = 1;
    this.isRolling = false;
    this.isStepping = false;
    this.waitingForMove = false;
    this.activeLegalMoves = [];
    this.consecutiveSixes = 0;
    this.lastMovedToken = null;
    this.stepInterval = null;
    this.stats = StorageManager.getStats('parchis');

    this.initPlayers();
  }

  initPlayers() {
    if (this.gameMode === '2p') {
      // En 2 Jugadores: Solo una esquina (Rojo) y la opuesta (Amarillo). Azul y Verde desactivados
      this.players = [
        { id: 1, colorKey: 'red',    name: 'Rojo (P1)',     isBot: false, tokens: this.createTokens() },
        { id: 2, colorKey: 'yellow', name: 'Amarillo (P2)', isBot: false, tokens: this.createTokens() }
      ];
    } else if (this.gameMode === '1p') {
      // 1P vs 3 Bots
      this.players = [
        { id: 1, colorKey: 'red',    name: 'Rojo (Tú)',       isBot: false, tokens: this.createTokens() },
        { id: 2, colorKey: 'blue',   name: 'Azul (Bot)',      isBot: true,  tokens: this.createTokens() },
        { id: 3, colorKey: 'yellow', name: 'Amarillo (Bot)',  isBot: true,  tokens: this.createTokens() },
        { id: 4, colorKey: 'green',  name: 'Verde (Bot)',     isBot: true,  tokens: this.createTokens() }
      ];
    } else {
      // 4 Jugadores locales (Pasa y juega)
      this.players = [
        { id: 1, colorKey: 'red',    name: 'Rojo (P1)',     isBot: false, tokens: this.createTokens() },
        { id: 2, colorKey: 'blue',   name: 'Azul (P2)',     isBot: false, tokens: this.createTokens() },
        { id: 3, colorKey: 'yellow', name: 'Amarillo (P3)', isBot: false, tokens: this.createTokens() },
        { id: 4, colorKey: 'green',  name: 'Verde (P4)',    isBot: false, tokens: this.createTokens() }
      ];
    }
  }

  createTokens() {
    return [
      { id: 1, status: 'home', pos: 0 },
      { id: 2, status: 'home', pos: 0 },
      { id: 3, status: 'home', pos: 0 },
      { id: 4, status: 'home', pos: 0 }
    ];
  }

  mount() {
    this.container.classList.add('parchis-active');
    this.render();
    this.bindEvents();
    this.updateDiceState();
  }

  render() {
    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];
    const movableIds = this.activeLegalMoves.map(m => `${current.colorKey}_${m.token.id}`);

    const is2P = (this.gameMode === '2p');

    this.container.innerHTML = `
      <div class="game-hud">
        <div class="hud-top">
          <div class="mode-selector">
            <button class="mode-btn ${this.gameMode === '1p' ? 'active' : ''}" data-mode="1p">1P vs Bots</button>
            <button class="mode-btn ${this.gameMode === '2p' ? 'active' : ''}" data-mode="2p">2J (Opuestos)</button>
            <button class="mode-btn ${this.gameMode === '4p' ? 'active' : ''}" data-mode="4p">4 Jugadores</button>
          </div>
          <div class="scoreboard">
            <span class="score-item" style="color: #ef4444;">🔴: <b>${this.getGoalCount('red')}/4</b></span>
            ${!is2P ? `<span class="score-item" style="color: #38bdf8;">🔵: <b>${this.getGoalCount('blue')}/4</b></span>` : ''}
            <span class="score-item" style="color: #fbbf24;">🟡: <b>${this.getGoalCount('yellow')}/4</b></span>
            ${!is2P ? `<span class="score-item" style="color: #10b981;">🟢: <b>${this.getGoalCount('green')}/4</b></span>` : ''}
          </div>
        </div>
      </div>

      <div class="parchis-wrapper">
        <div class="parchis-board-container" id="parchis-board-container">
          ${ParchisBoardSVG.renderSVG(this.players, null, movableIds)}
        </div>

        <div class="oca-floating-controller">
          <div class="oca-status-bubble" id="parchis-status-msg">
            <b style="color: ${config.hex};">${config.name}:</b> ¡Toca el dado para tirar!
          </div>
          <button id="parchis-dice-action" class="dice-btn-action ready" aria-label="Tirar dado">
            <div class="dice-wrapper" id="parchis-dice-wrapper">
              <span id="parchis-dice-face">🎲</span>
            </div>
            <span class="dice-action-label" id="parchis-dice-label">¡TIRA!</span>
          </button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const modeBtns = this.container.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.target.dataset.mode;
        if (mode !== this.gameMode) {
          this.gameMode = mode;
          sound.playClick();
          this.reset();
        }
      });
    });

    const diceBtn = this.container.querySelector('#parchis-dice-action');
    diceBtn.addEventListener('click', () => {
      this.handlePlayerDiceRoll();
    });

    const boardContainer = this.container.querySelector('#parchis-board-container');
    boardContainer.addEventListener('click', (e) => {
      const tokenGroup = e.target.closest('.parchis-token-group.movable');
      if (!tokenGroup || !this.waitingForMove || this.isStepping) return;

      const tokenId = tokenGroup.dataset.tokenId;
      const move = this.activeLegalMoves.find(m => `${this.getCurrentPlayer().colorKey}_${m.token.id}` === tokenId);
      if (move) {
        this.executeMove(move);
      }
    });
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  getGoalCount(colorKey) {
    const player = this.players.find(p => p.colorKey === colorKey);
    return player ? player.tokens.filter(t => t.status === 'goal').length : 0;
  }

  handlePlayerDiceRoll() {
    if (this.isRolling || this.waitingForMove || this.isStepping) return;
    const current = this.getCurrentPlayer();
    if (current.isBot) return;

    this.rollDice();
  }

  rollDice() {
    this.isRolling = true;
    this.updateDiceState();

    const diceWrapper = this.container.querySelector('#parchis-dice-wrapper');
    const diceFace = this.container.querySelector('#parchis-dice-face');

    diceWrapper.classList.add('rolling');
    sound.playDice();
    Haptics.tap();

    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    let rollInterval = setInterval(() => {
      const rand = Math.floor(Math.random() * 6);
      diceFace.textContent = faces[rand];
    }, 75);

    setTimeout(() => {
      clearInterval(rollInterval);
      diceWrapper.classList.remove('rolling');

      const roll = Math.floor(Math.random() * 6) + 1;
      this.currentDiceValue = roll;
      diceFace.textContent = faces[roll - 1];

      this.processDiceResult(roll);
    }, 600);
  }

  processDiceResult(roll) {
    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];

    if (roll === 6) {
      this.consecutiveSixes++;
      if (this.consecutiveSixes === 3) {
        this.setStatus(`¡Tres 6 seguidos! La última ficha de <b>${config.name}</b> vuelve a casa.`);
        sound.playTrap();
        Haptics.trap();
        if (this.lastMovedToken && this.lastMovedToken.status !== 'goal') {
          this.lastMovedToken.status = 'home';
          this.lastMovedToken.pos = 0;
        }
        this.consecutiveSixes = 0;
        this.refreshBoard();
        setTimeout(() => this.nextTurn(), 900);
        return;
      }
    } else {
      this.consecutiveSixes = 0;
    }

    this.activeLegalMoves = ParchisAI.getLegalMoves(current, roll, this.players);

    if (this.activeLegalMoves.length === 0) {
      this.setStatus(`<b>${config.name}</b> sacó un <b>${roll}</b>. No tiene movimientos válidos. Pasa turno.`);
      setTimeout(() => {
        this.isRolling = false;
        this.nextTurn();
      }, 850);
      return;
    }

    if (current.isBot) {
      this.setStatus(`<b>${config.name}</b> sacó un <b>${roll}</b>. Pensando jugada...`);
      setTimeout(() => {
        const bestMove = ParchisAI.getBestMove(current, roll, this.players);
        this.executeMove(bestMove);
      }, 600);
    } else {
      this.waitingForMove = true;
      this.isRolling = false;
      this.setStatus(`<b>${config.name}</b> sacó un <b>${roll}</b>. ¡Toca la ficha resaltada en dorado para mover!`);
      this.refreshBoard();
      this.updateDiceState();
    }
  }

  executeMove(move) {
    this.waitingForMove = false;
    this.isRolling = false;
    this.isStepping = true;
    this.updateDiceState();

    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];
    const token = move.token;
    this.lastMovedToken = token;

    // Caso 1: Salir de casa con 5 (se coloca directamente en la salida de su color, 0 pasos adicionales)
    if (move.type === 'exit_home') {
      token.status = 'board';
      token.pos = move.destPos;
      sound.playDrop();
      Haptics.bump();
      this.speak('¡Salida!');
      this.setStatus(`¡<b>${config.name}</b> sacó un <b>5</b> y coloca su ficha en la <b>Salida (casilla ${move.destPos})</b>!`);
      this.refreshBoard();

      // Si había rival en salida, se lo come
      if (move.captures) {
        this.handleCapture(move.captures, token, () => this.concludeTurn());
      } else {
        setTimeout(() => this.concludeTurn(), 600);
      }
      return;
    }

    // Caso 2: Movimiento paso a paso contando 1, 2, 3...
    this.animateSteps(token, move, this.currentDiceValue, async () => {
      // Al llegar al destino final
      if (move.captures) {
        await this.handleCapture(move.captures, token, async () => {
          if (move.type === 'to_goal') {
            await this.handleGoal(token, () => this.concludeTurn());
          } else {
            this.concludeTurn();
          }
        });
      } else if (move.type === 'to_goal') {
        await this.handleGoal(token, () => this.concludeTurn());
      } else {
        this.concludeTurn();
      }
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Locución de palabra con espera asíncrona para sincronización exacta
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

        // Fallback garantizado por si onend no se emite en algún dispositivo móvil
        const maxWaitMs = Math.max(480, text.length * 105);
        setTimeout(done, maxWaitMs);

        window.speechSynthesis.speak(utter);
      } catch (_) {
        setTimeout(resolve, 360);
      }
    });
  }

  // Animación de conteo paso a paso (1, 2, 3...) perfectamente acompasada con la voz
  async animateSteps(token, move, totalSteps, onComplete) {
    this.isStepping = true;
    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];
    const numberWords = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis'];

    // Limpiar restos de voz anterior al inicio del movimiento
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    const isNormalDice = (totalSteps <= 6);

    for (let stepCount = 1; stepCount <= totalSteps; stepCount++) {
      if (!this.isStepping) break;

      // 1. Simular avance de una casilla
      if (token.status === 'board') {
        if (move.destType === 'corridor' || move.destType === 'goal') {
          // Ha entrado en el pasillo
          const distToEnt = ParchisAI.calcDistanceToEntrance(token.pos, config.metaEntrada);
          if (stepCount > distToEnt) {
            token.status = 'corridor';
            token.pos = stepCount - distToEnt;
          } else {
            token.pos++;
            if (token.pos > 68) token.pos = 1;
          }
        } else {
          token.pos++;
          if (token.pos > 68) token.pos = 1;
        }
      } else if (token.status === 'corridor') {
        token.pos++;
        if (token.pos > 8) token.pos = 8;
      }

      if (stepCount === totalSteps) {
        token.status = move.destType;
        token.pos = move.destPos;
      }

      // 2. Refrescar visualmente el tablero y reproducir efecto sonoro
      this.refreshBoard();
      sound.playStep(stepCount);
      Haptics.tap();

      if (isNormalDice) {
        // Tirada normal de dado (1 a 6):
        // Cada salto va acompasado con la voz. El siguiente paso solo empieza cuando termina de hablar
        const word = numberWords[stepCount - 1] || stepCount.toString();
        this.setStatus(`<b>${config.name}</b>: <b>¡${word.toUpperCase()}!</b>`);

        await this.speakWord(word, 1.3);
        await this.delay(80); // Pausa rítmica natural entre saltos
      } else {
        // Modo bonus (+20 al comer o +10 al entrar a meta):
        const isMilestone = (stepCount % 5 === 0) || (stepCount === totalSteps);

        if (isMilestone) {
          // Hitos (5, 10, 15, 20): La ficha se detiene brevemente y canta el número nítidamente
          const milestoneNames = { 5: 'cinco', 10: 'diez', 15: 'quince', 20: 'veinte' };
          const spoken = milestoneNames[stepCount] || stepCount.toString();

          this.setStatus(`<b>${config.name}</b>: contando <b>+${stepCount}</b> (${spoken})`);
          await this.speakWord(spoken, 1.35);
          await this.delay(120);
        } else {
          // Pasos intermedios rápidos con sonido musical
          this.setStatus(`<b>${config.name}</b>: contando <b>+${stepCount}</b>...`);
          await this.delay(160);
        }
      }
    }

    this.isStepping = false;
    await this.delay(180);
    onComplete();
  }

  async handleCapture(captured, eatingToken, onDone) {
    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];
    
    // Devolver rival a casa
    const victimPlayer = this.players.find(p => p.colorKey === captured.colorKey);
    if (victimPlayer) {
      const victimToken = victimPlayer.tokens.find(t => t.id === captured.id);
      if (victimToken) {
        victimToken.status = 'home';
        victimToken.pos = 0;
      }
    }
    sound.playWin();
    Haptics.win();
    this.refreshBoard();

    this.setStatus(`¡<b>${config.name}</b> se come una ficha rival y cuenta <b>+20 casillas</b>!`);
    await this.speakWord('¡Te como! Veinte', 1.25);
    await this.delay(250);

    // Contar +20 casillas paso a paso
    let targetPos = eatingToken.pos + 20;
    if (targetPos > 68) targetPos -= 68;

    const bonusMove = {
      token: eatingToken,
      destType: 'board',
      destPos: targetPos
    };

    await this.animateSteps(eatingToken, bonusMove, 20, onDone);
  }

  async handleGoal(token, onDone) {
    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];

    sound.playGoose();
    Haptics.win();
    this.setStatus(`¡<b>${config.name}</b> mete una ficha en la META y cuenta <b>+10 casillas</b>!`);

    if (current.tokens.every(t => t.status === 'goal')) {
      this.handleVictory(current);
      return;
    }

    await this.speakWord('¡Meta! Diez', 1.25);
    await this.delay(250);

    // Contar +10 con otra ficha que esté en el tablero
    const otherToken = current.tokens.find(t => t.status === 'board' || t.status === 'corridor');
    if (otherToken && otherToken.status === 'board') {
      let targetPos = otherToken.pos + 10;
      if (targetPos > 68) targetPos -= 68;
      const bonusMove = { token: otherToken, destType: 'board', destPos: targetPos };
      await this.animateSteps(otherToken, bonusMove, 10, onDone);
    } else {
      onDone();
    }
  }

  concludeTurn() {
    this.isStepping = false;
    this.activeLegalMoves = [];
    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];
    const repeatTurn = (this.currentDiceValue === 6);

    if (repeatTurn) {
      this.setStatus(`¡Ha salido un <b>6</b>! <b>${config.name}</b> vuelve a tirar.`);
      this.updateDiceState();
      if (current.isBot) {
        setTimeout(() => this.rollDice(), 700);
      }
    } else {
      this.nextTurn();
    }
  }

  nextTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    this.activeLegalMoves = [];
    this.waitingForMove = false;
    this.isRolling = false;
    this.isStepping = false;
    this.refreshBoard();
    this.updateDiceState();

    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];

    if (current.isBot) {
      this.setStatus(`Turno de <b style="color: ${config.hex};">${config.name}</b> (Bot). Tirando...`);
      setTimeout(() => this.rollDice(), 800);
    } else {
      this.setStatus(`<b style="color: ${config.hex};">${config.name}:</b> ¡Toca el dado para tirar!`);
    }
  }

  refreshBoard() {
    const boardContainer = this.container.querySelector('#parchis-board-container');
    if (!boardContainer) return;

    const current = this.getCurrentPlayer();
    const movableIds = this.activeLegalMoves.map(m => `${current.colorKey}_${m.token.id}`);
    boardContainer.innerHTML = ParchisBoardSVG.renderSVG(this.players, null, movableIds);
  }

  // Borde dinámico del dado según el color del jugador en turno
  updateDiceState() {
    const diceAction = this.container.querySelector('#parchis-dice-action');
    const diceWrapper = this.container.querySelector('#parchis-dice-wrapper');
    const actionLabel = this.container.querySelector('#parchis-dice-label');
    if (!diceAction || !diceWrapper || !actionLabel) return;

    const current = this.getCurrentPlayer();
    const config = PARCHIS_COLORS[current.colorKey];
    const canRoll = !this.isRolling && !this.waitingForMove && !this.isStepping && !current.isBot;

    // Borde dinámico del color del jugador actual
    diceWrapper.style.setProperty('--dice-player-color', config.hex);
    diceWrapper.style.borderColor = config.hex;
    diceWrapper.style.borderWidth = '3px';

    if (canRoll) {
      diceAction.classList.add('ready');
      diceWrapper.style.boxShadow = `0 0 16px ${config.hex}, 0 6px 16px rgba(0, 0, 0, 0.5)`;
      actionLabel.textContent = '¡TIRA!';
      actionLabel.style.color = config.hex;
    } else {
      diceAction.classList.remove('ready');
      diceWrapper.style.boxShadow = `0 0 6px ${config.hex}88, 0 4px 10px rgba(0, 0, 0, 0.4)`;
      if (this.waitingForMove) {
        actionLabel.textContent = 'ELIGE';
        actionLabel.style.color = '#ffd700';
      } else {
        actionLabel.textContent = (this.isRolling || this.isStepping) ? 'MOVIENDO...' : 'ESPERA';
        actionLabel.style.color = 'var(--text-muted)';
      }
    }
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
    const el = this.container.querySelector('#parchis-status-msg');
    if (el) el.innerHTML = html;
  }

  handleVictory(winner) {
    sound.playWin();
    Haptics.win();

    this.stats = StorageManager.recordWin('parchis', winner.id === 1 ? 'p1' : 'p2');

    setTimeout(() => {
      this.onShowModal({
        icon: '👑',
        title: `¡${PARCHIS_COLORS[winner.colorKey].name} ha Ganado!`,
        desc: `¡Ha coronado sus 4 fichas en la meta del Parchís!`,
        onRetry: () => this.reset()
      });
    }, 600);
  }

  reset() {
    this.isStepping = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }
    this.initPlayers();
    this.currentTurnIndex = 0;
    this.isRolling = false;
    this.waitingForMove = false;
    this.activeLegalMoves = [];
    this.consecutiveSixes = 0;
    this.lastMovedToken = null;
    this.render();
    this.bindEvents();
    this.updateDiceState();
  }

  destroy() {
    this.isStepping = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }
    this.container.classList.remove('parchis-active');
    this.container.innerHTML = '';
  }
}
