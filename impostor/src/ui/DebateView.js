/* ==========================================================================
   IMPOSTOR - Debate View (Countdown Timer & Discussion)
   ========================================================================== */

import { Timer } from '../core/Timer.js';
import { sound } from '../audio/soundEngine.js';

export class DebateView {
  constructor(engine) {
    this.engine = engine;
    this.timer = null;
  }

  render(container) {
    const isManual = this.engine.debateDuration === 0;
    const activePlayers = this.engine.getActivePlayers();

    container.innerHTML = `
      <div class="view-container anim-fade-in-up">
        <!-- Title & Info -->
        <div style="text-align: center; margin-bottom: 10px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 45, 85, 0.15); padding: 6px 16px; border-radius: var(--radius-full); border: 1px solid var(--crimson); margin-bottom: 8px;">
            <span style="font-size: 0.8rem; font-weight: 800; color: var(--crimson); text-transform: uppercase; letter-spacing: 0.06em;">
              🗣️ Fase de Debate
            </span>
          </div>
          <h2 class="font-heading" style="font-size: 1.7rem; color: #fff;">
            ¿Quién es el Impostor?
          </h2>
          <p style="font-size: 0.86rem; color: var(--text-muted); max-width: 320px; margin: 4px auto 0;">
            Analizad las pistas que ha dicho cada jugador y contrastad sospechas.
          </p>
        </div>

        <!-- Timer Circle Container -->
        <div class="timer-container">
          ${isManual ? `
            <div style="width: 180px; height: 180px; border-radius: var(--radius-full); background: var(--bg-surface-glass); border: 2px dashed var(--border-glass-strong); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px;">
              <span style="font-size: 2rem;">⏳</span>
              <span style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: #fff; margin-top: 6px;">Tiempo Libre</span>
              <span style="font-size: 0.75rem; color: var(--text-muted);">Debatid sin prisas</span>
            </div>
          ` : `
            <svg class="timer-svg" viewBox="0 0 100 100">
              <circle class="timer-circle-bg" cx="50" cy="50" r="42" />
              <circle id="timer-progress" class="timer-circle-progress" cx="50" cy="50" r="42" stroke-dasharray="264" stroke-dashoffset="0" />
            </svg>
            <div class="timer-inner-content">
              <span id="timer-number" class="timer-digits">${this.engine.debateDuration}</span>
              <span class="timer-label">segundos</span>
            </div>
          `}
        </div>

        <!-- Timer Controls (if not manual) -->
        ${!isManual ? `
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 20px;">
            <button id="toggle-pause-btn" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 6px;">
              <span id="pause-icon">⏸️</span>
              <span id="pause-text">Pausar</span>
            </button>
            <button id="add-time-btn" class="btn btn-secondary btn-sm">
              +30 seg
            </button>
          </div>
        ` : ''}

        <!-- Active Suspects Chips -->
        <div class="glass-card" style="padding: 12px; margin-bottom: 20px;">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 8px;">
            Jugadores en juego (${activePlayers.length}):
          </span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${activePlayers.map(p => `
              <div style="display: flex; align-items: center; gap: 6px; background: var(--bg-surface); border: 1px solid var(--border-glass); padding: 4px 10px; border-radius: var(--radius-full); font-size: 0.84rem;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: ${p.color};"></span>
                <span style="font-weight: 600; color: #fff;">${p.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- CTA Vote Button -->
        <button id="start-voting-btn" class="btn btn-primary anim-pulse-glow" style="margin-top: auto; font-size: 1.15rem;">
          <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: currentColor;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
          Iniciar Votación en Pantalla
        </button>
      </div>
    `;

    this.bindEvents(container, isManual);
  }

  bindEvents(container, isManual) {
    const voteBtn = container.querySelector('#start-voting-btn');
    const goToVoting = () => {
      sound.playTap();
      if (this.timer) {
        this.timer.pause();
      }
      this.engine.startVotingPhase();
    };

    voteBtn.addEventListener('click', goToVoting);

    if (isManual) return;

    const timerNumber = container.querySelector('#timer-number');
    const timerProgress = container.querySelector('#timer-progress');
    const pauseBtn = container.querySelector('#toggle-pause-btn');
    const pauseIcon = container.querySelector('#pause-icon');
    const pauseText = container.querySelector('#pause-text');
    const addTimeBtn = container.querySelector('#add-time-btn');

    const circumference = 2 * Math.PI * 42; // ~263.89

    this.timer = new Timer({
      duration: this.engine.debateDuration,
      onTick: (left, total) => {
        timerNumber.textContent = left;
        const offset = circumference - (left / total) * circumference;
        timerProgress.style.strokeDashoffset = offset;

        if (left <= 15) {
          timerProgress.classList.add('urgent');
          sound.playTick(true);
        } else {
          timerProgress.classList.remove('urgent');
          sound.playTick(false);
        }
      },
      onUrgent: (left) => {
        // Handled in onTick
      },
      onComplete: () => {
        sound.playGong();
        this.engine.startVotingPhase();
      }
    });

    this.timer.start();

    pauseBtn.addEventListener('click', () => {
      sound.playTap();
      if (this.timer.isRunning) {
        this.timer.pause();
        pauseIcon.textContent = '▶️';
        pauseText.textContent = 'Reanudar';
      } else {
        this.timer.resume();
        pauseIcon.textContent = '⏸️';
        pauseText.textContent = 'Pausar';
      }
    });

    addTimeBtn.addEventListener('click', () => {
      sound.playTap();
      this.timer.addTime(30);
    });
  }
}
