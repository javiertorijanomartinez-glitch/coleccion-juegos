/* ==========================================================================
   IMPOSTOR - Clues View (Randomized Turn-by-Turn Speaking Round)
   ========================================================================== */

import { sound } from '../audio/soundEngine.js';

export class CluesView {
  constructor(engine) {
    this.engine = engine;
  }

  render(container) {
    const speaker = this.engine.getCurrentSpeaker();
    const nextSpeaker = this.engine.getNextSpeaker();
    const isLastSpeakerInRound = this.engine.currentSpeakerIndex >= this.engine.speakerOrder.length - 1;
    const isFinalRound = this.engine.currentRound >= this.engine.totalClueRounds;

    container.innerHTML = `
      <div class="view-container anim-fade-in-up">
        <!-- Top Status -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: var(--bg-surface-glass); padding: 6px 14px; border-radius: var(--radius-full); border: 1px solid var(--border-glass);">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--cyan); text-transform: uppercase;">
              Ronda ${this.engine.currentRound} de ${this.engine.totalClueRounds}
            </span>
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">
            Turno ${this.engine.currentSpeakerIndex + 1} de ${this.engine.speakerOrder.length}
          </span>
        </div>

        <!-- Speaker Spotlight Card -->
        <div class="glass-card anim-fade-in" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 36px 20px; text-align: center; margin: auto 0; border: 2px solid ${speaker.color}; box-shadow: 0 0 30px ${speaker.color}33;">
          <span style="font-size: 0.88rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
            🎙️ Turno de hablar en voz alta
          </span>

          <div style="width: 90px; height: 90px; border-radius: var(--radius-full); background: ${speaker.color}; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; color: #fff; margin-bottom: 16px; box-shadow: 0 4px 20px ${speaker.color}66;">
            ${speaker.name.charAt(0).toUpperCase()}
          </div>

          <h2 class="font-heading" style="font-size: 2.2rem; color: #fff; line-height: 1.1; margin-bottom: 12px;">
            ${speaker.name}
          </h2>

          <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 290px; line-height: 1.5;">
            Di una sola palabra o pista sutil relacionada con tu palabra secreta.
          </p>

          ${nextSpeaker && nextSpeaker.id !== speaker.id ? `
            <div style="margin-top: 24px; padding: 8px 16px; background: var(--bg-surface); border-radius: var(--radius-full); border: 1px solid var(--border-glass); font-size: 0.82rem; color: var(--text-subtle);">
              Siguiente turno: <strong style="color: #fff;">${nextSpeaker.name}</strong>
            </div>
          ` : ''}
        </div>

        <!-- Actions -->
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: auto;">
          <button id="next-speaker-btn" class="btn btn-primary" style="font-size: 1.1rem;">
            ${isLastSpeakerInRound && isFinalRound ? '¡Finalizar Pistas e Ir a Debate!' : 'Siguiente Pista →'}
          </button>
          
          <button id="skip-to-debate-btn" class="btn btn-ghost btn-sm">
            Ir a Debate ahora
          </button>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const nextBtn = container.querySelector('#next-speaker-btn');
    const skipBtn = container.querySelector('#skip-to-debate-btn');

    nextBtn.addEventListener('click', () => {
      sound.playTurn();
      this.engine.advanceSpeaker();
    });

    skipBtn.addEventListener('click', () => {
      sound.playTap();
      this.engine.startDebatePhase();
    });
  }
}
